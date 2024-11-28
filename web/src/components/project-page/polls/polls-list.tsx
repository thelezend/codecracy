"use client";

import {
  useCodecracyProgram,
  VoteTypes,
} from "@/components/codecracy/data-access";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BN } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useNetwork } from "../../solana/solana-provider";
import { TypographyMuted } from "../../typography/muted";
import { CreatePollButton } from "./create-poll-button";

interface PollLinkProps {
  githubHandle?: string;
  projectName?: string;
  pullRequest: number;
}

interface PollHeaderProps {
  projectAddress: string;
  isProjectActive?: boolean;
}

interface Poll {
  publicKey: PublicKey;
  account: {
    user: PublicKey;
    project: PublicKey;
    pullRequest: number;
    votes: number;
    closeTime: BN;
    rejections: number;
    bump: number;
  };
}

interface Member {
  publicKey: PublicKey;
  account: {
    project: PublicKey;
    memberPubkey: PublicKey;
    isActive: boolean;
    fundsClaimed: boolean;
    score: BN;
    bump: number;
    githubHandle: string;
  };
}

interface Project {
  admin: PublicKey;
  isActive: boolean;
  teamLut: PublicKey;
  claimableFunds: BN;
  bump: number;
  vaultBump: number;
  projectName: string;
  githubHandle: string;
}

interface PollCardProps {
  poll: Poll;
  member: Member;
  project: Project;
  network: string;
}

const PollLink: React.FC<PollLinkProps> = ({
  githubHandle,
  projectName,
  pullRequest,
}) => {
  if (!githubHandle || !projectName) return null;
  const href = `https://github.com/${githubHandle}/${projectName}/pull/${pullRequest}`;
  const text = `${githubHandle}/${projectName}/pull/${pullRequest}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors z-10"
    >
      <Github className="w-4 h-4 text-primary" />
      <span className="group-hover:underline">{text}</span>
    </Link>
  );
};

const LoadingState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-4"
  >
    <Skeleton className="h-8 w-24" />
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card>
            <CardContent className="space-y-2 p-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const EmptyState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="border-dashed">
      <CardContent className="py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TypographyMuted>No polls found</TypographyMuted>
        </motion.div>
      </CardContent>
    </Card>
  </motion.div>
);

const PollHeader: React.FC<PollHeaderProps> = ({
  projectAddress,
  isProjectActive,
}) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
        Pull Requests
      </h2>
      <TypographyMuted>Vote on open pull requests</TypographyMuted>
    </div>
    <div className="flex items-center gap-2">
      <CreatePollButton projectAddress={projectAddress} />
      {!isProjectActive && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Polls cannot be created for inactive projects</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  </div>
);

const PollCard: React.FC<PollCardProps> = ({ poll, member, project }) => {
  const closeDate = new Date(poll.account.closeTime.toNumber() * 1000);
  const isExpired = closeDate.getTime() < Date.now();
  const { publicKey: userWallet } = useWallet();

  const { useCastVote } = useCodecracyProgram();
  const { mutate: castVote, isPending: isVoting } = useCastVote(
    poll.account.project
  );
  const [selectedVoteType, setSelectedVoteType] = useState<
    keyof typeof VoteTypes | null
  >(null);
  const [showVoteDialog, setShowVoteDialog] = useState(false);

  if (!userWallet) return null;
  const isCreator = poll.account.user.equals(userWallet);
  const canVote = !isExpired && !isCreator;

  const handleVote = async (voteType: keyof typeof VoteTypes) => {
    try {
      castVote({
        pollAddress: poll.publicKey,
        voteType: VoteTypes[voteType],
      });
      setShowVoteDialog(false);
      setSelectedVoteType(null);
    } catch (error) {
      console.error("Error casting vote:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm transition-colors hover:bg-card/50 hover:border-border">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <CardContent className="p-6 space-y-4 relative">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <PollLink
                githubHandle={project.githubHandle}
                projectName={project.projectName}
                pullRequest={poll.account.pullRequest}
              />
              <p className="text-sm text-muted-foreground">
                Closes {closeDate.toLocaleDateString()}{" "}
                {closeDate.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Votes</span>
                <span className="font-mono text-sm font-medium bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  {poll.account.votes}
                </span>
              </div>
              <Button
                onClick={() => setShowVoteDialog(true)}
                disabled={!canVote || isVoting}
                className="relative group/vote"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover/vote:opacity-100 transition-opacity rounded-md" />
                {isVoting ? (
                  <div className="flex items-center gap-2">
                    <span>Voting</span>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      ⚡
                    </motion.div>
                  </div>
                ) : (
                  "Vote"
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-muted-foreground">by</span>
            <Link
              href={`https://github.com/${member.account.githubHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group/author inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="group-hover/author:underline">
                {member.account.githubHandle}
              </span>
            </Link>
            {isCreator && (
              <span className="text-xs text-muted-foreground">
                (You created this poll)
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showVoteDialog} onOpenChange={setShowVoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Cast Your Vote
            </DialogTitle>
            <DialogDescription>
              Choose your vote type for PR #{poll.account.pullRequest}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {[
              { type: "Low", label: "Low Impact" },
              { type: "Medium", label: "Medium Impact" },
              { type: "High", label: "High Impact" },
              { type: "Reject", label: "Reject", fullWidth: true },
            ].map(({ type, label, fullWidth }) => (
              <Button
                key={type}
                onClick={() => handleVote(type as keyof typeof VoteTypes)}
                variant={selectedVoteType === type ? "default" : "outline"}
                className={`relative group/vote-type ${
                  fullWidth ? "col-span-2" : ""
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover/vote-type:opacity-100 transition-opacity rounded-md" />
                <span>{label}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export function PollsList({ projectAddress }: { projectAddress: string }) {
  const { useGetPollsList, useGetProject, useGetMembers } =
    useCodecracyProgram();
  const { network } = useNetwork();

  const { data: polls, isLoading: pollsLoading } =
    useGetPollsList(projectAddress);
  const { data: project, isLoading: projectLoading } =
    useGetProject(projectAddress);
  const { data: members, isLoading: membersLoading } = useGetMembers([
    {
      memcmp: {
        offset: 8,
        bytes: projectAddress,
      },
    },
  ]);

  if (pollsLoading || projectLoading || membersLoading) {
    return <LoadingState />;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-4"
      >
        <PollHeader
          projectAddress={projectAddress}
          isProjectActive={project?.isActive}
        />
        {!polls || polls.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div className="space-y-4">
            {polls.map((poll, index) => {
              const member = members?.find((member) =>
                member.account.memberPubkey.equals(poll.account.user)
              );
              return (
                <motion.div
                  key={poll.publicKey.toBase58()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PollCard
                    poll={poll}
                    member={member as Member}
                    project={project as Project}
                    network={network}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
