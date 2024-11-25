"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Users } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  githubHandle: string;
  projectName: string;
  memberCount: number;
  projectAddress: string;
  className?: string;
}

export function ProjectCard({
  title,
  githubHandle,
  projectName,
  memberCount,
  projectAddress,
  className,
}: ProjectCardProps) {
  const githubUrl = `https://github.com/${githubHandle}/${projectName}`;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card className="group relative overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm transition-colors hover:bg-card/50 hover:border-border">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />

        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl font-bold tracking-tight">
                {title}
              </CardTitle>
              <div className="relative z-10">
                <Link
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/github inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Github className="h-4 w-4 transition-transform group-hover/github:scale-110" />
                  <span className="border-b border-transparent transition-colors group-hover/github:border-primary">
                    {githubHandle}/{projectName}
                  </span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 transition-all group-hover/github:opacity-100" />
                </Link>
              </div>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {memberCount}
            </Badge>
          </div>
        </CardHeader>

        <CardFooter className="flex justify-end">
          <Button
            asChild
            variant="ghost"
            className="group/button relative overflow-hidden transition-colors hover:text-primary"
          >
            <Link href={`/project/${projectAddress}`}>
              <span className="relative z-10 flex items-center gap-2">
                View Project
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 transition-opacity group-hover/button:opacity-100" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
