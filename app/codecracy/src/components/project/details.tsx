"use client";

import Image from "next/image";
import Link from "next/link";
import { useCodecracyProgram } from "../codecracy/data-access";
import { useNetwork } from "../solana/solana-provider";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function ProjectDetails({
  projectAddress,
}: {
  projectAddress: string;
}) {
  const { useGetProject } = useCodecracyProgram();
  const { network } = useNetwork();
  const project = useGetProject(projectAddress);
  const admin = project.data?.admin.toBase58();

  return (
    <Card className="mb-8 w-1/3">
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Project</span>
          <div className="flex gap-1 items-center">
            <span className="font-mono">
              {projectAddress.slice(0, 5)}...{projectAddress.slice(-4)}
            </span>
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
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Admin</span>
          <div className="flex gap-1 items-center">
            <span className="font-mono">
              {admin?.slice(0, 5)}...{admin?.slice(-4)}
            </span>
            <Button asChild variant={"link"} className="p-0">
              <Link
                href={`https://explorer.solana.com/address/${admin}?cluster=${network}`}
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
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Active</span>
          <span>{project.data?.isActive.toString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
