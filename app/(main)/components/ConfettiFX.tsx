"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ConfettiFX() {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      color: string;
      rotation: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    const colors = [
      "#FCD34D", // yellow
      "#34D399", // green
      "#60A5FA", // blue
      "#F87171", // red
      "#A78BFA", // purple
      "#FBBF24", // amber
      "#EC4899", // pink
      "#6EE7B7", // emerald
    ];

    const particleCount = 100;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100, // random position across screen width (%)
        y: -20 - Math.random() * 10, // start above the viewport
        size: 5 + Math.random() * 15, // random size between 5-20px
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360, // random initial rotation
        delay: Math.random() * 0.5, // random delay for staggered animation
      });
    }

    setParticles(newParticles);
  }, []);

  return (
    <div className="confetti-container absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            rotate: particle.rotation,
            opacity: 1,
          }}
          animate={{
            y: ["0%", "100%"],
            x: [`${particle.x}%`, `${particle.x + (Math.random() * 20 - 10)}%`],
            rotate: [
              particle.rotation,
              particle.rotation + 360 * (Math.random() > 0.5 ? 1 : -1),
            ],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            ease: "easeOut",
            delay: particle.delay,
          }}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius:
              Math.random() > 0.3 ? "50%" : Math.random() > 0.5 ? "0%" : "20%",
            boxShadow: `0 0 ${particle.size / 2}px ${particle.color}80`,
          }}
        />
      ))}
    </div>
  );
} 