import { motion } from "framer-motion";
import React from "react";
import { FaClock } from "react-icons/fa";

interface TimerProps {
  timeRemaining: number;
  progress: number;
}

function Timer({ timeRemaining, progress }: TimerProps) {
  // Format time to show minutes and seconds
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = Math.floor(timeRemaining % 60);
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const getColor = () => {
    if (progress > 60) return "bg-emerald-500";
    if (progress > 30) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <FaClock className="text-gray-600" />
            <span className="font-semibold text-lg">{formattedTime}</span>
          </div>
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className={`h-full transition-colors duration-300 ${getColor()}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Timer;
