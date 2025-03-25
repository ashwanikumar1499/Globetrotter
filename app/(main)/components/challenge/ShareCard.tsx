"use client";

import { forwardRef } from "react";
import { FaGlobeAmericas } from "react-icons/fa";

interface ShareCardProps {
  username: string;
  score: number;
  code: string;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ username, score, code }, ref) => {
    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-lg mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white"
        style={{ width: "100%", height: "200px" }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute inset-0 bg-white opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 20 + 5}px`,
                  height: `${Math.random() * 20 + 5}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.1,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center mb-2">
              <FaGlobeAmericas className="mr-2" size={24} />
              <h3 className="text-xl font-bold">Globetrotter Challenge</h3>
            </div>
            <p className="text-white/80 text-sm mb-4">
              {username} has challenged you!
            </p>
          </div>

          <div className="flex justify-between items-end">
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              Challenge #{code.slice(-4)}
            </div>
            <div className="text-right">
              <p className="text-xs text-white/70">Current Score</p>
              <p className="text-2xl font-bold">{score}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ShareCard.displayName = "ShareCard";
