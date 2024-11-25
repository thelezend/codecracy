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

export default function Dashboard() {
  const userWallet = useAnchorWallet();

  if (!userWallet?.publicKey) {
    return <WalletPrompt />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
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
            <div className="absolute -bottom-1.5 left-0 h-px w-full bg-gradient-to-r from-primary/70 via-primary/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
            <TypographyH2 className="relative font-extrabold text-foreground/90 tracking-tight transition-transform group-hover:text-foreground/100 group-hover:translate-y-[-2px]">
              Projects
            </TypographyH2>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-4"
          >
            <CreateProjectButton />
          </motion.div>
        </motion.header>

        <motion.div variants={itemVariants} className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/20 to-background/0 pointer-events-none" />
          <ProjectList />
        </motion.div>
      </motion.div>
    </div>
  );
}
