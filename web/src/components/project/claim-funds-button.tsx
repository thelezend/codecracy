"use client";

import { BN } from "@coral-xyz/anchor";
import { useState } from "react";
import { useCodecracyProgram } from "../codecracy/data-access";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useWallet } from "@solana/wallet-adapter-react";

interface ClaimFundsButtonProps {
  projectAddress: string;
}

export function ClaimFundsButton({ projectAddress }: ClaimFundsButtonProps) {
  const [open, setOpen] = useState(false);
  const { publicKey: userWallet } = useWallet();
  const { useGetMembers, useGetProject } = useCodecracyProgram();
  const { data: projectData } = useGetProject(projectAddress);
  const getMembers = useGetMembers([
    {
      memcmp: { offset: 8, bytes: projectAddress },
    },
  ]);

  if (!userWallet || !getMembers.data) return;

  const userMember = getMembers.data.find((member) =>
    member.account.memberPubkey.equals(userWallet)
  );

  if (!userMember || !projectData) return null;

  const userScore = userMember.account.score.toNumber();
  const totalScore = getMembers.data.reduce(
    (sum, member) => sum + member.account.score.toNumber(),
    0
  );

  const ratio = userScore / totalScore;
  const userClaimableFunds = projectData.claimableFunds.toNumber() * ratio;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative z-10">
          Claim
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Claim Funds</DialogTitle>
          <DialogDescription>
            Are you sure you want to claim the funds?
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
