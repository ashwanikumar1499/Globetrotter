"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GameResponse } from "@/app/lib/types/game";

interface FeedbackDisplayProps {
  feedback?: GameResponse;
  streak: number;
}

export function FeedbackDisplay({ feedback, streak }: FeedbackDisplayProps) {
  if (!feedback) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="feedback"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`feedback p-6 rounded-xl mb-8 ${
          feedback.correct
            ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
            : "bg-gradient-to-r from-red-400 to-rose-500 text-white"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h3 className="text-xl font-bold mb-2">
            {feedback.correct ? "🎉 Correct!" : "😢 Not quite right..."}
          </h3>
          <p className="text-lg mb-2">{feedback.fact}</p>
          {feedback.correct && streak > 1 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-2 inline-block px-4 py-1 bg-white/20 rounded-full text-white font-bold"
            >
              🔥 {streak} in a row!
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
