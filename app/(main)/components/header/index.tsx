"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaTrophy, FaUserPlus } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/app/lib/store/userStore";

export default function Header() {
  const pathname = usePathname();
  const isLeaderboardPage = pathname === "/leaderboard";
  const { isRegistered } = useUserStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 1,
              }}
            >
              🌍
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
              GlobeTrotter
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {!isRegistered && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  window.dispatchEvent(new Event("open-register-modal"))
                }
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <FaUserPlus />
                Register
              </motion.button>
            )}

            {!isLeaderboardPage && (
              <Link href="/leaderboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <FaTrophy className="text-yellow-300" />
                  View Leaderboard
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
