"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureBadgeProps {
  icon: ReactNode;
  text: string;
}

export function FeatureBadge({ icon, text }: FeatureBadgeProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-blue-100 flex items-center text-blue-700"
    >
      <span className="mr-2 text-blue-500">{icon}</span>
      {text}
    </motion.div>
  );
}
