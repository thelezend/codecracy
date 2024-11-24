"use client";

import { Button } from "@/components/ui/button";
import { useCodecracyProgram } from "../codecracy/data-access";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PollsList({ projectAddress }: { projectAddress: string }) {
  const { useGetPollsList } = useCodecracyProgram();

  const { data: polls } = useGetPollsList(projectAddress);

  if (!polls) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <Card key={poll.publicKey.toBase58()}>
          <CardHeader>
            <CardTitle>{poll.account.pullRequest}</CardTitle>
            <CardDescription>by {poll.account.user.toBase58()}</CardDescription>
          </CardHeader>
          <CardContent>
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
