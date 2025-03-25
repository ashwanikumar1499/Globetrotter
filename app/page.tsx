"use client";

import { motion } from "framer-motion";
import { HeroSection } from "./(main)/components/hero-section";
import GameBoard from "./(main)/components/GameBoard";
import ChallengeButton from "./(main)/components/ChallengeButton";
import { Footer } from "./(main)/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto pt-4"
      >
        <HeroSection />
        <GameBoard />
        <ChallengeButton />
        <Footer />
      </motion.div>
    </div>
  );
}
