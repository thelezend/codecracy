"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import {
  GitPullRequest,
  Info,
  Sparkles,
  Users2,
  Vote,
  Wallet,
} from "lucide-react";
import { AnimatedButton } from "../ui/animated-button";
import { AnimatedIcon } from "../ui/animated-icon";
import { LampContainer } from "../ui/lamp";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.9, x: -20 },
  show: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const features = [
  {
    title: "Team Management",
    description: "Efficient member management with Address Lookup Tables",
    icon: Users2,
  },
  {
    title: "Optional Fund Locking",
    description:
      "Lock funds in a secure vault to create incentives for your team (completely optional)",
    icon: Wallet,
  },
  {
    title: (
      <div className="flex items-center gap-2">
        Pull Request Tracking
        <Tooltip>
          <TooltipTrigger asChild>
            <AnimatedButton
              variant="ghost"
              size="icon"
              className="h-4 w-4 text-muted-foreground"
            >
              <Info />
            </AnimatedButton>
          </TooltipTrigger>
          <TooltipContent className="text-center">
            <p>GitHub integration coming soon.</p>
            <p>Currently requires manual PR ID input.</p>
          </TooltipContent>
        </Tooltip>
      </div>
    ),
    description:
      "Track and manage code contributions through pull requests with ease",
    icon: GitPullRequest,
  },
  {
    title: "Democratic Voting",
    description:
      "Team members vote on contributions to determine individual impact scores",
    icon: Vote,
  },
  {
    title: "Impact Scoring",
    description:
      "Calculate contribution impact scores based on votes from other team members",
    icon: Sparkles,
  },
  {
    title: "Claimable Rewards",
    description:
      "After project closure, each member can claim their share of locked funds based on their impact score",
    icon: Wallet,
  },
];

export function Features() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900/30 min-h-screen relative overflow-hidden">
      <LampContainer>
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            >
              Powerful Features for Modern Teams
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl"
            >
              Everything you need to manage and reward code contributions
              effectively
            </motion.p>
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={item}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:rotate-1 h-full rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50 border-opacity-50">
                  <CardHeader>
                    <AnimatedIcon
                      icon={feature.icon}
                      containerClassName="mb-4"
                    />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Add more content or links here if needed */}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </LampContainer>
    </section>
  );
}
