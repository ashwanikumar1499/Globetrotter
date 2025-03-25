"use client";

import { motion } from "framer-motion";
import { FaUserAlt } from "react-icons/fa";

interface UserInfoBadgeProps {
  username: string;
  isRegistered?: boolean;
}

export function UserInfoBadge({ username, isRegistered }: UserInfoBadgeProps) {
  if (!username) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="user-info mb-4 flex items-center"
    >
      <FaUserAlt className="text-indigo-500 mr-2" />
      <span className="font-medium text-indigo-700">
        Playing as: <span className="font-bold">{username}</span>
      </span>
      {isRegistered && (
        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
          Registered
        </span>
      )}
    </motion.div>
  );
}
