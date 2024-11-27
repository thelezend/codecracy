type GitHubProfile = {
  name: string;
  login: string;
  avatar_url: string;
};

async function getGitHubProfile(username: string): Promise<GitHubProfile> {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error("Failed to fetch GitHub profile");
  }

  return res.json();
}

export async function GitHubProfile() {
  const profile = await getGitHubProfile("thelezend");

  return (
    <div className="space-y-2">
      <h3 className="text-2xl font-bold">{profile.name}</h3>
      <p className="text-gray-500 dark:text-gray-400">
        Solana Blockchain Developer, Full Stack Engineer & Part-time Degen
      </p>
    </div>
  );
}
