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
import { useNetwork } from "../solana/solana-provider";
import { TypographyH3 } from "../typography/h3";
import { TypographyMuted } from "../typography/muted";
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

  const url = `https://github.com/${githubHandle}/${projectName}/pull/${pullRequest}`;
  return (
    <Link
      href={url}
      className="flex items-center gap-1 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View pull request #${pullRequest} on GitHub`}
    >
      <Github className="w-4 h-4" />
      <span>{`${githubHandle}/${projectName}/pull/${pullRequest}`}</span>
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
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-between items-center"
  >
    <TypographyH3>Polls</TypographyH3>
    <div className="flex items-center gap-2">
      <CreatePollButton projectAddress={projectAddress} />
      {!isProjectActive && (
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
  </motion.div>
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
      // You might want to show an error toast here
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="space-y-2 p-4">
          <div className="flex justify-between items-center">
            <div>
              <PollLink
                githubHandle={project.githubHandle}
                projectName={project.projectName}
                pullRequest={poll.account.pullRequest}
              />
              <p className="text-sm text-gray-500">
                Closes {closeDate.toLocaleDateString()}{" "}
                {closeDate.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{poll.account.votes}</span> votes
              </div>
              <Button
                onClick={() => setShowVoteDialog(true)}
                disabled={!canVote || isVoting}
              >
                {isVoting ? (
                  <div className="flex items-center space-x-2">
                    <span>Voting...</span>
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
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 group">
                <span className="text-xs text-muted-foreground">by</span>
                <Link
                  href={`https://github.com/${member.account.githubHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary flex items-center space-x-1 transition-colors duration-200"
                >
                  <span className="group-hover:underline">
                    {member.account.githubHandle}
                  </span>
                  <Github className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
              </div>
              {isCreator && (
                <span className="text-xs text-muted-foreground">
                  (You created this poll)
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showVoteDialog && (
        <Dialog open={showVoteDialog} onOpenChange={setShowVoteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cast Your Vote</DialogTitle>
              <DialogDescription>
                Choose your vote type for PR #{poll.account.pullRequest}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleVote("Low")}
                variant={selectedVoteType === "Low" ? "default" : "outline"}
              >
                Low Impact
              </Button>
              <Button
                onClick={() => handleVote("Medium")}
                variant={selectedVoteType === "Medium" ? "default" : "outline"}
              >
                Medium Impact
              </Button>
              <Button
                onClick={() => handleVote("High")}
                variant={selectedVoteType === "High" ? "default" : "outline"}
              >
                High Impact
              </Button>
              <Button
                onClick={() => handleVote("Reject")}
                variant={
                  selectedVoteType === "Reject" ? "destructive" : "outline"
                }
                className="col-span-2"
              >
                Reject
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
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
