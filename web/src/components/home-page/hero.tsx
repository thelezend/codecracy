"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Coins, Users, Blocks } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative isolate pt-14 dark:bg-gray-900">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              className="flex items-center justify-center gap-4 mb-8"
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div
                initial={{ rotate: -180 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Blocks className="w-16 h-16 text-primary" />
              </motion.div>
              <h2 className="text-7xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient select-none drop-shadow-lg">
                Codecracy
              </h2>
            </motion.div>

            <motion.div className="space-y-8">
              <motion.h1
                className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground/90 select-none"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Incentivize Code Contributions with Blockchain
              </motion.h1>
              <motion.p
                className="text-xl font-medium text-primary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Empower developers, reward impact, build better software
              </motion.p>
              <motion.div className="space-y-4">
                <motion.p
                  className="text-lg leading-8 text-gray-600 dark:text-gray-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  A decentralized protocol that enables teams to track, vote on,
                  and reward code contributions using Solana blockchain.
                </motion.p>
              </motion.div>
            </motion.div>
            <motion.div
              className="mt-10 flex items-center justify-center gap-x-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link href="/dashboard">
                <Button size="lg" className="group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-16 flow-root sm:mt-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <div className="rounded-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 ring-1 ring-gray-900/10">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <motion.div
                    className="flex flex-col items-center text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="rounded-lg bg-purple-100 dark:bg-purple-900/20 p-3">
                      <Code2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">
                      Track Contributions
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Transparently track and manage code contributions across
                      your team
                    </p>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="rounded-lg bg-pink-100 dark:bg-pink-900/20 p-3">
                      <Users className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">
                      Vote on Impact
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Team members vote on contribution impact using a fair
                      scoring system
                    </p>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900/20 p-3">
                      <Coins className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Earn Rewards</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Get rewarded for your contributions through Solana
                      blockchain
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}
