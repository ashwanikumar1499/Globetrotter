"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaCopy } from "react-icons/fa";

interface ShareOptionsProps {
  shareUrl: string;
  score: number;
}

export function ShareOptions({ shareUrl, score }: ShareOptionsProps) {
  const [copySuccess, setCopySuccess] = useState(false);

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
          `https://wa.me/?text=${encodeURIComponent(
            `I've scored ${score} points in Globetrotter Challenge! Can you beat my score? Try here: ${shareUrl}`
          )}`,
          "_blank"
        ),
    },
  ];

  return (
    <>
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
        <p className="text-gray-600 mb-2 text-sm font-medium">Or copy link:</p>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 p-3 bg-gray-50 text-gray-700 focus:outline-none text-sm"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => copyToClipboard(shareUrl)}
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
    </>
  );
}
