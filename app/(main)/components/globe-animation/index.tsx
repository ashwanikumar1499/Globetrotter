"use client";

import { motion } from "framer-motion";
import { FaGlobeAmericas, FaCompass } from "react-icons/fa";

export function GlobeAnimation() {
  return (
    <div className="flex justify-center mb-4">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="relative w-24 h-24 mb-2"
      >
        <FaGlobeAmericas className="absolute inset-0 w-full h-full text-blue-600 opacity-90" />
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <FaCompass className="w-8 h-8 text-white" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
