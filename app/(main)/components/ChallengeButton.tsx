"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGlobeAmericas } from "react-icons/fa";
import { useUserStore } from "@/app/lib/store/userStore";
import { UserInputForm } from "./challenge/UserInputForm";
import { UserScoreDisplay } from "./challenge/UserScoreDisplay";
import { ShareModal } from "./challenge/ShareModal";
import {
  createOrUpdateUser,
  createChallenge,
} from "@/app/lib/services/userService";

export default function ChallengeButton() {
  // Form state
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Share state
  const [shareData, setShareData] = useState<{
    shareUrl: string;
    code: string;
    username: string;
    score: number;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Get user state from the store
  const {
    username: storedUsername,
    score: userScore,
    isRegistered,
    setUsername: setUserStoreUsername,
    setIsRegistered,
  } = useUserStore();

  // Use stored username if available
  useEffect(() => {
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [storedUsername]);

  const handleCreateChallenge = async () => {
    const trimmedUsername = username.trim();

    // Validate username
    if (!trimmedUsername) {
      setError("Please enter a username first");
      return;
    }

    if (trimmedUsername.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Set the username in the user store
      setUserStoreUsername(trimmedUsername);

      // Always use the current session score
      const currentScore = userScore || 0;

      // Create or update the user in the database with the current score
      const updatedUser = await createOrUpdateUser(
        trimmedUsername,
        currentScore
      );

      setIsRegistered(true);

      // Create the challenge with the user's current score
      const challengeData = await createChallenge(
        trimmedUsername,
        updatedUser.score
      );

      // Create the share URL
      const shareUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/challenge/${challengeData.code}`
          : "";

      setShareData({
        shareUrl,
        code: challengeData.code,
        username: challengeData.username,
        score: challengeData.score,
      });

      setShowModal(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create challenge. Please try again."
      );
      console.error("Challenge creation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="challenge-section mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl shadow-lg border border-purple-100"
    >
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4 flex items-center">
        <FaGlobeAmericas className="mr-2 text-purple-600" />
        Challenge a Friend
      </h2>
      <p className="text-purple-600 mb-6">
        Create a challenge and share it with your friends to see if they can
        beat your score!
      </p>

      <UserInputForm
        username={username}
        setUsername={setUsername}
        onSubmit={handleCreateChallenge}
        isLoading={isLoading}
        error={error}
      />

      <UserScoreDisplay
        username={username}
        isLoading={isLoading}
        isRegistered={isRegistered}
        userScore={userScore}
      />

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-500 mb-4"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <ShareModal
        show={showModal}
        onClose={() => setShowModal(false)}
        shareData={shareData}
      />
    </motion.div>
  );
}
