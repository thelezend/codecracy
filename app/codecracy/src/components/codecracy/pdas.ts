import { BN } from "@coral-xyz/anchor";
import { AddressLookupTableProgram, PublicKey } from "@solana/web3.js";

const PROJECT_CONFIG_SEED = "project-config";
const VAULT_SEED = "vault";

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

export function deriveLookupTableAddress(authority: PublicKey, slot: BN) {
  const seeds = [authority.toBuffer(), slot.toArrayLike(Buffer, "le", 8)];
  return PublicKey.findProgramAddressSync(
    seeds,
    AddressLookupTableProgram.programId
  )[0];
}
