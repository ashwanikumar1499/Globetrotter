import React from "react";
import {
  fetchLeaderBoarddata,
  leaderboardResponse,
} from "../lib/services/leaderBoardService";
import PaginatedLeaderboard from "../(main)/components/leaderboard/PaginatedLeaderboard";
import { FaTrophy, FaGamepad } from "react-icons/fa";
import Link from "next/link";

// Server Component
export default async function Leaderboard() {
  try {
    const data: leaderboardResponse = await fetchLeaderBoarddata();

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-2">
              <FaTrophy className="text-yellow-400" />
              Leaderboard
            </h1>
            <p className="text-gray-600 mb-4">Top players worldwide</p>
            <Link href="/" className="inline-block">
              <button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
                <FaGamepad className="text-xl" />
                Play Game & Make Your High Score
              </button>
            </Link>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/60">
            <PaginatedLeaderboard
              users={
                data.users?.map((user) => ({
                  ...user,
                  score: parseInt(user.score),
                })) || []
              }
              itemsPerPage={10}
            />
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error("Failed to load leaderboard:", err);
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-lg">
            <p className="text-red-600 font-medium">
              Failed to load leaderboard. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

// Client or Presentational Component (renamed with uppercase)
// function LeaderboardView({ users, pagination }: leaderboardResponse) {
//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
//       <div className="space-y-2">
//         {users.map((user) => (
//           <div
//             key={user.username}
//             className="p-2 border rounded flex justify-between"
//           >
//             <span>{user.username}</span>
//             <span className="font-semibold">{user.score}</span>
//           </div>
//         ))}
//       </div>
//       {/* You can also render pagination data if needed */}
//     </div>
//   );
// }
