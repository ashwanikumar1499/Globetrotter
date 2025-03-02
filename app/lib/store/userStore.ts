import { create } from "zustand";

interface UserState {
  username: string;
  score: number;
  isRegistered: boolean;
  setUsername: (username: string) => void;
  setScore: (score: number) => void;
  setIsRegistered: (isRegistered: boolean) => void;
  updateScore: (newScore: number) => Promise<void>;
  checkUser: (username: string) => Promise<void>;
  reset: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  username: "",
  score: 0,
  isRegistered: false,

  setUsername: (username) => set({ username }),
  setScore: (score) => set({ score }),
  setIsRegistered: (isRegistered) => set({ isRegistered }),

  reset: () => set({ username: "", score: 0, isRegistered: false }),

  updateScore: async (newScore) => {
    const { username, score } = get();

    // Only update if the new score is higher than the current score
    if (newScore <= score) return;

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, score: newScore }),
      });

      if (res.ok) {
        const data = await res.json();
        set({ score: data.score, isRegistered: true });
      }
    } catch (error) {
      console.error("Failed to update user score:", error);
    }
  },

  checkUser: async (username) => {
    if (!username || username.length < 3) {
      set({ score: 0, isRegistered: false });
      return;
    }

    try {
      const res = await fetch(
        `/api/users?username=${encodeURIComponent(username)}`
      );
      if (res.ok) {
        const data = await res.json();
        set({
          username,
          score: data.exists ? data.score : 0,
          isRegistered: data.exists,
        });
      }
    } catch (error) {
      console.error("Failed to check user:", error);
    }
  },
}));
