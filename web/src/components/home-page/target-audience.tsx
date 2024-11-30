"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Building2, Code2, Gamepad, Trophy, Users } from "lucide-react";
import { AnimatedIcon } from "../ui/animated-icon";
import { ShootingStars } from "../ui/shooting-stars";
import { StarsBackground } from "../ui/stars-background";

const audiences = [
  {
    title: "Development Teams",
    description:
      "Fairly distribute rewards based on code contributions in companies and startups.",
    icon: Building2,
  },
  {
    title: "Open Source Projects",
    description:
      "Incentivize and reward valuable contributions in your open source community.",
    icon: Code2,
  },
  {
    title: "DAOs & Web3 Projects",
    description:
      "Track and reward development work in decentralized teams with blockchain integration.",
    icon: Users,
  },
  {
    title: "Hackathon Teams",
    description:
      "Distribute hackathon prizes fairly based on each member's contribution and impact.",
    icon: Trophy,
  },
  {
    title: "Casual Coding Groups",
    description:
      "Transform project collaboration into an engaging competition. Locking funds in the vault is optional.",
    icon: Gamepad,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function TargetAudience() {
  return (
    <section className="py-20 min-h-screen relative overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
          >
            Who is Codecracy For?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl"
          >
            Discover if Codecracy is the right solution for your team
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {audiences.map((audience, index) => (
            <motion.div key={index} variants={item}>
              <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 h-full rounded-3xl bg-white/50 dark:bg-gray-900/30">
                <CardHeader>
                  <AnimatedIcon
                    icon={audience.icon}
                    containerClassName="mb-4"
                    size={24}
                  />
                  <CardTitle className="text-xl mb-2">
                    {audience.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {audience.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Room for additional content if needed */}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <ShootingStars />
      <StarsBackground />
    </section>
  );
}
