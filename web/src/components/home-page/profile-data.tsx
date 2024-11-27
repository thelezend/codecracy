"use client";

import { useEffect, useState } from "react";

type GitHubProfile = {
  name: string;
  login: string;
  avatar_url: string;
};

export function ProfileData() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/github");
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch GitHub profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-6 w-64 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">theLezend</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Solana Blockchain Developer, Full Stack Engineer & Part-time Degen
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-2xl font-bold">{profile.name || profile.login}</h3>
      <p className="text-gray-500 dark:text-gray-400">
        Solana Blockchain Developer, Full Stack Engineer & Part-time Degen
      </p>
    </div>
  );
}
