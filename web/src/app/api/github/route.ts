import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`https://api.github.com/users/thelezend`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error("Failed to fetch GitHub profile");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch GitHub profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub profile" },
      { status: 500 }
    );
  }
}
