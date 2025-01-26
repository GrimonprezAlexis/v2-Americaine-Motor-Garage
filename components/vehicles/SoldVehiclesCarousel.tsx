"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Car,
  AlertCircle,
  Loader2,
} from "lucide-react";
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
import { Alert } from "@/components/ui/alert";
import { VehicleDetailModal } from "./VehicleDetailModal";
import { Badge } from "../ui/badge";

export function SoldVehiclesCarousel() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const ITEMS_PER_PAGE = 4;
  const AUTO_ADVANCE_DELAY = 5000;

  useEffect(() => {
    async function fetchSoldVehicles() {
      try {
        setError(null);
        const q = query(
          collection(db, "vehicles"),
          where("isSold", "==", true),
          orderBy("updatedAt", "desc"),
          limit(12)
        );
        const snapshot = await getDocs(q);
        const vehicleData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Vehicle[];
        setVehicles(vehicleData);
      } catch (error: any) {
        if (error?.message?.includes("requires an index")) {
          setError(
            "L'index est en cours de construction. Veuillez patienter quelques instants..."
          );
          if (retryCount < 3) {
            setTimeout(() => setRetryCount((prev) => prev + 1), 5000);
          }
        } else {
          console.error("Error fetching sold vehicles:", error);
          setError("Une erreur est survenue lors du chargement des véhicules");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSoldVehicles();
  }, [retryCount]);

  const totalPages = Math.ceil(vehicles.length / ITEMS_PER_PAGE);
  const currentVehicles = vehicles.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(nextPage, AUTO_ADVANCE_DELAY);
      return () => clearInterval(interval);
    }
  }, [currentPage, totalPages, isPaused]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <Alert className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </Alert>
        </div>
      </section>
    );
  }

  if (vehicles.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#000000_25%,transparent_25%,transparent_75%,#000000_75%,#000000),linear-gradient(45deg,#000000_25%,transparent_25%,transparent_75%,#000000_75%,#000000)] bg-60 bg-black transform scale-10 opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-blue-500/20 text-blue-400 py-2 px-4 text-sm">
            Historique des Ventes
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
            Nos Dernières Ventes
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Découvrez les véhicules récemment vendus par notre équipe
          </p>
        </motion.div>

        <div
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {currentVehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="aspect-square relative rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    {vehicle.images?.[0] ? (
                      <Image
                        src={vehicle.images[0]}
                        alt={vehicle.title}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Car className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute -left-12 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={prevPage}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-12 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={nextPage}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>

              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      index === currentPage
                        ? "bg-blue-500 w-8"
                        : "bg-gray-600 hover:bg-gray-500"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <VehicleDetailModal
        vehicle={selectedVehicle}
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />
    </section>
  );
}
