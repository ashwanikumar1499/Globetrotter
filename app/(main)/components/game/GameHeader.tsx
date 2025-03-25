"use client";

import { motion } from "framer-motion";
import { FaGlobeAmericas, FaLightbulb, FaQuestionCircle } from "react-icons/fa";
import { Button } from "../ui/Button";

interface GameHeaderProps {
  hasMoreClues: boolean;
  onRevealNextClue: () => void;
  onRevealAllClues: () => void;
}

export function GameHeader({
  hasMoreClues,
  onRevealNextClue,
  onRevealAllClues,
}: GameHeaderProps) {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <motion.h3
        variants={itemVariants}
        className="text-xl font-semibold text-indigo-700 flex items-center"
      >
        <FaGlobeAmericas className="mr-2" />
        Guess the Destination
      </motion.h3>

      <motion.div variants={itemVariants} className="flex gap-2">
        <Button
          onClick={onRevealNextClue}
          disabled={!hasMoreClues}
          variant="warning"
          size="sm"
          icon={<FaLightbulb className="text-amber-500" />}
        >
          Next Clue
        </Button>

        <Button
          onClick={onRevealAllClues}
          disabled={!hasMoreClues}
          variant="info"
          size="sm"
          icon={<FaQuestionCircle className="text-blue-500" />}
        >
          Show All Clues
        </Button>
      </motion.div>
    </div>
  );
}
