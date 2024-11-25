"use client";

import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCodecracyProgram } from "../codecracy/data-access";
import { useNetwork } from "../solana/solana-provider";
import { TypographyMuted } from "../typography/muted";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { AddMemberButton } from "./add-member-button";

// Team Member Link Component
function MemberLink({ githubHandle }: { githubHandle: string }) {
  return (
    <div className="flex items-center gap-1">
      <span>{githubHandle}</span>
      <Button asChild variant="link" className="p-0 h-auto">
        <Link
          href={`https://github.com/${githubHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${githubHandle} on GitHub`}
        >
          <Github className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}

// Member Address Link Component
function MemberAddressLink({
  address,
  network,
}: {
  address: string;
  network: string;
}) {
  const truncatedAddress = `${address.slice(0, 5)}...${address.slice(-4)}`;

  return (
    <div className="flex items-center gap-1">
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

// Loading State Component
function LoadingState() {
  return (
    <Card className="mb-8 w-1/3">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Error State Component
function ErrorState() {
  return (
    <Card className="mb-8 w-1/3">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <TypographyMuted>Failed to load team members</TypographyMuted>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function EmptyState({ projectAddress }: { projectAddress: string }) {
  return (
    <Card className="mb-8 w-1/3">
      <CardHeader>
        <CardTitle>
          Team Members <AddMemberButton projectAddress={projectAddress} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TypographyMuted>No team members yet</TypographyMuted>
      </CardContent>
    </Card>
  );
}

export default function ProjectTeam({
  projectAddress,
}: {
  projectAddress: string;
}) {
  const { useGetMembers } = useCodecracyProgram();
  const { network } = useNetwork();

  const teamMembers = useGetMembers([
    {
      memcmp: { offset: 8, bytes: projectAddress },
    },
  ]);

  if (teamMembers.isLoading) {
    return <LoadingState />;
  }

  if (teamMembers.error) {
    return <ErrorState />;
  }

  if (!teamMembers.data || teamMembers.data.length === 0) {
    return <EmptyState projectAddress={projectAddress} />;
  }

  return (
    <Card className="mb-8 w-1/3">
      <CardHeader>
        <CardTitle>
          Team Members <AddMemberButton projectAddress={projectAddress} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {teamMembers.data.map((member) => (
            <li
              key={member.publicKey.toBase58()}
              className="flex items-center justify-between"
            >
              <MemberLink githubHandle={member.account.githubHandle} />
              <MemberAddressLink
                address={member.account.memberPubkey.toBase58()}
                network={network}
              />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
