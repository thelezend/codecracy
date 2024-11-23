"use client";

import { notFound } from "next/navigation";
import { useCodecracyProgram } from "../codecracy/data-access";
import { TypographyH2 } from "../typography/h2";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PublicKey } from "@solana/web3.js";

export default function ProjectDetails({
  projectAddress,
}: {
  projectAddress: string;
}) {
  const { useGetProject, useGetMembers } = useCodecracyProgram();

  const project = useGetProject(projectAddress);
  const teamMembers = useGetMembers([
    {
      memcmp: { offset: 8 + 64, bytes: projectAddress },
    },
  ]);

  try {
    new PublicKey(projectAddress);
  } catch (error) {
    console.log(error);
    return notFound();
  }

  if (project.isLoading || teamMembers.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <TypographyH2 className="mb-4">{project.data?.projectName}</TypographyH2>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 mb-4">
            {teamMembers.data?.map((member) => (
              <li key={member.publicKey.toBase58()}>
                {member.publicKey.toBase58()}
              </li>
            ))}
          </ul>
          {/* <AddMemberButton projectId={project.id} /> */}
        </CardContent>
      </Card>
    </div>
  );
}
