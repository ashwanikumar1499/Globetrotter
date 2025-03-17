"use client";

import { motion } from "framer-motion";
import { FaUserAlt, FaShare } from "react-icons/fa";
import LoadingSpinner from "../LoadingSpinner";

interface UserInputFormProps {
  username: string;
  setUsername: (username: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string;
}

export function UserInputForm({
  username,
  setUsername,
  onSubmit,
  isLoading,
  error,
}: UserInputFormProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <motion.div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaUserAlt className="text-purple-400" />
          </div>
          <motion.input
            type="text"
            placeholder="Enter your username"
            className="border border-purple-200 p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            whileFocus={{
              scale: 1.02,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
            }}
            animate={{
              borderColor: error ? "#EF4444" : "#DDD6FE",
            }}
          />
        </motion.div>
        <motion.button
          onClick={onSubmit}
          disabled={isLoading}
          className={`px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all duration-300 flex items-center justify-center ${
            isLoading
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
          }`}
          whileHover={!isLoading ? { scale: 1.03 } : undefined}
          whileTap={!isLoading ? { scale: 0.97 } : undefined}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" color="white" />
              <span className="ml-2">Creating...</span>
            </div>
          ) : (
            <>
              <FaShare className="mr-2" />
              Create Challenge
            </>
          )}
        </motion.button>
      </div>
    </>
  );
}
