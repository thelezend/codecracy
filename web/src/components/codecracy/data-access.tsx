"use client";

import {
  deriveLookupTableAddress,
  getMemberPda,
  getPollPda,
  getProjectPda,
  getVaultPda,
  getVotePda,
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
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAnchorProvider, useNetwork } from "../solana/solana-provider";
import { errorToast, successToast } from "./tx-toast";

export function useCodecracyProgram() {
  const userWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { network } = useNetwork();
  const provider = useAnchorProvider();
  const program = getCodecracyProgram(provider);

  if (!userWallet) {
    throw new Error("Wallet not connected");
  }

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
      successToast(network, tx);
      return getProjects.refetch();
    },
    onError: (error) => {
      errorToast();
      console.error("Project creation failed", error);
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

  const useAddMember = (project: PublicKey) => {
    const getTeamMembers = useGetMembers([
      {
        memcmp: { offset: 8, bytes: project.toBase58() },
      },
    ]);

    return useMutation({
      mutationKey: ["codecracy", "addMember", network, project.toBase58()],
      mutationFn: async ({
        githubHandle,
        newUser,
      }: {
        githubHandle: string;
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
      onSuccess: (tx) => {
        successToast(network, tx);
        return getTeamMembers.refetch();
      },
      onError: (error) => {
        errorToast();
        console.error("Error adding member:", error);
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

  const useGetVaultBalance = (projectAddress: string) => {
    const vault = getVaultPda(new PublicKey(projectAddress), program.programId);

    return useQuery({
      queryKey: ["codecracy", "vaultBalance", network, projectAddress],
      queryFn: async () => await connection.getBalance(vault),
    });
  };

  const useAddFunds = (projectAddress: string) => {
    const vault = getVaultPda(new PublicKey(projectAddress), program.programId);
    const vaultBalance = useGetVaultBalance(projectAddress);

    return useMutation({
      mutationKey: ["codecracy", "addFunds", network, projectAddress],
      mutationFn: async (solAmount: number) => {
        if (!userWallet) return;

        const versionedTx = new VersionedTransaction(
          new TransactionMessage({
            payerKey: userWallet.publicKey,
            recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
            instructions: [
              SystemProgram.transfer({
                fromPubkey: userWallet.publicKey,
                toPubkey: vault,
                lamports: solAmount * LAMPORTS_PER_SOL,
              }),
            ],
          }).compileToV0Message()
        );

        return await provider.sendAndConfirm(versionedTx);
      },
      onSuccess: (tx) => {
        successToast(network, tx);
        return vaultBalance.refetch();
      },
      onError: (error) => {
        errorToast();
        console.error("Error adding funds:", error);
      },
    });
  };

  const useClaim = (
    projectAddress: PublicKey,
    memberStateAddress: PublicKey
  ) => {
    const getVaultBalance = useGetVaultBalance(projectAddress.toBase58());

    return useMutation({
      mutationKey: [
        "codecracy",
        "claim",
        network,
        projectAddress,
        memberStateAddress,
      ],
      mutationFn: async () => {
        if (!userWallet) return;

        const projectState = await program.account.project.fetch(
          projectAddress
        );
        const lutAccount = (
          await provider.connection.getAddressLookupTable(projectState.teamLut)
        ).value;

        if (!lutAccount) return;
        const remaining_accounts = lutAccount.state.addresses.map((addr) => ({
          pubkey: addr,
          isSigner: false,
          isWritable: false,
        }));

        const vault = getVaultPda(projectAddress, CODECRACY_PROGRAM_ID);

        const ix = await program.methods
          .claim()
          .accountsStrict({
            vault,
            member: memberStateAddress,
            project: projectAddress,
            user: userWallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .remainingAccounts(remaining_accounts)
          .instruction();

        const versionedTx = new VersionedTransaction(
          new TransactionMessage({
            payerKey: userWallet.publicKey,
            recentBlockhash: (await provider.connection.getLatestBlockhash())
              .blockhash,
            instructions: [ix],
          }).compileToV0Message([lutAccount])
        );
        const signedTx = await userWallet.signTransaction(versionedTx);
        const tx = await provider.connection.sendTransaction(signedTx);

        return tx;
      },
      onError: (error) => {
        errorToast();
        console.error("Error claiming funds:", error);
      },
      onSuccess: (tx) => {
        successToast(network, tx);
        return getVaultBalance.refetch();
      },
    });
  };

  const useCloseProject = (projectAddress: PublicKey) => {
    const vault = getVaultPda(projectAddress, CODECRACY_PROGRAM_ID);
    const getProject = useGetProject(projectAddress.toBase58());

    return useMutation({
      mutationKey: ["codecracy", "closeProject", network, projectAddress],
      mutationFn: async () => {
        if (!userWallet) return;

        const tx = await program.methods
          .closeProject()
          .accountsStrict({
            vault,
            admin: userWallet.publicKey,
            project: projectAddress,
          })
          .rpc();
        return tx;
      },
      onSuccess: (tx) => {
        successToast(network, tx);
        return getProject.refetch();
      },
      onError: (error) => {
        errorToast();
        console.error("Error closing project:", error);
      },
    });
  };

  const useCreatePoll = (projectAddress: PublicKey) => {
    const getPollsList = useGetPollsList(projectAddress.toBase58());

    return useMutation({
      mutationKey: ["codecracy", "createPoll", network, projectAddress],
      mutationFn: async ({
        pullRequest,
        closeTime,
      }: {
        pullRequest: number;
        closeTime: number;
      }) => {
        if (!userWallet) return;
        const memberPda = getMemberPda(
          projectAddress,
          userWallet.publicKey,
          CODECRACY_PROGRAM_ID
        );
        const pollPda = getPollPda(
          pullRequest,
          projectAddress,
          CODECRACY_PROGRAM_ID
        );

        return await program.methods
          .startPoll(pullRequest, new BN(closeTime))
          .accountsStrict({
            project: projectAddress,
            member: memberPda,
            poll: pollPda,
            user: userWallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
      },
      onSuccess: (tx) => {
        successToast(network, tx);
        return getPollsList.refetch();
      },
      onError: (error) => {
        errorToast();
        console.error("Error creating poll:", error);
      },
    });
  };

  const useGetMember = (projectAddress: PublicKey, user: PublicKey) => {
    const memberStatePda = getMemberPda(
      projectAddress,
      user,
      CODECRACY_PROGRAM_ID
    );
    return useQuery({
      queryKey: ["codecracy", "member", projectAddress, user],
      queryFn: async () => await program.account.member.fetch(memberStatePda),
    });
  };

  const useCastVote = (projectAddress: PublicKey) => {
    const getPollsList = useGetPollsList(projectAddress.toBase58());
    return useMutation({
      mutationKey: ["codecracy", "castVote", network, projectAddress],
      mutationFn: async ({
        pollAddress,
        voteType,
      }: {
        pollAddress: PublicKey;
        voteType: (typeof VoteTypes)[keyof typeof VoteTypes];
      }) => {
        if (!userWallet) return;

        const pollData = await program.account.poll.fetch(pollAddress);
        const votePda = getVotePda(pollAddress, userWallet.publicKey);
        const pollInitializorMember = getMemberPda(
          projectAddress,
          pollData.user,
          CODECRACY_PROGRAM_ID
        );

        return await program.methods
          .castVote(voteType)
          .accountsStrict({
            project: projectAddress,
            voter: userWallet.publicKey,
            poll: pollAddress,
            vote: votePda,
            systemProgram: SystemProgram.programId,
            pollInitializorMember,
          })
          .rpc();
      },
      onSuccess: (tx) => {
        successToast(network, tx);
        return getPollsList.refetch();
      },
      onError: (error) => {
        errorToast();
        console.error("Error casting vote:", error);
      },
    });
  };

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
    useGetVaultBalance,
    useAddFunds,
    useClaim,
    useCloseProject,
    useCreatePoll,
    useGetMember,
    useCastVote,
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

export const VoteTypes = {
  Low: { low: {} },
  Medium: { medium: {} },
  High: { high: {} },
  Reject: { reject: {} },
} as const;
