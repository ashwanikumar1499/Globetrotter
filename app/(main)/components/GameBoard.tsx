"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ConfettiFX from "./ConfettiFX";
import LoadingSpinner from "./LoadingSpinner";
import { GameQuestion, GameResponse } from "@/app/lib/types/game";
import {
  FaGlobeAmericas,
  FaLightbulb,
  FaQuestionCircle,
  FaUserAlt,
} from "react-icons/fa";
import { useUserStore } from "@/app/lib/store/userStore";

interface GameBoardProps {
  challengeMode?: boolean;
  targetScore?: number;
  username?: string;
  onScoreUpdate?: (score: number) => void;
}

export default function GameBoard({
  challengeMode = false,
  targetScore = 0,
  username = "",
  onScoreUpdate,
}: GameBoardProps) {
  const [gameData, setGameData] = useState<GameQuestion>();
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<GameResponse>();
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [visibleClues, setVisibleClues] = useState(1); // Start with only one clue visible
  const [hintUsed, setHintUsed] = useState(false);

  // Get user state from the store
  const {
    score: userScore,
    isRegistered,
    updateScore,
    checkUser,
  } = useUserStore();

  const fetchQuestion = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/game");
      setGameData(await res.json());
      // Reset to show only the first clue for each new question
      setVisibleClues(1);
      setHintUsed(false);
    } catch (error) {
      console.error("Failed to fetch question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuess = async (selectedCity: string) => {
    if (!gameData) return;

    setSelectedOption(selectedCity);

    const res = await fetch("/api/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city: selectedCity,
        country: gameData.correctCountry,
      }),
    });

    const result = await res.json();
    setFeedback(result);

    if (result.correct) {
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);

      // Update the user's score in the store if username is provided
      if (username) {
        updateScore(newScore);
      }

      // Notify parent component about score update
      if (onScoreUpdate) {
        onScoreUpdate(newScore);
      }

      if (challengeMode && newScore >= targetScore) {
        setChallengeCompleted(true);
      }
    } else {
      // Reset streak on wrong answer
      setStreak(0);
    }

    setTimeout(() => {
      setFeedback(undefined);
      setSelectedOption(null);
      if (!challengeCompleted) fetchQuestion();
    }, 3000);
  };

  // Function to reveal the next clue
  const revealNextClue = () => {
    if (gameData && visibleClues < gameData.clues.length) {
      setVisibleClues((prev) => prev + 1);
      if (!hintUsed) setHintUsed(true);
    }
  };

  // Function to reveal all clues at once
  const revealAllClues = () => {
    if (gameData) {
      setVisibleClues(gameData.clues.length);
      if (!hintUsed) setHintUsed(true);
    }
  };

  useEffect(() => {
    if (!challengeCompleted) {
      fetchQuestion();
    }
  }, [challengeCompleted]);

  // Check if the user exists and get their current score when the component mounts
  useEffect(() => {
    if (username && username.length >= 3) {
      checkUser(username);

      // If the user has a higher score than our current score, update it
      if (userScore > score) {
        setScore(userScore);

        // Notify parent component about initial score
        if (onScoreUpdate) {
          onScoreUpdate(userScore);
        }
      }
    }
  }, [username, checkUser, userScore, score, onScoreUpdate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" },
    tap: { scale: 0.95 },
    correct: {
      scale: [1, 1.2, 1],
      backgroundColor: "#10B981",
      color: "white",
      transition: { duration: 0.5 },
    },
    incorrect: {
      scale: [1, 0.9, 1],
      backgroundColor: "#EF4444",
      color: "white",
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="game-board max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      {username && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
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
      )}

      {challengeMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="challenge-header mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl"
        >
          <h2 className="text-xl font-semibold text-indigo-700 flex items-center">
            <FaGlobeAmericas className="mr-2" />
            Challenge Mode: {score}/{targetScore}
          </h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <motion.div
              className="bg-indigo-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, (score / targetScore) * 100)}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`feedback p-6 rounded-xl mb-8 ${
              feedback.correct
                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                : "bg-gradient-to-r from-red-400 to-rose-500 text-white"
            }`}
          >
            {feedback.correct && <ConfettiFX />}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h3 className="text-xl font-bold mb-2">
                {feedback.correct ? "🎉 Correct!" : "😢 Not quite right..."}
              </h3>
              <p className="text-lg mb-2">{feedback.fact}</p>
              {feedback.correct && streak > 1 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-2 inline-block px-4 py-1 bg-white/20 rounded-full text-white font-bold"
                >
                  🔥 {streak} in a row!
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {challengeCompleted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="challenge-completed text-center py-10"
        >
          <ConfettiFX />
          <motion.h3
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-6"
          >
            🏆 Challenge Completed!
          </motion.h3>
          <motion.p className="text-lg text-gray-600 mb-8">
            Congratulations! You've beaten the challenge with a score of {score}
            .
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setChallengeCompleted(false);
              setScore(0);
              setStreak(0);
              fetchQuestion();
            }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300"
          >
            Play Again
          </motion.button>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="loading-container flex flex-col items-center justify-center py-16"
            >
              <LoadingSpinner
                size="lg"
                color="primary"
                text="Loading next destination..."
              />
            </motion.div>
          ) : (
            <motion.div
              key="game-content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex justify-between items-center mb-4">
                <motion.h3
                  variants={itemVariants}
                  className="text-xl font-semibold text-indigo-700 flex items-center"
                >
                  <FaGlobeAmericas className="mr-2" />
                  Guess the Destination
                </motion.h3>

                <motion.div variants={itemVariants} className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={revealNextClue}
                    disabled={gameData && visibleClues >= gameData.clues.length}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      gameData && visibleClues >= gameData.clues.length
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                    }`}
                  >
                    <FaLightbulb className="text-amber-500" />
                    Next Clue
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={revealAllClues}
                    disabled={gameData && visibleClues >= gameData.clues.length}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      gameData && visibleClues >= gameData.clues.length
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    <FaQuestionCircle className="text-blue-500" />
                    Show All Clues
                  </motion.button>
                </motion.div>
              </div>

              <motion.div
                variants={itemVariants}
                className="clues-container space-y-4 mb-8"
              >
                {gameData?.clues.slice(0, visibleClues).map((clue, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="clue-card bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm border border-blue-100"
                  >
                    <span className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-8 h-8 rounded-full text-center leading-8 mr-3 shadow-sm">
                      {index + 1}
                    </span>
                    <span className="text-gray-800">{clue}</span>
                  </motion.div>
                ))}

                {gameData && visibleClues < gameData.clues.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-2"
                  >
                    <motion.p
                      className="text-indigo-500 text-sm"
                      animate={{
                        y: [0, 5, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                      }}
                    >
                      Need more clues? Use the buttons above
                    </motion.p>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="options-grid grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
              >
                {gameData?.options.map((city) => (
                  <motion.button
                    key={city}
                    onClick={() => !feedback && handleGuess(city)}
                    disabled={!!feedback}
                    variants={buttonVariants}
                    initial="idle"
                    whileHover={!feedback ? "hover" : undefined}
                    whileTap={!feedback ? "tap" : undefined}
                    animate={
                      feedback
                        ? selectedOption === city
                          ? feedback.correct
                            ? "correct"
                            : "incorrect"
                          : "idle"
                        : "idle"
                    }
                    className={`option-button py-4 px-6 rounded-xl text-lg font-medium transition-all duration-300 ${
                      feedback
                        ? "cursor-default"
                        : "bg-white border-2 border-gray-200 hover:border-indigo-300 text-gray-800 shadow-sm hover:shadow"
                    }`}
                  >
                    {city}
                  </motion.button>
                ))}
              </motion.div>

              <div className="flex justify-between items-center">
                <motion.div
                  variants={itemVariants}
                  className="score-display py-3 px-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full font-bold text-gray-700 inline-block shadow-sm"
                >
                  <motion.span
                    key={score}
                    initial={{ scale: 1.5, color: "#4F46E5" }}
                    animate={{ scale: 1, color: "#374151" }}
                    transition={{ duration: 0.5 }}
                  >
                    Score: {score}
                  </motion.span>
                  {challengeMode && ` / ${targetScore}`}
                </motion.div>

                {streak > 1 && !feedback && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="streak-display py-2 px-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full font-bold text-white inline-flex items-center shadow-sm"
                  >
                    <span className="mr-1">🔥</span> {streak} streak
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
