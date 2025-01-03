"use client";

import { AnimatedButton } from "@/components/ui/animated-button";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ArrowUpRight, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCodecracyProgram } from "../../codecracy/data-access";
import { useNetwork } from "../../solana/solana-provider";
import { TypographyMuted } from "../../typography/muted";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";
import { AddFundsButton } from "./add-funds-button";
import { ClaimFundsButton } from "./claim-funds-button";
import { CloseProjectButton } from "./close-project-button";
import Scoreboard from "./scoreboard/scoreboard";

// Address Link Component
function AddressLink({
  address,
  network,
}: {
  address?: string;
  network: string;
}) {
  if (!address) return null;

  const truncatedAddress = `${address.slice(0, 5)}...${address.slice(-4)}`;

  return (
    <div className="flex items-center gap-2">
      <code className="relative rounded bg-muted px-[0.5rem] py-[0.25rem] font-mono text-sm">
        {truncatedAddress}
      </code>
      <AnimatedButton
        asChild
        variant="ghost"
        size="icon"
        className="relative group/explorer h-7 w-7 rounded-lg transition-colors hover:text-primary p-2"
      >
        <Link
          href={`https://explorer.solana.com/address/${address}?cluster=${network}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${truncatedAddress} on Solana Explorer`}
        >
          <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-primary/10 to-primary/5 opacity-0 transition-opacity group-hover/explorer:opacity-100" />
          <div className="relative flex items-center gap-1">
            <Image
              src="https://avatars.githubusercontent.com/u/92743431?s=200&v=4"
              width={16}
              height={16}
              alt="Solana Explorer"
              className="rounded-sm transition-transform group-hover/explorer:scale-110"
            />
            <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 transition-all group-hover/explorer:opacity-100" />
          </div>
        </Link>
      </AnimatedButton>
    </div>
  );
}

// Detail Row Component
function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2 group">
      <TypographyMuted className="text-sm font-medium">{label}</TypographyMuted>
      {children}
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center py-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-36" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Error State Component
function ErrorState() {
  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <TypographyMuted>Failed to load project details</TypographyMuted>
          <AnimatedButton
            variant="ghost"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </AnimatedButton>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectDetails({
  projectAddress,
}: {
  projectAddress: string;
}) {
  const { useGetProject, useGetVaultBalance } = useCodecracyProgram();
  const { publicKey: userWallet } = useWallet();
  const { network } = useNetwork();
  const project = useGetProject(projectAddress);
  const vaultBalance = useGetVaultBalance(projectAddress);

  if (!userWallet) return null;
  const isAdmin = project.data?.admin.equals(userWallet);

  if (project.isLoading) {
    return <LoadingState />;
  }

  if (project.error || !project.data) {
    return <ErrorState />;
  }

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm transition-colors hover:bg-card/50 hover:border-border">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          <span>Project Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailRow label="Project">
          <AddressLink address={projectAddress} network={network} />
        </DetailRow>

        <DetailRow label="Admin">
          <AddressLink
            address={project.data.admin.toBase58()}
            network={network}
          />
        </DetailRow>

        <DetailRow label="Active">
          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                project.data.isActive
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-md shadow-green-500/30"
                  : "bg-gradient-to-r from-red-500 to-rose-500 shadow-md shadow-red-500/30"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                project.data.isActive ? "text-green-500" : "text-red-500"
              }`}
            >
              {project.data.isActive ? "Yes" : "No"}
            </span>
          </div>
        </DetailRow>

        {project.data.isActive ? (
          <DetailRow label="Funds Locked">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-medium">
                {vaultBalance.isLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : vaultBalance.error ? (
                  "Error loading balance"
                ) : (
                  `${((vaultBalance.data || 0) / LAMPORTS_PER_SOL).toFixed(
                    2
                  )} SOL`
                )}
              </span>
              <AddFundsButton projectAddress={projectAddress} />
            </div>
          </DetailRow>
        ) : (
          <DetailRow label="Vault Balance">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-medium">
                {vaultBalance.isLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : vaultBalance.error ? (
                  "Error loading balance"
                ) : (
                  `${(vaultBalance.data || 0) / 1e9} SOL`
                )}
              </span>
              <ClaimFundsButton projectAddress={projectAddress} />
            </div>
          </DetailRow>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Scoreboard projectAddress={projectAddress} />
        {project.data.isActive && isAdmin && (
          <CloseProjectButton projectAddress={projectAddress} />
        )}
      </CardFooter>
    </Card>
  );
}
