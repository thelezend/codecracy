"use client";

import { TypographyH3 } from "../typography/h3";
import { WalletConnection } from "./wallet-connection";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";

export function WalletPrompt() {
  return (
    <div className="container flex flex-col items-center justify-center gap-8 mt-20">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 mx-auto rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center"
      >
        <Wallet className="w-12 h-12 text-primary" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 flex flex-col items-center"
      >
        <TypographyH3 className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
          Connect Your Wallet
        </TypographyH3>
        <p className="text-muted-foreground max-w-md">
          To access your dashboard and manage projects, please connect your
          Solana wallet
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <WalletConnection />
        </motion.div>
      </motion.div>
    </div>
  );
}
