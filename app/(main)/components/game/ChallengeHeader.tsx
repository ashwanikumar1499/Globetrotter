"use client";

import { motion } from "framer-motion";
import { FaGlobeAmericas } from "react-icons/fa";
import { ProgressBar } from "../ui/ProgressBar";

interface ChallengeHeaderProps {
  score: number;
  targetScore: number;
}

export function ChallengeHeader({ score, targetScore }: ChallengeHeaderProps) {
  if (!targetScore) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="challenge-header mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl"
    >
      <h2 className="text-xl font-semibold text-indigo-700 flex items-center">
        <FaGlobeAmericas className="mr-2" />
        Challenge Mode: {score}/{targetScore}
      </h2>
      <ProgressBar current={score} total={targetScore} />
    </motion.div>
  );
}
