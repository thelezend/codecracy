"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNetwork } from "@/components/solana/solana-provider";

const networks = [
  {
    value: "devnet",
    label: "Devnet",
  },
  {
    value: "localnet",
    label: "Localnet",
  },
] as const;

export function NetworkSwitcher() {
  const { network, setNetwork } = useNetwork();
  const selectedNetwork = networks.find((n) => n.value === network);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[140px] justify-between">
          {selectedNetwork?.label ?? "Select network..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[140px]">
        {networks.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => setNetwork(item.value)}
          >
            <Check
              className="mr-2 h-4 w-4"
              style={{
                opacity: network === item.value ? 1 : 0,
              }}
            />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
