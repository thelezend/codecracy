import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import React from "react";

const ExplorerLink = ({ tx, network }: { tx: string; network: string }) => (
  <Link
    href={`https://explorer.solana.com/tx/${tx}?cluster=${network}`}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 rounded px-2 py-1 text-sm font-medium text-blue-600 transition-all duration-200 hover:bg-blue-100 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-300"
  >
    View on Solana Explorer
    <svg
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  </Link>
);

export function successToast(network: string, tx?: string) {
  if (!tx) throw new Error("No transaction found");
  toast({
    title: "Transaction confirmed",
    description: <ExplorerLink tx={tx} network={network} />,
  });
}

export function errorToast() {
  toast({
    title: "Transaction failed",
    description: "Check the console log for more details",
    variant: "destructive",
  });
}
