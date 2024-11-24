import Link from "next/link";
import { WalletConnection } from "./solana/wallet-connection";
import { NetworkSwitcher } from "./solana/network-switcher";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
            Codecracy
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <NetworkSwitcher />
          <WalletConnection />
        </div>
      </div>
    </header>
  );
}
