"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useCodecracyProgram } from "../codecracy/data-access";
import { useNetwork } from "../solana/solana-provider";
import { TypographyH3 } from "../typography/h3";

export function PollsList({ projectAddress }: { projectAddress: string }) {
  const { useGetPollsList, useGetProject } = useCodecracyProgram();
  const { network } = useNetwork();

  const { data: polls } = useGetPollsList(projectAddress);
  const { data: project } = useGetProject(projectAddress);

  if (!polls) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <TypographyH3>Polls</TypographyH3>
      {polls.map((poll) => (
        <Card key={poll.publicKey.toBase58()}>
          <CardHeader>
            <CardTitle>{poll.account.pullRequest}</CardTitle>
            <CardDescription>by {poll.account.user.toBase58()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 items-center">
              <Link
                href={`https://github.com/${project?.githubHandle}/${project?.projectName}/pull/${poll.account.pullRequest}`}
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {`${project?.githubHandle}/${project?.projectName}/pull/${poll.account.pullRequest}`}
              </Link>
              <Button asChild variant={"link"} className="p-0">
                <Link
                  href={`https://explorer.solana.com/address/${poll.publicKey.toBase58()}?cluster=${network}`}
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
            <p>{poll.account.votes} votes</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => {}}>Vote</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
