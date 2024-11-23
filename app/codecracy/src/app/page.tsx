"use client";

import { CreateProjectButton } from "@/components/create-project-button";
import { ProjectList } from "@/components/project-list";
import { WalletPrompt } from "@/components/solana/wallet-prompt";
import { TypographyH2 } from "@/components/typography/h2";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

export default function Dashboard() {
  const userWallet = useAnchorWallet();

  if (!userWallet?.publicKey) {
    return <WalletPrompt />;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <div className="flex items-center">
        <TypographyH2>Projects</TypographyH2>
        <CreateProjectButton />
      </div>

      <ProjectList />
    </div>
  );
}
