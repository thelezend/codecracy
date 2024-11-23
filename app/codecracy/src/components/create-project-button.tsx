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

const formSchema = z.object({
  projectName: z.string().min(1, {
    message: "Project name must be at least 1 character.",
  }),
  githubHandle: z.string().min(1, {
    message: "Github handle must be at least 1 character.",
  }),
});

export function CreateProjectButton() {
  const [open, setOpen] = useState(false);
  const { createProject } = useCodecracyProgram();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      githubHandle: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createProject.mutateAsync(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                    This is your or your organization&#39;s GitHub username.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
