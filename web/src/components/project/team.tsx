"use client";

import Image from "next/image";
import Link from "next/link";
import { useCodecracyProgram } from "../codecracy/data-access";
import { useNetwork } from "../solana/solana-provider";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AddMemberButton } from "./add-member-button";
import { Github } from "lucide-react";

export default function ProjectTeam({
  projectAddress,
}: {
  projectAddress: string;
}) {
  const { useGetMembers } = useCodecracyProgram();
  const { network } = useNetwork();

  const teamMembers = useGetMembers([
    {
      memcmp: { offset: 8, bytes: projectAddress },
    },
  ]);

  if (teamMembers.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="mb-8 w-1/3">
      <CardHeader>
        <CardTitle>
          Team Members <AddMemberButton projectAddress={projectAddress} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {teamMembers.data?.map((member) => (
            <li
              key={member.publicKey.toBase58()}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-1">
                <span> {member.account.githubHandle}</span>
                <Button asChild variant={"link"} className="p-0">
                  <Link
                    href={`https://github.com/${member.account.githubHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github />
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-mono">
                  {member.account.memberPubkey.toBase58().slice(0, 5)}...
                  {member.account.memberPubkey.toBase58().slice(-4)}
                </span>
                <Button asChild variant={"link"} className="p-0">
                  <Link
                    href={`https://explorer.solana.com/address/${member.account.memberPubkey.toBase58()}?cluster=${network}`}
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
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
