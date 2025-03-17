import { GameQuestion, GameResponse } from "@/app/lib/types/game";

export async function fetchGameQuestion(): Promise<GameQuestion> {
  try {
    const res = await fetch("/api/game");
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch question:", error);
    throw new Error("Failed to load game question");
  }
}

export async function submitGuess(
  selectedCity: string,
  correctCountry: string
): Promise<GameResponse> {
  try {
    const res = await fetch("/api/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city: selectedCity,
        country: correctCountry,
      }),
    });
    return await res.json();
  } catch (error) {
    console.error("Failed to submit guess:", error);
    throw new Error("Failed to submit your guess");
  }
}
