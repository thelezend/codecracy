"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
import { useCodecracyProgram } from "../codecracy/data-access";
import { useNetwork } from "../solana/solana-provider";
import { TypographyMuted } from "../typography/muted";
import { AnimatedButton } from "../ui/animated-button";
import { Skeleton } from "../ui/skeleton";
import ProjectDetails from "./details/details";
import { PollsList } from "./polls/polls-list";
import ProjectTeam from "./team/team";

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
      className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-6"
      variants={itemVariants}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center"
      >
        <Github className="w-10 h-10 text-primary" />
      </motion.div>

      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
          {projectName || <Skeleton className="w-48 h-8" />}
        </h1>
        {githubHandle && (
          <Link
            href={`https://github.com/${githubHandle}/${projectName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mt-1"
          >
            {githubHandle}/{projectName}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="flex gap-2 self-end sm:self-center">
        <AnimatedButton variant="outline" asChild>
          <Link
            href={`https://explorer.solana.com/address/${projectAddress}?cluster=${network}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Explorer
          </Link>
        </AnimatedButton>
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
        <AnimatedButton
          variant="ghost"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Try Again
        </AnimatedButton>
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
    <motion.div
      className="container py-8 space-y-8"
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

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <ProjectDetails projectAddress={projectAddress} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ProjectTeam projectAddress={projectAddress} />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <PollsList projectAddress={projectAddress} />
      </motion.div>
    </motion.div>
  );
}
