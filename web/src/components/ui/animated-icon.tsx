"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnimatedIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  containerClassName?: string;
  rotationDegree?: number;
  scaleAmount?: number;
  stiffness?: number;
  damping?: number;
}

export function AnimatedIcon({
  icon: Icon,
  size = 24,
  className,
  containerClassName,
  rotationDegree = 5,
  scaleAmount = 1.2,
  stiffness = 400,
  damping = 10,
}: AnimatedIconProps) {
  return (
    <div
      className={cn(
        "w-12 h-12 rounded-lg bg-white backdrop-blur-lg flex items-center justify-center",
        containerClassName
      )}
    >
      <motion.div
        className="w-full h-full flex items-center justify-center"
        whileHover={{
          scale: scaleAmount,
          rotate: rotationDegree,
        }}
        transition={{
          type: "spring",
          stiffness,
          damping,
        }}
      >
        <Icon
          className={cn(`h-${size / 4} w-${size / 4} text-black`, className)}
        />
      </motion.div>
    </div>
  );
}
