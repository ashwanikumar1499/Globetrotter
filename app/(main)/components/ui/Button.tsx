"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  fullWidth = false,
}: ButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-indigo-600 hover:bg-indigo-700 text-white";
      case "secondary":
        return "bg-gray-200 hover:bg-gray-300 text-gray-800";
      case "success":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "danger":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "warning":
        return "bg-amber-100 text-amber-700 hover:bg-amber-200";
      case "info":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      default:
        return "bg-indigo-600 hover:bg-indigo-700 text-white";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "py-1.5 px-3 text-sm";
      case "md":
        return "py-2 px-4";
      case "lg":
        return "py-3 px-6 text-lg";
      default:
        return "py-2 px-4";
    }
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? "w-full" : ""}
        font-medium rounded-lg transition-all duration-300
        flex items-center justify-center gap-2
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
}
