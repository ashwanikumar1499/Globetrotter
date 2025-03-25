"use client";

import { motion } from "framer-motion";

interface ChallengeCompleteProps {
  score: number;
  onPlayAgain: () => void;
}

export function ChallengeComplete({
  score,
  onPlayAgain,
}: ChallengeCompleteProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="challenge-completed text-center py-10"
    >
      <motion.h3
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-6"
      >
        🏆 Challenge Completed!
      </motion.h3>
      <motion.p className="text-lg text-gray-600 mb-8">
        Congratulations! You&apos;ve beaten the challenge with a score of{" "}
        {score}.
      </motion.p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPlayAgain}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300"
      >
        Play Again
      </motion.button>
    </motion.div>
  );
}
