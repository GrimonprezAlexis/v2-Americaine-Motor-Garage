"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Car,
  Check,
  ExternalLink,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchActiveRentalVehicles } from "@/lib/api/rentalStorage";
import { RentalVehicle } from "@/types/rental";
import { Loader2 } from "lucide-react";

export default function RentalPage() {
  const [vehicles, setVehicles] = useState<RentalVehicle[]>([]);
  const [activeVehicle, setActiveVehicle] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadVehicles() {
      try {
        setLoading(true);
        const data = await fetchActiveRentalVehicles();
        setVehicles(data);

        if (data.length > 0) {
          setActiveVehicle(data[0].id);
        }

        setError(null);
      } catch (err) {
        console.error("Error loading rental vehicles:", err);
        setError("Erreur lors du chargement des véhicules de location");
      } finally {
        setLoading(false);
      }
    }

    loadVehicles();
  }, []);

  // Reset image index when changing vehicle
  useEffect(() => {
    setCurrentImageIndex(0);
    setImageLoading(true);
  }, [activeVehicle]);

  const selectedVehicle = vehicles.find((v) => v.id === activeVehicle) || null;

  const nextImage = useCallback(() => {
    if (!selectedVehicle) return;
    setImageLoading(true);
    setCurrentImageIndex((prev) =>
      prev === selectedVehicle.images.length - 1 ? 0 : prev + 1
    );
  }, [selectedVehicle]);

  const previousImage = useCallback(() => {
    if (!selectedVehicle) return;
    setImageLoading(true);
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedVehicle.images.length - 1 : prev - 1
    );
  }, [selectedVehicle]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") previousImage();
      if (e.key === "ArrowRight") nextImage();
    },
    [nextImage, previousImage]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <main className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <main className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <main className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <Car className="w-16 h-16 text-blue-500 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Location Événementielle
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Nos véhicules de location seront bientôt disponibles
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Car className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Location Événementielle
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Rendez votre événement inoubliable avec nos véhicules d'exception
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Link
              href="https://www.mariages.net/voiture-mariage/americaine-motor-garage--e376345"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Heart className="w-5 h-5 mr-2" />
              Réserver sur Mariages.net
            </Link>
          </Button>
        </motion.div>

        <Tabs
          value={activeVehicle || ""}
          onValueChange={setActiveVehicle}
          className="mb-8"
        >
          <TabsList className="w-full bg-gray-900 p-1 mb-8">
            {vehicles.map((vehicle) => (
              <TabsTrigger
                key={vehicle.id}
                value={vehicle.id}
                className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                {vehicle.name.split(" ")[0]} {vehicle.name.split(" ")[1]}
              </TabsTrigger>
            ))}
          </TabsList>

          {vehicles.map((vehicle) => (
            <TabsContent key={vehicle.id} value={vehicle.id} className="mt-0">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-12"
                >
                  <div className="lg:col-span-8 relative aspect-[4/3] rounded-xl overflow-hidden group">
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      </div>
                    )}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${vehicle.id}-${currentImageIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: imageLoading ? 0 : 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={vehicle.images[currentImageIndex]}
                          alt={`${vehicle.name} - Vue ${currentImageIndex + 1}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          priority
                          onLoad={handleImageLoad}
                        />
                      </motion.div>
                    </AnimatePresence>

                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={previousImage}
                        className="bg-black/50 hover:bg-black/70 text-white rounded-full transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                      >
                        <ChevronLeft className="h-8 w-8" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextImage}
                        className="bg-black/50 hover:bg-black/70 text-white rounded-full transform translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                      >
                        <ChevronRight className="h-8 w-8" />
                      </Button>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                    {vehicle.images.map((image, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden group ${
                          index === currentImageIndex
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Image
                          src={image}
                          alt={`${vehicle.name} - Miniature ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div
                          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
                            index === currentImageIndex
                              ? "opacity-0"
                              : "opacity-50 group-hover:opacity-30"
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid md:grid-cols-2 gap-12 mb-12"
                >
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-4">
                        {vehicle.name}
                      </h2>
                      <p className="text-gray-400 text-lg">
                        {vehicle.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {vehicle.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-gray-300"
                        >
                          <Check className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Forfaits
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {vehicle.packages.map((pkg, index) => (
                          <div
                            key={index}
                            className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors"
                          >
                            <div className="text-2xl font-bold text-blue-400 mb-2">
                              {pkg.price}€
                            </div>
                            <div className="text-white">
                              {pkg.duration} sur place
                            </div>
                            <div className="text-sm text-gray-400">
                              Jusqu'à {pkg.distance}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/50 rounded-2xl p-8 mb-12"
                >
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">
                    Services Additionnels
                  </h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    {vehicle.extras.map((extra, index) => (
                      <div
                        key={index}
                        className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-colors"
                      >
                        <div className="font-semibold text-white text-lg mb-2">
                          {extra.name}
                        </div>
                        <div className="text-blue-400 mb-3">{extra.price}</div>
                        <div className="text-sm text-gray-400">
                          {extra.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Link
              href="https://www.mariages.net/voiture-mariage/americaine-motor-garage--e376345"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Réserver maintenant sur Mariages.net
            </Link>
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
