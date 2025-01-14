"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/types/vehicle";
import { VehicleCard } from "./VehicleCard";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export function VehicleCarousel() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const q = query(
          collection(db, "vehicles"),
          orderBy("createdAt", "desc"),
          limit(6)
        );
        const snapshot = await getDocs(q);
        const vehicleData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Vehicle[];
        setVehicles(vehicleData);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
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
      <div className="flex justify-center items-center h-96">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          Aucun véhicule disponible pour le moment
        </p>
      </div>
    );
  }

  // Ensure we have enough vehicles for the carousel
  const displayCount = Math.min(3, vehicles.length);

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`carousel-${currentIndex}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {Array.from({ length: displayCount }).map((_, offset) => {
              const index = (currentIndex + offset) % vehicles.length;
              const vehicle = vehicles[index];
              return (
                <VehicleCard
                  key={`${vehicle.id}-${offset}-${currentIndex}`}
                  vehicle={vehicle}
                  index={offset}
                />
              );
            })}
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
        </>
      )}
    </div>
  );
}
