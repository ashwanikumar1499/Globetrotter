"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaMedal } from "react-icons/fa";

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
        return <FaMedal className="text-blue-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 * rank }}
      className={`p-4 rounded-xl flex justify-between items-center ${
        currentUser
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-blue-100"
          : "bg-white border border-gray-100"
      } shadow-md hover:shadow-lg transition-all duration-200`}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-50 to-blue-50 shadow-inner">
          {getMedalIcon()}
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{username}</span>
          <span className="text-sm text-gray-500">Rank #{rank}</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-full shadow-sm">
        <span className="font-bold">{score}</span>
        <span className="ml-1 text-sm opacity-80">pts</span>
      </div>
    </motion.div>
  );
}
