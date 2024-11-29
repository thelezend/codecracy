"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ComponentPropsWithoutRef, forwardRef } from "react";

interface AnimatedButtonProps extends ButtonProps {
  shouldBounce?: boolean;
  children: React.ReactNode;
  bounceConfig?: {
    scale?: number[];
    duration?: number;
  };
}

const AnimatedButton = forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps & ComponentPropsWithoutRef<typeof Button>
>(
  (
    {
      shouldBounce = false,
      children,
      bounceConfig = {
        scale: [1, 1.05, 1],
        duration: 1.5,
      },
      ...buttonProps
    },
    ref
  ) => {
    return (
      <motion.div
        animate={
          shouldBounce
            ? {
                scale: bounceConfig.scale,
                transition: {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: bounceConfig.duration,
                },
              }
            : {}
        }
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button ref={ref} {...buttonProps}>
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
export type { AnimatedButtonProps };
