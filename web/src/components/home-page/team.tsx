"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProfileData } from "./profile-data";
import { WavyBackground } from "../ui/wavy-background";

export function Team() {
  return (
    <section className="py-24 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/50 relative">
      <div className="absolute inset-0 z-0">
        <WavyBackground />
      </div>
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
            Meet the Developer
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl">
            The mind behind Codecracy
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="relative w-32 h-32 rounded-full overflow-hidden ring-2 ring-primary/20">
                  <Image
                    src="https://avatars.githubusercontent.com/thelezend"
                    alt="Developer Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <ProfileData />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="https://github.com/thelezend"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        className="mt-4 group hover:border-primary/50"
                      >
                        <Github className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                        View GitHub Profile
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Check out my other projects!</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
