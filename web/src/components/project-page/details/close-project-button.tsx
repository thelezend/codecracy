"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { useCodecracyProgram } from "../../codecracy/data-access";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

interface CloseProjectButtonProps {
  projectAddress: string;
  onSuccess?: () => void;
}

export function CloseProjectButton({
  projectAddress,
  onSuccess,
}: CloseProjectButtonProps) {
  const [open, setOpen] = useState(false);
  const { publicKey: userWallet } = useWallet();
  const { useGetProject, useCloseProject } = useCodecracyProgram();

  const { data: projectData, isLoading: isLoadingProject } =
    useGetProject(projectAddress);
  const { mutate: closeProject, isPending: isClosing } = useCloseProject(
    new PublicKey(projectAddress)
  );

  // Early returns for various states
  if (!userWallet) {
    return null;
  }

  if (!projectData || isLoadingProject) {
    return null;
  }

  const handleClose = async () => {
    try {
      closeProject();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to close project:", error);
    }
  };

  const isDisabled = isClosing || isLoadingProject;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="relative z-10"
          disabled={isDisabled}
        >
          {isClosing ? "Closing..." : "Close Project"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Project Closure</DialogTitle>
          <DialogDescription>
            Are you sure you want to close the project? This action is
            irreversible.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isClosing}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleClose}
            disabled={isClosing}
          >
            {isClosing ? "Closing..." : "Close Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
