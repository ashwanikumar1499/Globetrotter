"use client";

import { motion } from "framer-motion";
import { GameResponse } from "@/app/lib/types/game";

interface OptionsGridProps {
  options: string[];
  onGuess: (city: string) => void;
  feedback?: GameResponse;
  selectedOption: string | null;
}

export function OptionsGrid({
  options,
  onGuess,
  feedback,
  selectedOption,
}: OptionsGridProps) {
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" },
    tap: { scale: 0.95 },
    correct: {
      scale: [1, 1.2, 1],
      backgroundColor: "#10B981",
      color: "white",
      transition: { duration: 0.5 },
    },
    incorrect: {
      scale: [1, 0.9, 1],
      backgroundColor: "#EF4444",
      color: "white",
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div className="options-grid grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      {options.map((city) => (
        <motion.button
          key={city}
          onClick={() => !feedback && onGuess(city)}
          disabled={!!feedback}
          variants={buttonVariants}
          initial="idle"
          whileHover={!feedback ? "hover" : undefined}
          whileTap={!feedback ? "tap" : undefined}
          animate={
            feedback
              ? selectedOption === city
                ? feedback.correct
                  ? "correct"
                  : "incorrect"
                : "idle"
              : "idle"
          }
          className={`option-button py-4 px-6 rounded-xl text-lg font-medium transition-all duration-300 ${
            feedback
              ? "cursor-default"
              : "bg-white border-2 border-gray-200 hover:border-indigo-300 text-gray-800 shadow-sm hover:shadow"
          }`}
        >
          {city}
        </motion.button>
      ))}
    </motion.div>
  );
}
