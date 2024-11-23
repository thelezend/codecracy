"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

// This would typically come from a database
const mockContributions = [
  { id: 1, title: "Implement user authentication", author: "Alice", votes: 3 },
  { id: 2, title: "Add dark mode support", author: "Bob", votes: 2 },
  { id: 3, title: "Refactor API endpoints", author: "Charlie", votes: 1 },
]

export function ContributionList({ projectId }: { projectId: string }) {
  const [contributions, setContributions] = useState(mockContributions)

  const handleVote = (contributionId: number) => {
    setContributions(prevContributions =>
      prevContributions.map(contribution =>
        contribution.id === contributionId
          ? { ...contribution, votes: contribution.votes + 1 }
          : contribution
      )
    )
  }

  return (
    <ul className="space-y-4">
      {contributions.map((contribution) => (
        <li key={contribution.id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
          <div>
            <h3 className="font-semibold">{contribution.title}</h3>
            <p className="text-sm text-gray-500">by {contribution.author}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{contribution.votes} votes</span>
            <Button onClick={() => handleVote(contribution.id)}>Vote</Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

