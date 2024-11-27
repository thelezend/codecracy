"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const steps = [
  {
    title: "Connect Your Wallet",
    description:
      "Start by connecting your Solana wallet to access the platform's features.",
  },
  {
    title: "Submit & Vote",
    description:
      "Submit your code contributions and participate in voting to earn contribution scores.",
  },
  {
    title: "Claim Rewards",
    description:
      "After project completion, claim your rewards based on your contribution scores.",
  },
];

export function Explainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
            See How It Works
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl">
            A quick overview of Codecracy&apos;s powerful features
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 relative group cursor-pointer">
            {/* Replace the image URL with your thumbnail */}
            <Image
              src="/explainer-thumbnail.jpg"
              alt="Codecracy Overview"
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              width={800}
              height={450}
            />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary/90 hover:bg-primary rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-all"
                >
                  <Play className="h-6 w-6 text-white ml-1" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0">
                <div className="aspect-video">
                  <video
                    width="100%"
                    height="100%"
                    controls
                    autoPlay
                    className="border-0"
                  >
                    <source src="/videos/explainer.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="p-4 relative"
            >
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <motion.div
                  className="mb-4 text-4xl font-bold text-primary"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.2 }}
                >
                  {index + 1}
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
