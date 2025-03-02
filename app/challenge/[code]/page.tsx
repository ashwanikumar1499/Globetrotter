"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaWhatsapp, FaCheck, FaTimes } from "react-icons/fa";
import GameBoard from "@/app/(main)/components/GameBoard";
import LoadingSpinner from "@/app/(main)/components/LoadingSpinner";
import { useUserStore } from "@/app/lib/store/userStore";

interface ChallengeData {
  valid: boolean;
  inviterUsername: string;
  inviterScore: number;
}

export default function ChallengePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const router = useRouter();
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [challengeCode, setChallengeCode] = useState("");

  // Get user state from the store
  const {
    username: storedUsername,
    isRegistered,
    setUsername: setUserStoreUsername,
    checkUser,
  } = useUserStore();

  useEffect(() => {
    // Use storedUsername if available
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchChallengeData = async () => {
      setIsLoading(true);
      setError("");

      try {
        // Access params.code safely inside the async function
        const paramsValue = await params;
        const code = paramsValue?.code;

        if (!code) {
          throw new Error("Invalid challenge code");
        }

        // Store the challenge code in state for sharing
        setChallengeCode(code);

        const res = await fetch(`/api/challenges/${code}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load challenge");
        }

        if (!data.valid) {
          throw new Error("Challenge not found or has expired");
        }

        setChallengeData(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallengeData();
    // Include params in the dependency array
  }, [storedUsername, params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Set the username in the user store
      setUserStoreUsername(username);

      console.log("Creating/updating user:", username);

      // Create or update the user in the database
      const userResponse = await fetch("/api/users", {
        method: "PUT", // PUT will create or update the user
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          score: 0, // Start with 0 score for new users
        }),
      });

      let userData;
      try {
        userData = await userResponse.json();
      } catch (e) {
        console.error("Failed to parse user response:", e);
        throw new Error("Invalid response from server");
      }

      if (!userResponse.ok) {
        console.error("User API error response:", userData);
        throw new Error(userData.error || "Failed to register user");
      }

      console.log("User created/updated successfully:", userData);

      // Update the user store with the user data
      await checkUser(username);

      // No need to set showGame since it's not used
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Challenge submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScoreUpdate = (score: number) => {
    setCurrentScore(score);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  // Update the WhatsApp sharing link to use the challengeCode state
  const getShareUrl = () => {
    return typeof window !== "undefined"
      ? `${window.location.origin}/challenge/${challengeCode}`
      : "";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-blue-50">
        <LoadingSpinner size="lg" color="primary" text="Loading challenge..." />
      </div>
    );
  }

  if (error || !challengeData || !challengeData.valid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="text-red-500 text-5xl mb-4">
            <FaTimes className="mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Challenge Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "This challenge doesn't exist or has expired."}
          </p>
          <button
            onClick={handleBackToHome}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-colors w-full"
          >
            <FaArrowLeft /> Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  // Extract data from challengeData
  const { inviterUsername, inviterScore } = challengeData || {
    inviterUsername: "",
    inviterScore: 0,
  };
  const targetScore = inviterScore + 1;

  // If the user hasn't entered a username yet
  if (!isRegistered) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Accept the Challenge!
            </h1>
            <p className="text-gray-600">
              <span className="font-semibold text-indigo-600">
                {inviterUsername}
              </span>{" "}
              has challenged you to beat their score of{" "}
              <span className="font-semibold text-indigo-600">
                {inviterScore}
              </span>
              . You need to score at least{" "}
              <span className="font-semibold text-indigo-600">
                {targetScore}
              </span>{" "}
              to win!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter your username to start
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username (min 3 characters)"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                minLength={3}
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium">{error}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || username.length < 3}
              className={`flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-medium transition-colors ${
                isSubmitting || username.length < 3
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" color="white" /> Processing...
                </>
              ) : (
                <>
                  <FaCheck /> Accept Challenge
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleBackToHome}
              className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              <FaArrowLeft /> Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // If the user has entered a username, show the game
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-indigo-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 py-2 px-4 rounded-lg bg-white hover:bg-gray-50 text-gray-700 shadow-sm transition-colors"
          >
            <FaArrowLeft /> Back to Home
          </button>

          <a
            href={`https://wa.me/?text=I&apos;m playing Globetrotter! Can you beat my score of ${currentScore}? Try it here: ${getShareUrl()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-xl transition-colors w-full"
          >
            <FaWhatsapp size={20} /> Share on WhatsApp
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-xl mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Challenge from {inviterUsername}
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl">
            <div>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">
                  {inviterUsername}&apos;s Score:
                </span>{" "}
                {inviterScore}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Target Score:</span>{" "}
                {targetScore}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Your Current Score:</span>{" "}
                {currentScore}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-600">
                You need to score at least{" "}
                <span className="font-bold text-indigo-600">{targetScore}</span>{" "}
                to beat {inviterUsername}&apos;s challenge!
              </p>
            </div>
          </div>
        </motion.div>

        <GameBoard
          challengeMode={true}
          targetScore={targetScore}
          username={username}
          onScoreUpdate={handleScoreUpdate}
        />
      </div>
    </div>
  );
}
