"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/types/vehicle";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function SoldVehiclesCarousel() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSoldVehicles() {
      try {
        const q = query(
          collection(db, "vehicles"),
          where("isSold", "==", true),
          orderBy("updatedAt", "desc"),
          limit(10)
        );
        const snapshot = await getDocs(q);
        const vehicleData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Vehicle[];
        setVehicles(vehicleData);
      } catch (error) {
        console.error("Error fetching sold vehicles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSoldVehicles();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 >= vehicles.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? vehicles.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-96">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (vehicles.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Nos Dernières Ventes
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Découvrez les véhicules récemment vendus par notre équipe
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[21/9] rounded-2xl overflow-hidden"
              >
                {vehicles[currentIndex].images?.[0] ? (
                  <>
                    <Image
                      src={vehicles[currentIndex].images[0]}
                      alt={vehicles[currentIndex].title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                      <Badge className="mb-4 bg-red-500/90">Vendu</Badge>
                      <h3 className="text-4xl font-bold mb-4">
                        {vehicles[currentIndex].title}
                      </h3>
                      <div className="flex items-center gap-8 text-xl mb-6">
                        <span>{vehicles[currentIndex].year}</span>
                        <span>•</span>
                        <span>{vehicles[currentIndex].mileage} km</span>
                        <span>•</span>
                        <span>{vehicles[currentIndex].engine}</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-400">
                        {vehicles[currentIndex].price}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <Car className="w-20 h-20 text-gray-600" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {vehicles.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                onClick={prevSlide}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                onClick={nextSlide}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>

              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {vehicles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-blue-500 scale-125"
                        : "bg-gray-500 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
