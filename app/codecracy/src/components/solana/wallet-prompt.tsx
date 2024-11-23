"use client";

import { TypographyH3 } from "../typography/h3";
import { WalletConnection } from "./wallet-connection";

export function WalletPrompt() {
  return (
    <div className="container flex flex-col items-center justify-center gap-4 mt-10">
      <TypographyH3>Please connect your wallet</TypographyH3>
      <WalletConnection />
    </div>
  );
}
