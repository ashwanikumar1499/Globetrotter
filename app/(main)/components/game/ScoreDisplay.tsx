"use client";

import { motion } from "framer-motion";

interface ScoreDisplayProps {
  score: number;
  targetScore?: number;
  streak: number;
  showFeedback: boolean;
  challengeMode?: boolean;
  hintUsed?: boolean;
}

export function ScoreDisplay({
  score,
  targetScore = 0,
  streak,
  showFeedback,
  challengeMode = false,
  hintUsed = false,
}: ScoreDisplayProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="score-display py-3 px-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full font-bold text-gray-700 inline-block shadow-sm"
        >
          <motion.span
            key={score}
            initial={{ scale: 1.5, color: "#4F46E5" }}
            animate={{ scale: 1, color: "#374151" }}
            transition={{ duration: 0.5 }}
          >
            Score: {score}
          </motion.span>
          {challengeMode && ` / ${targetScore}`}
        </motion.div>

        {hintUsed && (
          <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
            Hints used
          </span>
        )}
      </div>

      {streak > 1 && !showFeedback && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="streak-display py-2 px-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full font-bold text-white inline-flex items-center shadow-sm"
        >
          <span className="mr-1">🔥</span> {streak} streak
        </motion.div>
      )}
    </div>
  );
}
