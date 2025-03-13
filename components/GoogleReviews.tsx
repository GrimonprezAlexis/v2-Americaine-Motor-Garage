"use client";

import { motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GoogleReviews() {
  // Hardcoded data from Google Business Profile
  const rating = 4.9;
  const reviewCount = 143;
  const googleUrl = "https://g.co/kgs/ftknjWV";

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-4xl font-bold text-white">{rating}</span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-8 h-8 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          </div>

          <p className="text-2xl text-gray-400 mb-8">
            Plus de <span className="text-white font-bold">{reviewCount}</span>{" "}
            avis clients
          </p>

          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Star className="w-5 h-5 mr-2" />
              Voir tous nos avis sur Google
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
