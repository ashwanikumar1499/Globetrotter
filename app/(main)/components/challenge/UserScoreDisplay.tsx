"use client";

import { motion } from "framer-motion";
import { FaTrophy } from "react-icons/fa";
import LoadingSpinner from "../LoadingSpinner";

interface UserScoreDisplayProps {
  username: string;
  isLoading: boolean;
  isRegistered: boolean;
  userScore: number;
}

export function UserScoreDisplay({
  username,
  isLoading,
  isRegistered,
  userScore,
}: UserScoreDisplayProps) {
  if (username.trim().length < 3) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-4 flex items-center"
    >
      {isLoading ? (
        <div className="flex items-center text-indigo-600 text-sm">
          <LoadingSpinner size="sm" color="primary" />
          <span className="ml-2">Checking user...</span>
        </div>
      ) : isRegistered ? (
        <div className="flex items-center text-indigo-600">
          <FaTrophy className="text-amber-500 mr-2" />
          <span>
            Your current score: <span className="font-bold">{userScore}</span>
          </span>
          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            Registered
          </span>
        </div>
      ) : (
        <div className="text-indigo-600 text-sm">
          <span>New user - your score will start at 0</span>
        </div>
      )}
    </motion.div>
  );
}
