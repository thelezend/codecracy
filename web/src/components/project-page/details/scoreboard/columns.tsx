"use client";

import { ColumnDef } from "@tanstack/react-table";

type LeaderboardRow = {
  rank: number;
  githubHandle: string;
  score: number;
};

export const columns: ColumnDef<LeaderboardRow>[] = [
  {
    accessorKey: "rank",
    header: () => <div className="text-center">#</div>,
    cell: ({ row }) => {
      const rank = row.getValue("rank") as number;
      if (rank <= 3) {
        const rankEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉";
        return <div className="text-center text-xl">{rankEmoji}</div>;
      }
      return (
        <div className="text-center text-gray-600 font-medium">{rank}</div>
      );
    },
  },
  {
    accessorKey: "githubHandle",
    header: "Github Handle",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("githubHandle")}</div>
    ),
  },
  {
    accessorKey: "score",
    header: () => <div className="text-right">Score</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium font-mono">
        {row.getValue("score")}
      </div>
    ),
  },
];
