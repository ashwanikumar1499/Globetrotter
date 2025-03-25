"use client";

import { motion } from "framer-motion";
import { GlobeAnimation } from "../globe-animation";
import { FeaturesSection } from "../features-section";

export function HeroSection() {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
      className="text-center mb-12"
    >
      <GlobeAnimation />

      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-4">
        Globetrotter Challenge
      </h1>
      <p className="text-xl text-indigo-600 max-w-2xl mx-auto">
        Test your geography knowledge with cryptic clues about famous
        destinations around the world!
      </p>

      <FeaturesSection />
    </motion.div>
  );
}
