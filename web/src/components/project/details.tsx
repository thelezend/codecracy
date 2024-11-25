"use client";

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
    <div className="flex gap-1 items-center">
      <span className="font-mono">{truncatedAddress}</span>
      <Button asChild variant="link" className="p-0 h-auto">
        <Link
          href={`https://explorer.solana.com/address/${address}?cluster=${network}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${truncatedAddress} on Solana Explorer`}
        >
          <Image
            src="https://avatars.githubusercontent.com/u/92743431?s=200&v=4"
            width={16}
            height={16}
            alt="Solana Explorer"
            className="rounded-sm"
          />
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
    <div className="flex justify-between items-center">
      <TypographyMuted>{label}</TypographyMuted>
      {children}
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <Card className="mb-8 w-1/3">
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Error State Component
function ErrorState() {
  return (
    <Card className="mb-8 w-1/3">
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent>
        <TypographyMuted>Failed to load project details</TypographyMuted>
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
    <Card className="mb-8 w-1/3">
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <DetailRow label="Project">
          <AddressLink address={projectAddress} network={network} />
        </DetailRow>

        <DetailRow label="Admin">
          <AddressLink address={admin} network={network} />
        </DetailRow>

        <DetailRow label="Active">
          <span>{project.data.isActive ? "Yes" : "No"}</span>
        </DetailRow>
      </CardContent>
    </Card>
  );
}
