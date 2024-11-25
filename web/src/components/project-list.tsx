"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Project, useCodecracyProgram } from "./codecracy/data-access";
import { TypographyMuted } from "./typography/muted";

// Project Card Component
function ProjectCard({ project }: { project: Project }) {
  return (
    <Card key={project.pubkey.toBase58()}>
      <CardHeader>
        <CardTitle>{project.projectName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          {project.teamAddresses.length} members
        </p>
        <Link href={`/project/${project.pubkey.toBase58()}`}>
          <Button>View</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="text-center p-8 space-y-2">
      <TypographyMuted className="text-base">No projects found</TypographyMuted>
      <TypographyMuted>Create a new project to get started</TypographyMuted>
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <div className="text-center p-8">
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function ProjectList() {
  const { getProjects } = useCodecracyProgram();

  if (getProjects.isLoading) {
    return <LoadingState />;
  }

  if (getProjects.error) {
    return (
      <div className="text-center p-8 text-red-600">
        Error loading projects. Please try again.
      </div>
    );
  }

  const projects = getProjects.data || [];

  if (!projects || projects.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project?.pubkey.toBase58()}
          project={project as Project}
        />
      ))}
    </div>
  );
}
