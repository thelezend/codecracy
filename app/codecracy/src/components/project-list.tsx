"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useCodecracyProgram } from "./codecracy/data-access";

export function ProjectList() {
  const { getProjects } = useCodecracyProgram();

  if (getProjects.isLoading) return <div>Loading...</div>;

  const projects = getProjects.data || [];

  if (projects.length === 0) {
    return <div>No projects found</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project?.pubkey.toBase58()}>
          <CardHeader>
            <CardTitle>{project?.projectName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              {project?.teamAddresses.length} members
            </p>
            <Link href={`/project/${project?.pubkey.toBase58()}`}>
              <Button>View</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
