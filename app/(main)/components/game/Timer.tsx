import { motion } from "framer-motion";
import { opacity } from "html2canvas/dist/types/css/property-descriptors/opacity";
import React from "react";
import { FaClock } from "react-icons/fa";

interface timerProps {
  timeRemaining: number;
  progress: number;
}

function Timer({ timeRemaining, progress }: timerProps) {
  const getColor = () => {
    if (progress > 60) return "bg-green-400";
    if (progress > 30) return "bg-yellow-400";
    return "bg-red-400";
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center space-x-3">
        <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden relative">
          <motion.div
            style={{ width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
            className={`h-2 top-0 left-0 bottom-0 absolute ${getColor()}`}
          ></motion.div>
        </div>
        <div className="flex items-center ">
          <FaClock />
          <span>{timeRemaining}s</span>
        </div>
      </div>
    </motion.div>
  );
}

export default Timer;
