"use client";

import { motion } from "framer-motion";
import { GameHeader } from "./GameHeader";

interface CluesDisplayProps {
  clues: string[];
  visibleClues: number;
  onRevealNextClue: () => void;
  onRevealAllClues: () => void;
}

export function CluesDisplay({
  clues,
  visibleClues,
  onRevealNextClue,
  onRevealAllClues,
}: CluesDisplayProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <>
      <GameHeader
        hasMoreClues={visibleClues < clues.length}
        onRevealNextClue={onRevealNextClue}
        onRevealAllClues={onRevealAllClues}
      />

      <motion.div
        variants={itemVariants}
        className="clues-container space-y-4 mb-8"
      >
        {clues.slice(0, visibleClues).map((clue, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="clue-card bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm border border-blue-100"
          >
            <span className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-8 h-8 rounded-full text-center leading-8 mr-3 shadow-sm">
              {index + 1}
            </span>
            <span className="text-gray-800">{clue}</span>
          </motion.div>
        ))}

        {visibleClues < clues.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-2"
          >
            <motion.p
              className="text-indigo-500 text-sm"
              animate={{
                y: [0, 5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
              }}
            >
              Need more clues? Use the buttons above
            </motion.p>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
