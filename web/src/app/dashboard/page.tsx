"use client";

import { CreateProjectButton } from "@/components/create-project-button";
import { ProjectList } from "@/components/project-list";
import { WalletPrompt } from "@/components/solana/wallet-prompt";
import { TypographyH2 } from "@/components/typography/h2";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function DashboardPage() {
  const userWallet = useAnchorWallet();

  if (!userWallet?.publicKey) {
    return <WalletPrompt />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 dark:to-gray-900/50">
      <motion.div
        className="container mx-auto p-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header
          className="relative flex items-center justify-between mb-10 pb-6"
          variants={itemVariants}
        >
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300" />
            <div className="relative">
              <TypographyH2>Your Projects</TypographyH2>
            </div>
          </div>
          <CreateProjectButton />
        </motion.header>

        <motion.div variants={itemVariants}>
          <ProjectList />
        </motion.div>
      </motion.div>
    </div>
  );
}
