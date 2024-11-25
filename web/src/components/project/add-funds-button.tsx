"use client";

import { useCodecracyProgram } from "@/components/codecracy/data-access";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { getVaultPda } from "../codecracy/pdas";
import { CODECRACY_PROGRAM_ID } from "../codecracy/program-export";

const formSchema = z.object({
  solAmount: z
    .string()
    .min(0.1, "Minimum amount is 0.1 SOL")
    .refine(
      (value) => !isNaN(Number(value)) && Number(value) > 0,
      "Amount must be a positive number"
    ),
});

type FormValues = z.infer<typeof formSchema>;

interface AddFundsButtonProps {
  projectAddress: string;
}

export function AddFundsButton({ projectAddress }: AddFundsButtonProps) {
  const [open, setOpen] = useState(false);
  const { useAddFunds } = useCodecracyProgram();
  const addFunds = useAddFunds(projectAddress);
  const vault = getVaultPda(
    new PublicKey(projectAddress),
    CODECRACY_PROGRAM_ID
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      solAmount: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await addFunds.mutateAsync(Number(values.solAmount));
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to add funds:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative z-10">
          Add Funds
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Funds</DialogTitle>
          <DialogDescription>
            Add funds to the project vault. These funds will be locked until the
            project is closed.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="solAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SOL Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter amount in SOL"
                      type="number"
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-2">
              <p>
                Funds will be stored in the project vault:
                <code className="ml-2 text-xs">{vault.toBase58()}</code>
              </p>
              <p className="text-muted-foreground">
                Note: These funds cannot be claimed until the project is closed.
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={addFunds.isPending}>
                {addFunds.isPending ? "Adding Funds..." : "Add Funds"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
