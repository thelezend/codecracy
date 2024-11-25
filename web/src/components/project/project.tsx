"use client";

import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCodecracyProgram } from "../codecracy/data-access";
import { useNetwork } from "../solana/solana-provider";
import { TypographyH2 } from "../typography/h2";
import { TypographyMuted } from "../typography/muted";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import ProjectDetails from "./details";
import ProjectTeam from "./team";
import { PollsList } from "./polls-list";

// Project Header Component
function ProjectHeader({
  projectName,
  githubHandle,
  projectAddress,
  network,
}: {
  projectName?: string;
  githubHandle?: string;
  projectAddress: string;
  network: string;
}) {
  return (
    <div className="flex gap-2 items-center mb-4">
      <TypographyH2>{projectName}</TypographyH2>
      <div className="flex gap-2">
        <Button asChild variant="link" className="p-0 h-auto">
          <Link
            href={`https://github.com/${githubHandle}/${projectName}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
          >
            <Github className="w-5 h-5" />
          </Link>
        </Button>
        <Button asChild variant="link" className="p-0 h-auto">
          <Link
            href={`https://explorer.solana.com/address/${projectAddress}?cluster=${network}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on Solana Explorer"
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
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4">
        {/* Project Header Skeleton */}
        <div className="flex gap-2 items-center mb-4">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
          </div>
        </div>

        {/* Project Details and Team Skeleton */}
        <div className="flex gap-3">
          <Skeleton className="h-[300px] flex-1" />
          <Skeleton className="h-[300px] flex-1" />
        </div>

        {/* Polls List Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-10 w-32" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Error State Component
function ErrorState() {
  return (
    <div className="container mx-auto p-4 text-center">
      <TypographyMuted>
        Failed to load project details. Please try again.
      </TypographyMuted>
    </div>
  );
}

export default function Project({
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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <ProjectHeader
        projectName={project.data.projectName}
        githubHandle={project.data.githubHandle}
        projectAddress={projectAddress}
        network={network}
      />

      <div className="flex gap-3">
        <ProjectDetails projectAddress={projectAddress} />
        <ProjectTeam projectAddress={projectAddress} />
      </div>

      <PollsList projectAddress={projectAddress} />
    </div>
  );
}
