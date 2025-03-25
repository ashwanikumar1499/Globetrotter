"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeaderboardView from "./index";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginatedLeaderboardProps {
  users: Array<{ username: string; score: number }>;
  itemsPerPage?: number;
  currentUserName?: string;
}

export default function PaginatedLeaderboard({
  users,
  itemsPerPage = 10,
  currentUserName,
}: PaginatedLeaderboardProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        <motion.div className="space-y-3">
          {paginatedUsers.map((user, index) => (
            <LeaderboardView
              key={user.username}
              username={user.username}
              score={user.score.toString()}
              rank={(currentPage - 1) * itemsPerPage + index + 1}
              currentUser={user.username === currentUserName}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-8 select-none">
          <div className="flex items-center gap-2 bg-white rounded-full shadow-md p-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full disabled:opacity-50 hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <FaChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                const isCurrentPage = currentPage === pageNum;
                const isNearCurrent = Math.abs(currentPage - pageNum) <= 1;
                const isEndPage = pageNum === 1 || pageNum === totalPages;

                if (isNearCurrent || isEndPage) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 ${
                        isCurrentPage
                          ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (i === 1 && currentPage > 3) ||
                  (i === totalPages - 2 && currentPage < totalPages - 2)
                ) {
                  return (
                    <span
                      key={`ellipsis-${i}`}
                      className="w-8 text-center text-gray-400"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full disabled:opacity-50 hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <FaChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
