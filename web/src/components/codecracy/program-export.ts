import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import CodecracyIDL from "./idl/codecracy.json";
import type { Codecracy } from "./idl/types";

// Re-export the generated IDL and type
export { Codecracy, CodecracyIDL };

// The programId is imported from the program IDL.
export const CODECRACY_PROGRAM_ID = new web3.PublicKey(CodecracyIDL.address);

// This is a helper function to get the Codecracy Anchor program.
export function getCodecracyProgram(provider: AnchorProvider) {
  return new Program(CodecracyIDL as Codecracy, provider);
}
