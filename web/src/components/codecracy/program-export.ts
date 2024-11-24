import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import CodecracyIDL from "../../../../target/idl/codecracy.json";
import type { Codecracy } from "../../../../target/types/codecracy";

// Re-export the generated IDL and type
export { Codecracy, CodecracyIDL };

// The programId is imported from the program IDL.
export const CODECRACY_PROGRAM_ID = new web3.PublicKey(CodecracyIDL.address);

// This is a helper function to get the Codecracy Anchor program.
export function getCodecracyProgram(provider: AnchorProvider) {
  return new Program(CodecracyIDL as Codecracy, provider);
}
