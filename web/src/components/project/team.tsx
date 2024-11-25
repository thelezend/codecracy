"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCodecracyProgram } from "../codecracy/data-access";
import { useNetwork } from "../solana/solana-provider";
import { TypographyMuted } from "../typography/muted";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { AddMemberButton } from "./add-member-button";

const memberVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Team Member Link Component
function MemberLink({ githubHandle }: { githubHandle: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium text-sm">{githubHandle}</span>
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="relative group/github h-7 w-7 rounded-lg transition-colors hover:text-primary"
      >
        <Link
          href={`https://github.com/${githubHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${githubHandle} on GitHub`}
        >
          <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-primary/10 to-primary/5 opacity-0 transition-opacity group-hover/github:opacity-100" />
          <div className="relative flex items-center gap-1">
            <Github className="w-4 h-4 transition-transform group-hover/github:scale-110" />
            <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 transition-all group-hover/github:opacity-100" />
          </div>
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

// Loading State Component
function LoadingState() {
  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Team Members
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-40" />
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
    <Card className="relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Team Members
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <TypographyMuted>Failed to load team members</TypographyMuted>
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

// Empty State Component
function EmptyState({ projectAddress }: { projectAddress: string }) {
  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Team Members
          </div>
          <div className="relative z-10">
            <AddMemberButton projectAddress={projectAddress} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <TypographyMuted>No team members yet</TypographyMuted>
        </div>
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
    <Card className="relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm transition-colors hover:bg-card/50 hover:border-border group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Team Members
          </div>
          <div className="relative z-10">
            <AddMemberButton projectAddress={projectAddress} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.ul
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {teamMembers.data.map((member) => (
            <motion.li
              key={member.publicKey.toBase58()}
              className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-primary/5"
              variants={memberVariants}
            >
              <MemberLink githubHandle={member.account.githubHandle} />
              <MemberAddressLink
                address={member.account.memberPubkey.toBase58()}
                network={network}
              />
            </motion.li>
          ))}
        </motion.ul>
      </CardContent>
    </Card>
  );
}
