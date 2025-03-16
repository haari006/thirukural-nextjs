"use client";

import { Button } from "@/components/ui/button";
import kuralsData from "@/data/kurals.json";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Kural {
  Kural: number;
  Quote: string;
  Meaning: string;
  Chapter: string;
}

export default function Home() {
  const [kural, setKural] = useState<{
    Kural: number;
    Quote: string;
    Meaning: string;
    Chapter: string;
  } | null>(null);

  const [isClient, setIsClient] = useState(false); // Flag to detect client-side
  const [isLoading, setIsLoading] = useState(false);

  const getRandomKural = () => {
    setIsLoading(true);

    // Flatten the structure to get all kurals
    const allKurals: any[] = [];

    Object.keys(kuralsData.Thirukkural).forEach((category) => {
      const categoryData =
        kuralsData.Thirukkural[category as keyof typeof kuralsData.Thirukkural];
      categoryData.Couplets.forEach((couplet: any) => {
        allKurals.push({
          ...couplet,
          Chapter: categoryData.Chapter,
        });
      });
    });

    // Select a random kural
    const randomIndex = Math.floor(Math.random() * allKurals.length);

    // Simulate a small delay for better UX
    setTimeout(() => {
      setKural(allKurals[randomIndex]);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    setIsClient(true); // Set client-side flag
    getRandomKural(); // Fetch random kural only on client
  }, []);

  // Animation variants for word-by-word appearance
  const wordAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2, // Delay each word by 0.2 seconds
      },
    }),
  };

  // Split text into words
  const splitIntoWords = (text: string) => {
    return text
      .split(/\s+/) // Split by whitespace
      .map((word, index) => (
        <motion.span
          key={index}
          custom={index}
          variants={wordAnimation}
          initial="hidden"
          animate="visible"
          className="inline-block"
        >
          {word} 
        </motion.span>
      ));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-primary-800">
          திருக்குறள் | Thirukkural
        </h1>

        <AnimatePresence mode="wait">
          {isClient && kural && !isLoading ? (
            <motion.div
              key={kural.Kural}
              initial={{ opacity: 1 }} // Frame stays still, no animation
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden border border-primary-100">
                {/* Top frame */}
                <div className="absolute top-0 left-0 w-full">
                  <Image
                    src="/frame.png" // Replace with the correct path to the new frame image
                    alt="Decorative top border"
                    width={595}
                    height={100} // Adjust height based on the actual frame dimensions
                    className="w-full"
                    priority
                    quality={100}
                  />
                </div>

                {/* Bottom frame (rotated 180 degrees) */}
                <div className="absolute bottom-0 left-0 w-full">
                  <Image
                    src="/frame.png" // Replace with the correct path to the new frame image
                    width={595}
                    height={100} // Adjust height based on the actual frame dimensions
                    alt="Decorative bottom border"
                    className="w-full rotate-180"
                    priority
                    quality={100}
                  />
                </div>

                {/* Content with adjusted padding to fit between the frames */}
                <div className="relative z-50 pt-32 pb-32 px-8">
                  <div className="mt-16 flex justify-between items-center mb-4">
                    <div className="text-sm font-medium text-primary-700">
                      Kural #{kural.Kural}
                    </div>
                    <div className="text-sm text-primary-600">
                      {kural.Chapter}
                    </div>
                  </div>
                  <div className="p-6 bg-primary-50 rounded-md border border-primary-100 mb-6">
                    <p className="text-xl font-tamil leading-relaxed text-primary-900 text-center">
                      {splitIntoWords(kural.Quote)}
                    </p>
                  </div>
                  <div className="p-6 bg-white rounded-md border border-primary-100">
                    <h3 className="text-sm font-medium text-primary-700 mb-2">
                      Meaning:
                    </h3>
                    <p className="text-primary-800">
                      {splitIntoWords(kural.Meaning)}
                    </p>
                  </div>
                  <div className="mt-8 flex justify-center">
                    <Button
                      onClick={getRandomKural}
                      className="gap-2 bg-primary-600 text-white"
                      size="lg"
                    >
                      <RefreshCw className="h-5 w-5" />
                      <span>New Kural</span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <RefreshCw className="h-8 w-8 text-primary-600 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center text-sm text-primary-600">
          <p>Explore the ancient wisdom of Thirukkural</p>
        </div>
      </div>
    </main>
  );
}
