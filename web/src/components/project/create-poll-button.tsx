"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCodecracyProgram } from "../codecracy/data-access";

// Poll Creation Form Component
interface CreatePollFormValues {
  pullRequest: number;
  endTime: string;
}

const createPollFormSchema = z.object({
  pullRequest: z
    .number()
    .min(1, { message: "Pull request number must be at least 1." }),
  endTime: z
    .string()
    .min(1, { message: "End time must be at least 1 character." }),
});

function CreatePollForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (values: CreatePollFormValues) => Promise<boolean>;
  isLoading: boolean;
}) {
  const form = useForm<CreatePollFormValues>({
    resolver: zodResolver(createPollFormSchema),
    defaultValues: { pullRequest: 0, endTime: "" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    return await onSubmit(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="pullRequest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pull Request Number</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Enter the pull request number from GitHub for this poll.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poll End Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormDescription>
                This is the end time of the poll.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Poll"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export function CreatePollButton({
  projectAddress,
}: {
  projectAddress: string;
}) {
  const [open, setOpen] = useState(false);
  const { useCreatePoll, useGetProject } = useCodecracyProgram();
  const { data: projectData } = useGetProject(projectAddress);
  const { mutate: createPoll, isPending: isLoading } = useCreatePoll(
    new PublicKey(projectAddress)
  );

  const handleSubmit = async (
    values: CreatePollFormValues
  ): Promise<boolean> => {
    try {
      const prNumber = values.pullRequest;
      const closeTime = Math.floor(new Date(values.endTime).getTime() / 1000);

      if (!isNaN(prNumber) && !isNaN(closeTime)) {
        createPoll(
          { pullRequest: prNumber, closeTime },
          {
            onSuccess: () => {
              setOpen(false);
            },
          }
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to create poll:", error);
      return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!projectData?.isActive}>Create Poll</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Poll</DialogTitle>
        </DialogHeader>
        <CreatePollForm onSubmit={handleSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
