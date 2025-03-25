"use client";

import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="mt-16 text-center text-gray-500 text-sm"
    >
      <p className="flex items-center justify-center">
        © {new Date().getFullYear()} Globetrotter Challenge. All rights
        reserved.
      </p>
      <p className="mt-2 flex items-center justify-center">
        Made with <FaHeart className="text-red-400 mx-1" /> for explorers around
        the world
      </p>
    </motion.footer>
  );
}
