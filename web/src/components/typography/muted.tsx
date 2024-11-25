import { cn } from "@/lib/utils";
import React from "react";

interface TypographyMutedProps {
  children: React.ReactNode;
  className?: string;
}

export function TypographyMuted({ children, className }: TypographyMutedProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  );
}
