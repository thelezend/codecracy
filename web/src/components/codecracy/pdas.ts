import { BN } from "@coral-xyz/anchor";
import { AddressLookupTableProgram, PublicKey } from "@solana/web3.js";
import { CODECRACY_PROGRAM_ID } from "./program-export";

const PROJECT_CONFIG_SEED = "project-config";
const VAULT_SEED = "vault";
const MEMBER_SEED = "member";
const POLL_SEED = "poll";

export function getProjectPda(
  projectName: string,
  githubHandle: string,
  programId: PublicKey
) {
  const seeds = [
    Buffer.from(PROJECT_CONFIG_SEED),
    Buffer.from(projectName),
    Buffer.from(githubHandle),
  ];
  return PublicKey.findProgramAddressSync(seeds, programId)[0];
}

export function getVaultPda(project: PublicKey, programId: PublicKey) {
  const seeds = [Buffer.from(VAULT_SEED), project.toBuffer()];
  return PublicKey.findProgramAddressSync(seeds, programId)[0];
}

export function getMemberPda(
  project: PublicKey,
  memberPubkey: PublicKey,
  programId: PublicKey
) {
  const seeds = [
    Buffer.from(MEMBER_SEED),
    project.toBuffer(),
    memberPubkey.toBuffer(),
  ];
  return PublicKey.findProgramAddressSync(seeds, programId)[0];
}

export function getPollPda(
  pull_request: number,
  project: PublicKey,
  programId: PublicKey
) {
  const seeds = [
    Buffer.from(POLL_SEED),
    new BN(pull_request).toArrayLike(Buffer, "le", 4),
    project.toBuffer(),
  ];
  return PublicKey.findProgramAddressSync(seeds, programId)[0];
}

export function getVotePda(poll: PublicKey, user: PublicKey) {
  const seeds = [Buffer.from("vote"), poll.toBuffer(), user.toBuffer()];
  return PublicKey.findProgramAddressSync(seeds, CODECRACY_PROGRAM_ID)[0];
}

export function deriveLookupTableAddress(authority: PublicKey, slot: BN) {
  const seeds = [authority.toBuffer(), slot.toArrayLike(Buffer, "le", 8)];
  return PublicKey.findProgramAddressSync(
    seeds,
    AddressLookupTableProgram.programId
  )[0];
}
