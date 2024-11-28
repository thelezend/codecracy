"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { useCodecracyProgram } from "../../codecracy/data-access";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { Info } from "lucide-react";

interface ClaimFundsButtonProps {
  projectAddress: string;
}

// Utility function to calculate user's claimable funds
const calculateClaimableFunds = (
  userScore: number,
  totalScore: number,
  totalClaimableFunds: number,
  membersLength: number
): number => {
  if (totalScore === 0) return totalClaimableFunds / membersLength;
  const ratio = userScore / totalScore;
  return totalClaimableFunds * ratio;
};

export function ClaimFundsButton({ projectAddress }: ClaimFundsButtonProps) {
  const [open, setOpen] = useState(false);
  const { publicKey: userWallet } = useWallet();
  const { useGetMembers, useGetProject, useClaim } = useCodecracyProgram();

  // Fetch project and member data
  const { data: projectData, isLoading: isProjectLoading } =
    useGetProject(projectAddress);
  const { data: members, isLoading: isMembersLoading } = useGetMembers([
    { memcmp: { offset: 8, bytes: projectAddress } },
  ]);

  // Find user's membership details
  const userMember = members?.find((member) =>
    member.account.memberPubkey.equals(userWallet as PublicKey)
  );

  const { mutate: claimFunds, isPending: isClaimLoading } = useClaim(
    new PublicKey(projectAddress),
    userMember?.publicKey as PublicKey
  );

  // Early return if data is loading or user is not connected
  if (isProjectLoading || isMembersLoading) {
    return (
      <Button variant="outline" disabled>
        Loading...
      </Button>
    );
  }

  if (!userWallet || !members || !projectData) {
    return null;
  }

  if (!userMember) {
    return null;
  }

  // Calculate claimable funds
  const userScore = userMember.account.score.toNumber();
  const totalScore = members.reduce(
    (sum, member) => sum + member.account.score.toNumber(),
    0
  );
  const userClaimableFunds = calculateClaimableFunds(
    userScore,
    totalScore,
    projectData.claimableFunds.toNumber(),
    members.length
  );

  // Handle claim funds action
  const handleClaimFunds = async () => {
    claimFunds();
    setOpen(false);
  };

  const getTooltipMessage = () => {
    if (userMember.account.fundsClaimed) {
      return "You have already claimed your funds for this project";
    }
    if (userClaimableFunds <= 0) {
      return "No funds available to claim";
    }
    return null;
  };

  const tooltipMessage = getTooltipMessage();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <DialogTrigger asChild>
          <Button
            className="relative z-10"
            disabled={
              userClaimableFunds <= 0 ||
              isClaimLoading ||
              userMember.account.fundsClaimed
            }
          >
            {isClaimLoading ? "Claiming..." : "Claim"}
          </Button>
        </DialogTrigger>
        {tooltipMessage && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground relative z-10" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipMessage}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Claim Funds</DialogTitle>
          <DialogDescription>
            You are eligible to claim{" "}
            <span className="text-primary font-mono font-bold">
              {(userClaimableFunds / LAMPORTS_PER_SOL).toFixed(2)} SOL
            </span>{" "}
            based on your contribution score. Would you like to proceed?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isClaimLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleClaimFunds} disabled={isClaimLoading}>
            {isClaimLoading ? "Claiming..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
