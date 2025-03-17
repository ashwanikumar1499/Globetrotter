export async function checkUserExists(
  username: string
): Promise<{ exists: boolean; score: number }> {
  try {
    const response = await fetch(
      `/api/users?username=${encodeURIComponent(username)}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error checking user:", error);
    return { exists: false, score: 0 };
  }
}

export async function createOrUpdateUser(
  username: string,
  score: number
): Promise<{ username: string; score: number }> {
  try {
    const response = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        score,
        // Add a flag to indicate we want to force update even if score is lower
        forceUpdate: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to register user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }
}

export async function createChallenge(
  username: string,
  score: number
): Promise<{
  code: string;
  username: string;
  score: number;
}> {
  try {
    const response = await fetch("/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, score }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create challenge");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating challenge:", error);
    throw error;
  }
}
