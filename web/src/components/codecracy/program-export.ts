import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import type { Codecracy } from "../../../idl/codecracy";
import CodecracyIDL from "../../../idl/codecracy.json";

// Re-export the generated IDL and type
export { Codecracy, CodecracyIDL };

// The programId is imported from the program IDL.
export const CODECRACY_PROGRAM_ID = new web3.PublicKey(CodecracyIDL.address);

// This is a helper function to get the Codecracy Anchor program.
export function getCodecracyProgram(provider: AnchorProvider) {
  return new Program(CodecracyIDL as Codecracy, provider);
}

type CodecracyProgram = ReturnType<typeof getCodecracyProgram>;

export type Project = Awaited<
  ReturnType<CodecracyProgram["account"]["project"]["all"]>
>;
export type Member = Awaited<
  ReturnType<CodecracyProgram["account"]["member"]["all"]>
>;
export type Poll = Awaited<
  ReturnType<CodecracyProgram["account"]["poll"]["all"]>
>;
export type Vote = Awaited<
  ReturnType<CodecracyProgram["account"]["vote"]["all"]>
>;
