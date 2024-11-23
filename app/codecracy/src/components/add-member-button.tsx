"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AddMemberButton({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false)
  const [memberName, setMemberName] = useState("")

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send a request to your backend to add the member
    console.log("Adding member:", { projectId, memberName })
    // Reset form and close dialog
    setMemberName("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Team Member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Enter the name or email of the team member you want to add to this project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddMember}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="memberName" className="text-right">
                Name
              </Label>
              <Input
                id="memberName"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Member</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

