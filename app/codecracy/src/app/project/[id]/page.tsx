import ProjectDetails from "@/components/project/details";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PublicKey } from "@solana/web3.js";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  let project;
  try {
    project = new PublicKey((await params).id);
  } catch (err) {
    console.log(err);
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <ProjectDetails projectAddress={project.toBase58()} />
      <Card>
        <CardHeader>
          <CardTitle>Contributions</CardTitle>
          <CardDescription>
            Recent pull requests and their voting status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <ContributionList projectId={project.id} /> */}
        </CardContent>
      </Card>
    </div>
  );
}
