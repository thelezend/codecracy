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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { CirclePlusIcon, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCodecracyProgram } from "../codecracy/data-access";

// Form Schema
const addMemberFormSchema = z.object({
  memberAddress: z
    .string()
    .min(1, { message: "Member address is required" })
    .refine(
      (value) => {
        try {
          new PublicKey(value);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Invalid Solana address" }
    ),
  githubHandle: z
    .string()
    .min(1, { message: "Github handle is required" })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Invalid GitHub handle format",
    }),
});

type AddMemberFormValues = z.infer<typeof addMemberFormSchema>;

// Add Member Form Component
function AddMemberForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (values: AddMemberFormValues) => void;
  isLoading: boolean;
}) {
  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberFormSchema),
    defaultValues: {
      githubHandle: "",
      memberAddress: "",
    },
  });

  return (
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
              <FormDescription>GitHub username of the member</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export function AddMemberButton({
  projectAddress,
}: {
  projectAddress: string;
}) {
  const [open, setOpen] = useState(false);
  const { publicKey } = useWallet();
  const { useAddMember, useGetProject } = useCodecracyProgram();
  const addMember = useAddMember(new PublicKey(projectAddress));
  const project = useGetProject(projectAddress);

  const isAdmin = publicKey?.equals(project.data?.admin as PublicKey);

  const handleSubmit = async (values: AddMemberFormValues) => {
    try {
      await addMember.mutateAsync({
        newUser: new PublicKey(values.memberAddress),
        ...values,
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            disabled={!isAdmin}
            aria-label="Add team member"
            className="flex items-center gap-2"
          >
            <span>Add Member</span>
            <CirclePlusIcon className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription>
              Enter the details for your new team member.
            </DialogDescription>
          </DialogHeader>
          <AddMemberForm
            onSubmit={handleSubmit}
            isLoading={addMember.isPending}
          />
        </DialogContent>
      </Dialog>

      {!isAdmin && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-yellow-500/70 hover:text-yellow-500 transition-colors">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Only project admin can add new team members</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
