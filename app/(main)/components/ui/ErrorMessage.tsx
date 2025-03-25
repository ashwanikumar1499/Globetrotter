"use client";

import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";
import { Button } from "./Button";

interface ErrorMessageProps {
  message: string | null;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 flex flex-col items-center"
    >
      <div className="flex items-center mb-2">
        <FaExclamationTriangle className="text-red-500 mr-2" />
        <span className="font-medium">Error</span>
      </div>
      <p className="text-center mb-3">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger" size="sm">
          Try Again
        </Button>
      )}
    </motion.div>
  );
}
