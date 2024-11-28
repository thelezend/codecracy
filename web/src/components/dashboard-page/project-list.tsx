"use client";

import { motion } from "framer-motion";
import { Project, useCodecracyProgram } from "../codecracy/data-access";
import { TypographyMuted } from "../typography/muted";
import { Card } from "../ui/card";
import { ProjectCard } from "./project-card";

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

const shimmerVariants = {
  initial: { x: "-100%" },
  animate: {
    x: "100%",
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear",
    },
  },
};

function LoadingCard() {
  return (
    <motion.div variants={itemVariants}>
      <Card className="relative h-[200px] overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent skew-x-12"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
        <div className="p-6 space-y-4">
          <div className="h-7 w-2/3 rounded bg-primary/10" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-primary/5" />
            <div className="h-4 w-4/5 rounded bg-primary/5" />
          </div>
          <div className="absolute bottom-6 right-6">
            <div className="h-9 w-24 rounded bg-primary/10" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {[1, 2, 3].map((i) => (
        <LoadingCard key={i} />
      ))}
    </motion.div>
  );
}

function EmptyState() {
  return (
    <Card className="border border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="p-12 text-center">
        <TypographyMuted>No projects found</TypographyMuted>
      </div>
    </Card>
  );
}

export function ProjectList() {
  const { getProjects } = useCodecracyProgram();
  const { data: projects, isLoading } = getProjects;

  if (isLoading) {
    return <LoadingState />;
  }

  if (!projects || projects.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {(projects as Project[]).map((project) => (
        <motion.div key={project.pubkey.toBase58()} variants={itemVariants}>
          <ProjectCard
            title={project.projectName}
            githubHandle={project.githubHandle}
            projectName={project.projectName}
            memberCount={project.teamAddresses.length}
            projectAddress={project.pubkey.toBase58()}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
