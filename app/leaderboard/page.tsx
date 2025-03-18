import React from "react";
import {
  fetchLeaderBoarddata,
  leaderboardResponse,
} from "../lib/services/leaderBoardService";
import LeaderboardView from "../(main)/components/leaderboard";

// Server Component
export default async function Leaderboard() {
  try {
    const data: leaderboardResponse = await fetchLeaderBoarddata();
    return (
      <div className="container h-screen mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
        <div className="space-y-2">
          {data.users?.map((user, index) => (
            <LeaderboardView
              key={user.username}
              username={user.username}
              score={user.score}
              rank={index + 1}
            />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading leaderboard:", error);
    return <div>Failed to load leaderboard. Please try again later.</div>;
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
