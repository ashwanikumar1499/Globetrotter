"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import Image from "next/image";
import LoadingSpinner from "./LoadingSpinner";
import {
  FaGlobeAmericas,
  FaWhatsapp,
  FaCopy,
  FaTimes,
  FaShare,
  FaUserAlt,
  FaTrophy,
} from "react-icons/fa";
import { useUserStore } from "@/app/lib/store/userStore";

export default function ChallengeButton() {
  const [username, setUsername] = useState("");
  const [shareData, setShareData] = useState<{
    shareUrl: string;
    code: string;
    username: string;
    score: number;
  } | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const shareCardRef = useRef<HTMLDivElement>(null);

  // Get user state from the store
  const {
    username: storedUsername,
    score: userScore,
    isRegistered,
    setUsername: setUserStoreUsername,
  } = useUserStore();

  // Use stored username if available
  useEffect(() => {
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [storedUsername]);

  const handleCreateChallenge = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Please enter a username first");
      return;
    }

    if (trimmedUsername.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Set the username in the user store
      setUserStoreUsername(trimmedUsername);

      // First check if the user exists and get their current score
      const checkUserResponse = await fetch(
        `/api/users?username=${encodeURIComponent(trimmedUsername)}`
      );
      const checkUserData = await checkUserResponse.json();

      // Use the existing score if the user exists, otherwise use 0
      const currentScore = checkUserData.exists
        ? checkUserData.score
        : userScore || 0;

      // Create or update the user in the database
      const userResponse = await fetch("/api/users", {
        method: "PUT", // PUT will create or update the user
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: trimmedUsername,
          score: currentScore, // Use the current score from the API or store
        }),
      });

      let userData;
      try {
        userData = await userResponse.json();
      } catch (e) {
        console.error("Failed to parse user response:", e);
        throw new Error("Invalid response from server");
      }

      if (!userResponse.ok) {
        throw new Error(userData.error || "Failed to register user");
      }

      console.log("User data updated successfully:", userData);

      // Create the challenge with the user's current score
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: trimmedUsername,
          score: userData.score, // Use the score from the API response
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        console.error("Failed to parse challenge response:", e);
        throw new Error("Invalid response from server");
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to create challenge");
      }

      // Create the share URL
      const shareUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/challenge/${data.code}`
          : "";

      setShareData({
        shareUrl,
        code: data.code,
        username: data.username,
        score: data.score,
      });
      setShowModal(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create challenge. Please try again."
      );
      console.error("Challenge creation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Use useCallback for generateShareImage
  const generateShareImage = useCallback(async () => {
    if (!shareCardRef.current || !shareData) return;

    try {
      setIsGeneratingImage(true);

      // Wait a bit for the DOM to be fully rendered
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2, // Higher resolution
        backgroundColor: null,
        logging: false,
        useCORS: true,
      });

      const dataUrl = canvas.toDataURL("image/png");
      setImageUrl(dataUrl);
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setIsGeneratingImage(false);
    }
  }, [shareData]);

  // Generate share image when modal is shown
  useEffect(() => {
    if (showModal && shareData && shareCardRef.current) {
      generateShareImage();
    }
  }, [showModal, shareData, generateShareImage]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <FaWhatsapp size={18} />,
      color: "from-green-500 to-green-600",
      hoverColor: "from-green-600 to-green-700",
      action: () =>
        window.open(
          `https://wa.me/?text=I've scored ${shareData?.score} points in Globetrotter Challenge! Can you beat my score? Try here: ${shareData?.shareUrl}`,
          "_blank"
        ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="challenge-section mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl shadow-lg border border-purple-100"
    >
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4 flex items-center">
        <FaGlobeAmericas className="mr-2 text-purple-600" />
        Challenge a Friend
      </h2>
      <p className="text-purple-600 mb-6">
        Create a challenge and share it with your friends to see if they can
        beat your score!
      </p>

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
          onClick={handleCreateChallenge}
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

      {/* User score display */}
      {username.trim().length >= 3 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 flex items-center"
        >
          {isLoading ? (
            <div className="flex items-center text-indigo-600 text-sm">
              <LoadingSpinner size="sm" color="primary" />
              <span className="ml-2">Checking user...</span>
            </div>
          ) : isRegistered ? (
            <div className="flex items-center text-indigo-600">
              <FaTrophy className="text-amber-500 mr-2" />
              <span>
                Your current score:{" "}
                <span className="font-bold">{userScore}</span>
              </span>
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Registered
              </span>
            </div>
          ) : (
            <div className="text-indigo-600 text-sm">
              <span>New user - your score will start at 0</span>
            </div>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-500 mb-4"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  Your Challenge is Ready!
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </motion.button>
              </div>

              {/* Share Card (for image generation) */}
              <div
                ref={shareCardRef}
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
                      <h3 className="text-xl font-bold">
                        Globetrotter Challenge
                      </h3>
                    </div>
                    <p className="text-white/80 text-sm mb-4">
                      {shareData?.username} has challenged you!
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    {shareData && (
                      <div className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                        Challenge #{shareData.code.slice(-4)}
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-xs text-white/70">Current Score</p>
                      <p className="text-2xl font-bold">{shareData?.score}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generated Image Preview */}
              {isGeneratingImage ? (
                <div className="flex justify-center items-center py-8">
                  <LoadingSpinner
                    size="md"
                    color="primary"
                    text="Generating share image..."
                  />
                </div>
              ) : imageUrl ? (
                <div className="mb-6">
                  <p className="text-gray-600 mb-2 text-sm">Preview:</p>
                  <div className="relative overflow-hidden rounded-lg shadow-md">
                    <div
                      className="relative w-full h-auto"
                      style={{ aspectRatio: "16/9" }}
                    >
                      <Image
                        src={imageUrl}
                        alt="Challenge preview"
                        fill
                        style={{ objectFit: "contain" }}
                        sizes="(max-width: 768px) 100vw, 500px"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mb-4">
                <p className="text-gray-600 mb-2 text-sm font-medium">
                  Share via WhatsApp:
                </p>
                <div className="flex flex-wrap gap-2">
                  {shareOptions.map((option) => (
                    <motion.button
                      key={option.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={option.action}
                      className={`bg-gradient-to-r ${option.color} hover:${option.hoverColor} text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all duration-300 w-full`}
                    >
                      {option.icon}
                      {option.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <p className="text-gray-600 mb-2 text-sm font-medium">
                  Or copy link:
                </p>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <input
                    type="text"
                    value={shareData?.shareUrl || ""}
                    readOnly
                    className="flex-1 p-3 bg-gray-50 text-gray-700 focus:outline-none text-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      shareData && copyToClipboard(shareData.shareUrl)
                    }
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-6 shadow-md transition-all duration-300 flex items-center"
                  >
                    <FaCopy className="mr-2" />
                    {copySuccess ? "Copied!" : "Copy"}
                  </motion.button>
                </div>
                <AnimatePresence>
                  {copySuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-8 right-0 bg-green-500 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Copied to clipboard!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
