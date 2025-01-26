"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialFeed from "@/components/SocialFeed";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { SoldVehiclesCarousel } from "@/components/vehicles/SoldVehiclesCarousel";
import GoogleReviews from "@/components/GoogleReviews";

export default function Home() {
  const sections = [
    {
      title: "À propos",
      description: "Notre histoire et notre équipe",
      href: "/a-propos",
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80",
      //image: "@/img/IMG_1901.JPEG",
    },
    {
      title: "Services",
      description: "Nos prestations automobiles",
      href: "/services",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Vente",
      description: "Importation et vente de véhicules",
      href: "/vente",
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Contact",
      description: "Nous contacter",
      href: "/contact",
      image:
        "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1000&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <main className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="mt-8 text-4xl font-bold text-white mb-2">
            AMERICAINE MOTOR GARAGE
          </h1>
          <p className="text-xl text-gray-400">
            Garage multimarque spécialisé dans les véhicules Américains en
            Savoie
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={section.href}>
                <div className="relative group overflow-hidden rounded-2xl aspect-[16/9]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${section.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                    <h2 className="text-3xl font-bold mb-2">{section.title}</h2>
                    <p className="text-gray-200">{section.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      {/* <SocialFeed /> */}
      <GoogleReviews />
      <SoldVehiclesCarousel />

      <FAQ />
    </div>
  );
}
