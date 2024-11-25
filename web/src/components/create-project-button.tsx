"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCodecracyProgram } from "./codecracy/data-access";

// Types and Schema
const projectFormSchema = z.object({
  projectName: z
    .string()
    .min(1, { message: "Project name must be at least 1 character." }),
  githubHandle: z
    .string()
    .min(1, { message: "Github handle must be at least 1 character." }),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

// Custom hook for form logic
function useProjectForm() {
  const { createProject } = useCodecracyProgram();
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { projectName: "", githubHandle: "" },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      await createProject.mutateAsync(values);
      form.reset();
      return true;
    } catch (error) {
      console.error("Failed to create project:", error);
      return false;
    }
  };

  return {
    form,
    onSubmit,
    isLoading: createProject.isPending,
    error: createProject.error,
  };
}

// Form Component
function ProjectForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (values: ProjectFormValues) => Promise<boolean>;
  isLoading: boolean;
}) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { projectName: "", githubHandle: "" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    return await onSubmit(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="codecracy" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of your project on GitHub.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="githubHandle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Github Handle</FormLabel>
              <FormControl>
                <Input placeholder="thelezend" {...field} />
              </FormControl>
              <FormDescription>
                This is your or your organization&apos;s GitHub username.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// Main Component
export function CreateProjectButton() {
  const [open, setOpen] = useState(false);
  const { onSubmit, isLoading } = useProjectForm();

  const handleSubmit = async (values: ProjectFormValues): Promise<boolean> => {
    const success = await onSubmit(values);
    if (success) {
      setOpen(false);
    }
    return success;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <span>Create Project</span>
          <CirclePlusIcon className="w-20 h-20" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Enter the details for your new project. You will be designated as
            the project administrator.
          </DialogDescription>
        </DialogHeader>
        <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
