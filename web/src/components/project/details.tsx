"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCodecracyProgram } from "../codecracy/data-access";
import { useNetwork } from "../solana/solana-provider";
import { TypographyMuted } from "../typography/muted";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

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
      <Button
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
      </Button>
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
          <Button
            variant="ghost"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
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
  const { useGetProject } = useCodecracyProgram();
  const { network } = useNetwork();
  const project = useGetProject(projectAddress);

  if (project.isLoading) {
    return <LoadingState />;
  }

  if (project.error || !project.data) {
    return <ErrorState />;
  }

  const admin = project.data.admin.toBase58();

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm transition-colors hover:bg-card/50 hover:border-border group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Details</CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <DetailRow label="Project">
          <AddressLink address={projectAddress} network={network} />
        </DetailRow>

        <DetailRow label="Admin">
          <AddressLink address={admin} network={network} />
        </DetailRow>

        <DetailRow label="Active">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                project.data.isActive
                  ? "bg-green-500 shadow-sm shadow-green-500/50"
                  : "bg-red-500 shadow-sm shadow-red-500/50"
              }`}
            />
            <span className="text-sm font-medium">
              {project.data.isActive ? "Yes" : "No"}
            </span>
          </div>
        </DetailRow>
      </CardContent>
    </Card>
  );
}
