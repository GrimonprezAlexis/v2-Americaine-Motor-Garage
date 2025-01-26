"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

interface GoogleReview {
  author_name: string;
  author_url: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
}

export default function GoogleReviews() {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated reviews data - Replace with actual Google Places API call
    const mockReviews: GoogleReview[] = [
      {
        author_name: "Jean Dupont",
        author_url: "https://www.google.com/maps/contrib/123",
        profile_photo_url:
          "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop",
        rating: 5,
        relative_time_description: "il y a 1 semaine",
        text: "Excellent service ! L'équipe est très professionnelle et compétente. Je recommande vivement pour l'importation de véhicules américains.",
      },
      {
        author_name: "Marie Martin",
        author_url: "https://www.google.com/maps/contrib/456",
        profile_photo_url:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        rating: 5,
        relative_time_description: "il y a 2 mois",
        text: "Super expérience avec Americaine Motor. Ils m'ont accompagné dans l'importation de mon Dodge Ram. Tout s'est parfaitement déroulé.",
      },
      {
        author_name: "Pierre Durand",
        author_url: "https://www.google.com/maps/contrib/789",
        profile_photo_url:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
        rating: 5,
        relative_time_description: "il y a 3 mois",
        text: "Une équipe à l'écoute et très réactive. Le service carte grise est vraiment pratique et efficace. Je recommande !",
      },
    ];

    setReviews(mockReviews);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="py-4 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-6 h-6 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Ce que nos clients disent
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Découvrez les avis de nos clients sur Google
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900 rounded-xl p-6 relative group hover:bg-gray-800/50 transition-colors"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-500/20" />

              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={review.profile_photo_url}
                    alt={review.author_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {review.author_name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {review.relative_time_description}
                  </p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-gray-300 line-clamp-4 mb-4">{review.text}</p>

              <a
                href={review.author_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Voir l'avis sur Google
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="https://g.co/kgs/niiBQFM"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            Voir tous nos avis sur Google
            <Star className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
