"use client";

import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCodecracyProgram } from "../codecracy/data-access";
import { useNetwork } from "../solana/solana-provider";
import { TypographyH2 } from "../typography/h2";
import { Button } from "../ui/button";
import ProjectDetails from "./details";
import ProjectTeam from "./team";

export default function Project({
  projectAddress,
}: {
  projectAddress: string;
}) {
  const { useGetProject } = useCodecracyProgram();
  const { network } = useNetwork();

  const project = useGetProject(projectAddress);

  if (project.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-2">
        <TypographyH2 className="mb-4">
          {project.data?.projectName}
        </TypographyH2>
        <Button asChild variant={"link"} className="p-0">
          <Link
            href={`https://github.com/${project.data?.githubHandle}/${project.data?.projectName}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
          </Link>
        </Button>
        <Button asChild variant={"link"} className="p-0">
          <Link
            href={`https://explorer.solana.com/address/${projectAddress}?cluster=${network}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={`https://avatars.githubusercontent.com/u/92743431?s=200&v=4`}
              width={16}
              height={16}
              alt="Solscan Logo"
            />
          </Link>
        </Button>
      </div>
      <div className="flex gap-3">
        <ProjectDetails projectAddress={projectAddress} />
        <ProjectTeam projectAddress={projectAddress} />
      </div>
    </div>
  );
}
