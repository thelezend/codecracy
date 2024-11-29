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
  Shield,
  Sparkles,
  Users2,
  Vote,
  Wallet,
} from "lucide-react";
import { AnimatedButton } from "../ui/animated-button";

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const features = [
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
      "Fair and transparent voting system for contribution assessment",
    icon: Vote,
  },
  {
    title: "Claimable Rewards",
    description:
      "Claim your rewards based on contribution scores after project completion",
    icon: Wallet,
  },
  {
    title: "Secure Protocol",
    description: "Built on Solana for maximum security and efficiency",
    icon: Shield,
  },
  {
    title: "Team Management",
    description: "Efficient member management with Address Lookup Tables",
    icon: Users2,
  },
  {
    title: "Impact Scoring",
    description: "Advanced algorithms to measure contribution impact",
    icon: Sparkles,
  },
];

export function Features() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50 min-h-screen">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Powerful Features for Modern Teams
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl">
            Everything you need to manage and reward code contributions
            effectively
          </p>
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
              <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4"
                  >
                    <feature.icon className="h-6 w-6 text-primary" />
                  </motion.div>
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
    </section>
  );
}
