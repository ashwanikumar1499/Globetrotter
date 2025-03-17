"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  barClassName?: string;
  height?: string;
  animated?: boolean;
}

export function ProgressBar({
  current,
  total,
  className = "w-full bg-gray-200 rounded-full h-2.5 mt-2",
  barClassName = "bg-indigo-600 h-2.5 rounded-full",
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, (current / total) * 100);

  return (
    <div className={className}>
      <motion.div
        className={barClassName}
        initial={animated ? { width: 0 } : { width: `${percentage}%` }}
        animate={animated ? { width: `${percentage}%` } : undefined}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}
