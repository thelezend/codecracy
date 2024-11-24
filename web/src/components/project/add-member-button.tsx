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
import { PublicKey } from "@solana/web3.js";
import { CirclePlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCodecracyProgram } from "../codecracy/data-access";
import { useWallet } from "@solana/wallet-adapter-react";

const formSchema = z.object({
  memberAddress: z.string().min(1, {
    message: "Member address must be at least 1 character.",
  }),
  githubHandle: z.string().min(1, {
    message: "Github handle must be at least 1 character.",
  }),
});

export function AddMemberButton({
  projectAddress,
}: {
  projectAddress: string;
}) {
  const [open, setOpen] = useState(false);
  const { publicKey } = useWallet();
  const { addMember, useGetProject } = useCodecracyProgram();
  const project = useGetProject(projectAddress);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      githubHandle: "",
      memberAddress: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("here");
    addMember.mutateAsync({
      project: new PublicKey(projectAddress),
      newUser: new PublicKey(values.memberAddress),
      ...values,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          disabled={!publicKey?.equals(project.data?.admin as PublicKey)}
        >
          <CirclePlusIcon className="w-20 h-20" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Enter the details for your new member.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="memberAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="9fBPHthnGU2SBaSifXhDw526q2R27HBjt7VyJi67bX8z"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Solana wallet address of the member
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
                    This is the github handle of your member
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
