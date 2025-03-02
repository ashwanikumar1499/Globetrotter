"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "white";
  text?: string;
}

export default function LoadingSpinner({
  size = "md",
  color = "primary",
  text,
}: LoadingSpinnerProps) {
  // Size mappings
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  // Color mappings
  const colorMap = {
    primary: "border-blue-500",
    secondary: "border-purple-500",
    white: "border-white",
  };

  // Text size mappings
  const textSizeMap = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1,
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className={`${sizeMap[size]} border-4 border-t-transparent ${colorMap[color]} rounded-full`}
        animate={{ rotate: 360 }}
        transition={spinTransition}
        role="status"
        aria-label="loading"
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`mt-2 ${textSizeMap[size]} text-gray-600 dark:text-gray-300`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
