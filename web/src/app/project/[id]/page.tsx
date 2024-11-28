import Project from "@/components/project-page/project";
import { PublicKey } from "@solana/web3.js";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let project;

  try {
    project = new PublicKey((await params).id);
  } catch (err) {
    console.log(err);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 dark:to-gray-900/50">
      <Project projectAddress={project.toBase58()} />
    </div>
  );
}
