"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGlobeAmericas, FaUserAlt } from "react-icons/fa";

import LoadingSpinner from "./LoadingSpinner";
import { CluesDisplay } from "./game/CluesDisplay";
import { OptionsGrid } from "./game/OptionsGrid";
import { FeedbackDisplay } from "./game/FeedbackDisplay";
import { ChallengeComplete } from "./game/ChallengeComplete";
import { ScoreDisplay } from "./game/ScoreDisplay";
import { UserInfoBadge } from "./ui/UserInfoBadge";
import { ChallengeHeader } from "./game/ChallengeHeader";
import { ErrorMessage } from "./ui/ErrorMessage";
import { GameQuestion, GameResponse } from "@/app/lib/types/game";
import { fetchGameQuestion, submitGuess } from "@/app/lib/services/gameService";
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
  // User state from store
  const {
    score: userScore,
    setScore: setUserScore,
    isRegistered,
    updateScore,
    checkUser,
  } = useUserStore();

  // Game data state
  const [gameData, setGameData] = useState<GameQuestion>();
  const [feedback, setFeedback] = useState<GameResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clues state
  const [visibleClues, setVisibleClues] = useState(1);
  const [hintUsed, setHintUsed] = useState(false);

  // Score state
  const [score, setScore] = useState(userScore > 0 ? userScore : 0);
  const [streak, setStreak] = useState(0);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  // Function to fetch a new question
  const fetchQuestion = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchGameQuestion();
      setGameData(data);

      // Reset clue state for new question
      setVisibleClues(1);
      setHintUsed(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load question");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to handle user guesses
  const handleGuess = useCallback(
    async (selectedCity: string) => {
      if (!gameData) return;

      setSelectedOption(selectedCity);

      try {
        const result = await submitGuess(selectedCity, gameData.correctCountry);
        setFeedback(result);

        if (result.correct) {
          // Update score and streak
          const newScore = score + 1;
          const newStreak = streak + 1;

          setScore(newScore);
          setStreak(newStreak);
          setUserScore(newScore);

          if (username) {
            updateScore(newScore);
          }

          if (onScoreUpdate) {
            onScoreUpdate(newScore);
          }

          // Check if challenge is completed
          if (challengeMode && newScore >= targetScore) {
            setChallengeCompleted(true);
          }
        } else {
          // Reset streak on wrong answer
          setStreak(0);
        }

        // Move to next question after delay
        setTimeout(() => {
          setFeedback(undefined);
          setSelectedOption(null);
          if (!challengeCompleted) fetchQuestion();
        }, 5000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit guess");
      }
    },
    [
      gameData,
      score,
      streak,
      setUserScore,
      username,
      updateScore,
      onScoreUpdate,
      challengeMode,
      targetScore,
      challengeCompleted,
      fetchQuestion,
    ]
  );

  // Function to reveal next clue
  const revealNextClue = useCallback(() => {
    if (gameData && visibleClues < gameData.clues.length) {
      setVisibleClues((prev) => prev + 1);
      if (!hintUsed) setHintUsed(true);
    }
  }, [gameData, visibleClues, hintUsed]);

  // Function to reveal all clues
  const revealAllClues = useCallback(() => {
    if (gameData) {
      setVisibleClues(gameData.clues.length);
      if (!hintUsed) setHintUsed(true);
    }
  }, [gameData, hintUsed]);

  // Function to reset/restart the game
  const resetGame = useCallback(() => {
    setChallengeCompleted(false);
    setScore(0);
    setStreak(0);
    fetchQuestion();
  }, [fetchQuestion]);

  // Load initial question
  useEffect(() => {
    if (!challengeCompleted) {
      fetchQuestion();
    }
  }, [challengeCompleted, fetchQuestion]);

  // Check user data
  useEffect(() => {
    if (username && username.length >= 3) {
      checkUser(username);

      // Update score if user has a higher score
      if (userScore > score) {
        setScore(userScore);

        if (onScoreUpdate) {
          onScoreUpdate(userScore);
        }
      }
    }
  }, [username, checkUser, userScore, score, onScoreUpdate]);

  // Animation variants
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

  return (
    <div className="game-board max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <UserInfoBadge username={username} isRegistered={isRegistered} />

      {challengeMode && (
        <ChallengeHeader score={score} targetScore={targetScore} />
      )}

      <FeedbackDisplay feedback={feedback} streak={streak} />

      {error && <ErrorMessage message={error} onRetry={resetGame} />}

      {challengeCompleted ? (
        <ChallengeComplete score={score} onPlayAgain={resetGame} />
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
              {gameData && (
                <>
                  <CluesDisplay
                    clues={gameData.clues}
                    visibleClues={visibleClues}
                    onRevealNextClue={revealNextClue}
                    onRevealAllClues={revealAllClues}
                  />

                  <OptionsGrid
                    options={gameData.options}
                    onGuess={handleGuess}
                    feedback={feedback}
                    selectedOption={selectedOption}
                  />
                </>
              )}

              <ScoreDisplay
                score={score}
                targetScore={targetScore}
                streak={streak}
                showFeedback={!!feedback}
                challengeMode={challengeMode}
                hintUsed={hintUsed}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
