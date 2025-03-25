export interface leaderboardUser {
  username: string;
  score: string;
}

export interface paginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface leaderboardResponse {
  users: leaderboardUser[];
  pagination: paginationData;
}

export async function fetchLeaderBoarddata(
  pageNumber = 1,
  limit = 10
): Promise<leaderboardResponse> {
  try {
    // For server-side fetch in production, we need the full URL
    const isServer = typeof window === "undefined";

    // Use relative URL for client-side and absolute URL for server-side
    const url = isServer
      ? `${
          process.env.NEXT_PUBLIC_APP_URL ||
          `https://${process.env.VERCEL_URL}` ||
          "http://localhost:3000"
        }/api/leaderboard?page=${pageNumber}&limit=${limit}`
      : `/api/leaderboard?page=${pageNumber}&limit=${limit}`;

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in leaderboard service:", error);
    return {
      users: [],
      pagination: {
        total: 0,
        page: pageNumber,
        limit,
        pages: 0,
      },
    };
  }
}
