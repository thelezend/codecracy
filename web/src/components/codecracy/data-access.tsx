"use client";

import {
  deriveLookupTableAddress,
  getMemberPda,
  getProjectPda,
  getVaultPda,
} from "@/components/codecracy/pdas";
import {
  CODECRACY_PROGRAM_ID,
  getCodecracyProgram,
} from "@/components/codecracy/program-export";
import { BN } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  AddressLookupTableProgram,
  GetProgramAccountsFilter,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAnchorProvider, useNetwork } from "../solana/solana-provider";

export function useCodecracyProgram() {
  const userWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { network } = useNetwork();
  const provider = useAnchorProvider();
  const program = getCodecracyProgram(provider);

  const getProjects = useQuery({
    queryKey: [
      "codecracy",
      "projects",
      network,
      userWallet?.publicKey.toBase58(),
    ],
    queryFn: async () => {
      if (!userWallet?.publicKey) return [];

      const [projectPdas, memberPdas] = await Promise.all([
        program.account.project.all([
          { memcmp: { offset: 8, bytes: userWallet.publicKey.toBase58() } },
        ]),
        program.account.member.all([
          {
            memcmp: { offset: 8 + 32, bytes: userWallet.publicKey.toBase58() },
          },
        ]),
      ]);

      const fetchProjectData = async (
        projectAccount: {
          admin: PublicKey;
          projectName: string;
          githubHandle: string;
          teamLut: PublicKey;
          isActive: boolean;
          bump: number;
          vaultBump: number;
        },
        pubkey: PublicKey
      ) => {
        const lut = await connection.getAddressLookupTable(
          new PublicKey(projectAccount.teamLut)
        );
        return {
          pubkey,
          teamAddresses: lut.value?.state.addresses || [],
          ...projectAccount,
        };
      };

      const adminProjects = await Promise.all(
        projectPdas.map((project) =>
          fetchProjectData(project.account, project.publicKey)
        )
      );

      const memberProjects = await Promise.all(
        memberPdas.map(async (member) => {
          const projectData = await program.account.project.fetch(
            member.account.project
          );
          return fetchProjectData(projectData, member.account.project);
        })
      );

      const allProjects = [...adminProjects, ...memberProjects];
      return Array.from(
        new Set(allProjects.map((p) => p.pubkey.toBase58()))
      ).map((pubkey) =>
        allProjects.find((p) => p.pubkey.toBase58() === pubkey)
      );
    },
  });

  const useGetMembers = (filters?: Buffer | GetProgramAccountsFilter[]) => {
    return useQuery({
      queryKey: [
        "codecracy",
        "members",
        network,
        userWallet?.publicKey.toBase58(),
        filters,
      ],
      queryFn: async () => {
        if (!userWallet?.publicKey) return [];
        return await program.account.member.all(filters);
      },
    });
  };

  const createProject = useMutation({
    mutationKey: ["codecracy", "createProject", network],
    mutationFn: async ({
      projectName,
      githubHandle,
    }: {
      projectName: string;
      githubHandle: string;
    }) => {
      if (!userWallet) return;

      const project = getProjectPda(
        projectName,
        githubHandle,
        program.programId
      );
      const vault = getVaultPda(project, program.programId);
      const slot = new BN(await connection.getSlot());
      const lookupTable = deriveLookupTableAddress(project, slot);

      const tx = await program.methods
        .initializeProject(projectName, githubHandle, slot)
        .accountsStrict({
          admin: userWallet.publicKey,
          project,
          vault,
          lookupTable,
          atlProgram: AddressLookupTableProgram.programId,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      return tx;
    },
    onSuccess: (tx) => {
      console.log(tx);
      return getProjects.refetch();
    },
  });

  const useGetProject = (projectPubkey: string) => {
    return useQuery({
      queryKey: ["codecracy", "project", projectPubkey],
      queryFn: async () => await program.account.project.fetch(projectPubkey),
    });
  };

  const useFetchLookupTableAddresses = (address: string | undefined) => {
    return useQuery({
      queryKey: ["codecracy", "lookupTable", address],
      queryFn: async () => {
        if (!address) return;

        const data = await connection.getAddressLookupTable(
          new PublicKey(address)
        );
        return data.value?.state.addresses;
      },
    });
  };

  const useAddMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationKey: ["codecracy", "addMember", network],
      mutationFn: async ({
        githubHandle,
        project,
        newUser,
      }: {
        githubHandle: string;
        project: PublicKey;
        newUser: PublicKey;
      }) => {
        if (!userWallet) return;

        const projectData = await program.account.project.fetch(project);

        const member = getMemberPda(project, newUser, program.programId);

        const tx = await program.methods
          .addMember(githubHandle)
          .accountsStrict({
            admin: userWallet.publicKey,
            project,
            member,
            newUser,
            teamLut: projectData.teamLut,
            atlProgram: AddressLookupTableProgram.programId,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        return tx;
      },
      onMutate: (variables) => {
        return variables;
      },
      onSuccess: (tx, { project }) => {
        console.log(tx);
        const filters = [
          {
            memcmp: {
              offset: 8 + 32,
              bytes: project.toBase58(),
            },
          },
        ];
        queryClient.invalidateQueries({
          queryKey: [
            "codecracy",
            "members",
            network,
            userWallet?.publicKey.toBase58(),
            filters,
          ],
        });
      },
    });
  };

  const useGetPollsList = (projectAddress: string) =>
    useQuery({
      queryKey: ["codecracy", "polls", network, userWallet, projectAddress],
      queryFn: async () => {
        return await program.account.poll.all([
          {
            memcmp: {
              offset: 8 + 32,
              bytes: projectAddress,
            },
          },
        ]);
      },
    });

  return {
    program,
    CODECRACY_PROGRAM_ID,
    getProjects,
    useGetMembers,
    createProject,
    useGetProject,
    useFetchLookupTableAddresses,
    useAddMember,
    useGetPollsList,
  };
}

export interface Project {
  pubkey: PublicKey;
  teamAddresses: PublicKey[];
  admin: PublicKey;
  projectName: string;
  githubHandle: string;
  teamLut: PublicKey;
  isActive: boolean;
  bump: number;
  vaultBump: number;
}
