"use client";

import { motion } from "framer-motion";
import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCodecracyProgram } from "../codecracy/data-access";
import { useNetwork } from "../solana/solana-provider";
import { TypographyH2 } from "../typography/h2";
import { TypographyMuted } from "../typography/muted";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import ProjectDetails from "./details";
import { PollsList } from "./polls-list";
import ProjectTeam from "./team";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
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

// Project Header Component
function ProjectHeader({
  projectName,
  githubHandle,
  projectAddress,
  network,
}: {
  projectName?: string;
  githubHandle?: string;
  projectAddress: string;
  network: string;
}) {
  return (
    <motion.div
      className="relative flex items-center gap-4 mb-8 pb-6"
      variants={itemVariants}
    >
      <div className="flex-1">
        <div className="group relative inline-block">
          <div className="absolute -bottom-1.5 left-0 h-px w-full bg-gradient-to-r from-primary/70 via-primary/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
          <TypographyH2 className="relative font-extrabold text-foreground/90 tracking-tight transition-transform group-hover:text-foreground/100 group-hover:translate-y-[-2px]">
            {projectName}
          </TypographyH2>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="relative group/github h-9 w-9 rounded-lg transition-colors hover:text-primary"
        >
          <Link
            href={`https://github.com/${githubHandle}/${projectName}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-primary/10 to-primary/5 opacity-0 transition-opacity group-hover/github:opacity-100" />
            <Github className="w-5 h-5 transition-transform group-hover/github:scale-110" />
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="relative group/solana h-9 w-9 rounded-lg transition-colors hover:text-primary"
        >
          <Link
            href={`https://explorer.solana.com/address/${projectAddress}?cluster=${network}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on Solana Explorer"
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-primary/10 to-primary/5 opacity-0 transition-opacity group-hover/solana:opacity-100" />
            <Image
              src="https://avatars.githubusercontent.com/u/92743431?s=200&v=4"
              width={20}
              height={20}
              alt="Solana Explorer"
              className="rounded-sm transition-transform group-hover/solana:scale-110"
            />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <div className="container mx-auto p-8">
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Project Header Skeleton */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 mb-8 pb-6"
        >
          <div className="flex-1">
            <Skeleton className="h-9 w-64" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
        </motion.div>

        {/* Project Details and Team Skeleton */}
        <motion.div
          variants={itemVariants}
          className="grid gap-6 md:grid-cols-2"
        >
          <Skeleton className="h-[400px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </motion.div>

        {/* Polls List Skeleton */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Skeleton className="h-9 w-32" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Error State Component
function ErrorState() {
  return (
    <div className="container mx-auto p-8">
      <motion.div
        className="flex flex-col items-center justify-center min-h-[400px] rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <TypographyMuted className="text-lg">
          Failed to load project details
        </TypographyMuted>
        <Button
          variant="ghost"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Try Again
        </Button>
      </motion.div>
    </div>
  );
}

export default function Project({
  projectAddress,
}: {
  projectAddress: string;
}) {
  const { useGetProject } = useCodecracyProgram();
  const { network } = useNetwork();
  const project = useGetProject(projectAddress);

  if (project.isLoading) {
    return <LoadingState />;
  }

  if (project.error || !project.data) {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <motion.div
        className="container mx-auto p-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ProjectHeader
          projectName={project.data.projectName}
          githubHandle={project.data.githubHandle}
          projectAddress={projectAddress}
          network={network}
        />

        <motion.div
          variants={itemVariants}
          className="grid gap-6 md:grid-cols-2"
        >
          <ProjectDetails projectAddress={projectAddress} />
          <ProjectTeam projectAddress={projectAddress} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <PollsList projectAddress={projectAddress} />
        </motion.div>
      </motion.div>
    </div>
  );
}
