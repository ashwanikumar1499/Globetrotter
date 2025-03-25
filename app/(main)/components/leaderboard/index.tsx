"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaAward, FaMedal, FaTrophy } from "react-icons/fa";

interface LeaderboardViewProps {
  username: string;
  score: string;
  rank: number;
  currentUser?: boolean;
}

export default function LeaderboardView({
  username,
  score,
  rank,
  currentUser,
}: LeaderboardViewProps) {
  const getMedalIcon = () => {
    switch (rank) {
      case 1:
        return <FaTrophy className="text-yellow-400" />;
      case 2:
        return <FaMedal className="text-gray-400" />;
      case 3:
        return <FaMedal className="text-amber-700" />;
      default:
        return <FaAward className="text-blue-500" />;
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.2 * rank }}
      className={`p-4 border rounded-lg flex justify-between items-center ${
        currentUser ? "bg-blue-50 border-blue-200" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg w-8">
          {" "}
          {getMedalIcon()} #{rank}
        </span>
        <span className="font-medium">{username}</span>
      </div>
      <div>
        <span className="font-semibold">{score} pts</span>
      </div>
    </motion.div>
  );
}
