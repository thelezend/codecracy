import Project from "@/components/project/project";
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

  return <Project projectAddress={project.toBase58()} />;
}
