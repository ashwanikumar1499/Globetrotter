"use client";

import { motion } from "framer-motion";
import {
  FaMapMarkedAlt,
  FaLandmark,
  FaMountain,
  FaPlane,
} from "react-icons/fa";
import { FeatureBadge } from "../feature-badge";

export function FeaturesSection() {
  return (
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
  );
}
