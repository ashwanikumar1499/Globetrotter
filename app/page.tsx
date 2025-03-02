"use client";

import { motion } from "framer-motion";
import {
  FaGlobeAmericas,
  FaMapMarkedAlt,
  FaCompass,
  FaPlane,
  FaLandmark,
  FaMountain,
  FaHeart,
} from "react-icons/fa";
import ChallengeButton from "./(main)/components/ChallengeButton";
import GameBoard from "./(main)/components/GameBoard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative w-24 h-24 mb-2"
            >
              <FaGlobeAmericas className="absolute inset-0 w-full h-full text-blue-600 opacity-90" />
              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <FaCompass className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-4">
            Globetrotter Challenge
          </h1>
          <p className="text-xl text-indigo-600 max-w-2xl mx-auto">
            Test your geography knowledge with cryptic clues about famous
            destinations around the world!
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mt-6"
          >
            <FeatureBadge icon={<FaMapMarkedAlt />} text="100+ Destinations" />
            <FeatureBadge icon={<FaLandmark />} text="Famous Landmarks" />
            <FeatureBadge icon={<FaMountain />} text="Challenging Clues" />
            <FeatureBadge icon={<FaPlane />} text="Global Adventure" />
          </motion.div>
        </motion.div>

        <GameBoard />
        <ChallengeButton />

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center text-gray-500 text-sm"
        >
          <p className="flex items-center justify-center">
            © {new Date().getFullYear()} Globetrotter Challenge. All rights
            reserved.
          </p>
          <p className="mt-2 flex items-center justify-center">
            Made with <FaHeart className="text-red-400 mx-1" /> for explorers
            around the world
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}

function FeatureBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-blue-100 flex items-center text-blue-700"
    >
      <span className="mr-2 text-blue-500">{icon}</span>
      {text}
    </motion.div>
  );
}
