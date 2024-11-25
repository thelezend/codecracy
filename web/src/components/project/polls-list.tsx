"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Github, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCodecracyProgram } from "../codecracy/data-access";
import { useNetwork } from "../solana/solana-provider";
import { TypographyH3 } from "../typography/h3";
import { TypographyMuted } from "../typography/muted";
import { CreatePollButton } from "./create-poll-button";

// Poll Link Component
function PollLink({
  githubHandle,
  projectName,
  pullRequest,
}: {
  githubHandle?: string;
  projectName?: string;
  pullRequest: number;
}) {
  if (!githubHandle || !projectName) return null;

  const url = `https://github.com/${githubHandle}/${projectName}/pull/${pullRequest}`;

  return (
    <Link
      href={url}
      className="flex items-center gap-1 text-sm hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View pull request #${pullRequest} on GitHub`}
    >
      <Github className="w-4 h-4" />
      <span>{`${githubHandle}/${projectName}/pull/${pullRequest}`}</span>
    </Link>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-24" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-16" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-16" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <Card>
      <CardContent className="py-8 text-center">
        <TypographyMuted>No polls found</TypographyMuted>
      </CardContent>
    </Card>
  );
}

export function PollsList({ projectAddress }: { projectAddress: string }) {
  const { useGetPollsList, useGetProject } = useCodecracyProgram();
  const { network } = useNetwork();

  const { data: polls, isLoading: pollsLoading } =
    useGetPollsList(projectAddress);
  const { data: project, isLoading: projectLoading } =
    useGetProject(projectAddress);

  if (pollsLoading || projectLoading) {
    return <LoadingState />;
  }

  if (!polls || polls.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <TypographyH3>Polls</TypographyH3>
          <div className="flex items-center gap-2">
            <CreatePollButton projectAddress={projectAddress} />
            {project && !project.isActive && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Polls cannot be created for inactive projects</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <TypographyH3>Polls</TypographyH3>
        <div className="flex items-center gap-2">
          <CreatePollButton projectAddress={projectAddress} />
          {project && !project.isActive && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Polls cannot be created for inactive projects</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      {polls.map((poll) => (
        <Card key={poll.publicKey.toBase58()}>
          <CardHeader>
            <CardTitle>Pull Request #{poll.account.pullRequest}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span>by {poll.account.user.toBase58()}</span>
              <Button asChild variant="link" className="p-0 h-auto">
                <Link
                  href={`https://explorer.solana.com/address/${poll.publicKey.toBase58()}?cluster=${network}`}
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
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <PollLink
              githubHandle={project?.githubHandle}
              projectName={project?.projectName}
              pullRequest={poll.account.pullRequest}
            />
            <p className="text-sm text-muted-foreground">
              {poll.account.votes} vote{poll.account.votes !== 1 && "s"}
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => {}} disabled>
              Vote
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
