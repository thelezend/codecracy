"use client";

import { AnimatedButton } from "@/components/ui/animated-button";
import { motion } from "framer-motion";
import { Construction } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-gray-50 dark:to-gray-900/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-2xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center"
        >
          <Construction className="w-12 h-12 text-primary" />
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
          Documentation Coming Soon
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          We&apos;re working hard to bring you comprehensive documentation for
          Codecracy. Stay tuned!
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/">
            <AnimatedButton size="lg" className="mt-8">
              Return Home
            </AnimatedButton>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
