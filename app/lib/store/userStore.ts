import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createOrUpdateUser } from "../services/userService";

interface UserState {
  username: string;
  score: number;
  isRegistered: boolean;
  setUsername: (username: string) => void;
  setScore: (score: number) => void;
  setIsRegistered: (isRegistered: boolean) => void;
  register: (username: string) => Promise<void>;
  updateScore: (score: number) => Promise<void>;
  checkUser: (username: string) => Promise<{ exists: boolean; score: number }>;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      username: "",
      score: 0,
      isRegistered: false,

      setUsername: (username) => set({ username }),
      setScore: (score) => set({ score }),
      setIsRegistered: (isRegistered) => set({ isRegistered }),

      register: async (username) => {
        try {
          const userData = await createOrUpdateUser(username, 0);
          set({
            username: userData.username,
            score: userData.score,
            isRegistered: true,
          });
        } catch (error) {
          console.error("Registration error:", error);
          throw error;
        }
      },

      updateScore: async (score) => {
        try {
          const { username } = get();
          if (username) {
            await createOrUpdateUser(username, score);
            set({ score });
          }
        } catch (error) {
          console.error("Score update error:", error);
          throw error;
        }
      },

      checkUser: async (username: string) => {
        try {
          const response = await fetch(`/api/users/${username}`);
          const userData = await response.json();
          if (userData && userData.username) {
            set({
              username: userData.username,
              score: userData.score,
              isRegistered: true,
            });
          }
          return userData;
        } catch (error) {
          console.error("Check user error:", error);
          return { exists: false, score: 0 };
        }
      },

      reset: () => set({ username: "", score: 0, isRegistered: false }),
    }),
    {
      name: "user-storage",
      skipHydration: true,
    }
  )
);
