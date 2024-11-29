"use client";

import { useCodecracyProgram } from "@/components/codecracy/data-access";
import { AnimatedButton } from "@/components/ui/animated-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function Scoreboard({
  projectAddress,
}: {
  projectAddress: string;
}) {
  const [open, setOpen] = useState(false);
  const { useGetMembers } = useCodecracyProgram();

  const { data: members, isLoading } = useGetMembers([
    { memcmp: { offset: 8, bytes: projectAddress } },
  ]);

  const data = members
    ?.sort((a, b) => b.account.score.cmp(a.account.score))
    .map((member, index) => ({
      rank: index + 1,
      githubHandle: member.account.githubHandle,
      score: member.account.score.toNumber(),
    }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AnimatedButton
          className="relative z-10"
          disabled={isLoading}
          variant="secondary"
        >
          {isLoading ? "Loading..." : "Scoreboard"}
        </AnimatedButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] px-0 pb-0">
        <DialogHeader>
          <DialogTitle className="text-center">Scoreboard</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DataTable columns={columns} data={data ?? []} />
      </DialogContent>
    </Dialog>
  );
}
