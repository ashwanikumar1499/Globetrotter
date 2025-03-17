"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { ShareCard } from "./ShareCard";
import { ShareOptions } from "./ShareOptions";
import LoadingSpinner from "../LoadingSpinner";

interface ShareModalProps {
  show: boolean;
  onClose: () => void;
  shareData: {
    shareUrl: string;
    code: string;
    username: string;
    score: number;
  } | null;
}

export function ShareModal({ show, onClose, shareData }: ShareModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const shareCardRef = useRef<HTMLDivElement>(null);

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
    if (show && shareData && shareCardRef.current) {
      generateShareImage();
    }
  }, [show, shareData, generateShareImage]);

  if (!show || !shareData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
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
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={20} />
            </motion.button>
          </div>

          {/* Share Card for image generation */}
          <ShareCard
            ref={shareCardRef}
            username={shareData.username}
            score={shareData.score}
            code={shareData.code}
          />

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

          {/* Share Options */}
          <ShareOptions shareUrl={shareData.shareUrl} score={shareData.score} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
