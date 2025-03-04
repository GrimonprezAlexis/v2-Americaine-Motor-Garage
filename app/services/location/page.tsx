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

const vehicles = [
  {
    id: "mustang-1967",
    name: "Ford Mustang 1967 V8 FASTBACK",
    description:
      "Vivez une expérience inoubliable à bord de ce véhicule emblématique, idéal pour sublimer votre mariage ou pour marquer un moment unique tel qu'une demande en mariage, un anniversaire, ou encore une escapade romantique.",
    images: [
      "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/Locations/IMG_4976.JPG",
      "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/Locations/IMG_4942.JPG",
      "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?auto=format&fit=crop&w=1200&q=80",
      "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/Locations/IMG_4937.JPG",
      "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/Locations/IMG_4959.JPG",
    ],
    features: [
      "Location avec chauffeur uniquement",
      "Véhicule emblématique américain",
      "Parfait pour les mariages et événements",
      "Disponible sur Chambéry et Aix-les-Bains",
    ],
    packages: [
      {
        duration: "2h",
        distance: "50 km",
        price: "450",
      },
      {
        duration: "3h",
        distance: "80 km",
        price: "550",
      },
      {
        duration: "5h",
        distance: "120 km",
        price: "700",
      },
      {
        duration: "6h",
        distance: "150 km",
        price: "850",
      },
    ],
    extras: [
      {
        name: "Décoration Florale",
        price: "à partir de 150€",
        description: "Décoration personnalisée selon vos goûts",
      },
      {
        name: "Champagne",
        price: "à partir de 70€",
        description: "Champagne de qualité avec deux coupes",
      },
      {
        name: "Photographe",
        price: "sur devis",
        description: "Photographe professionnel pour immortaliser l'événement",
      },
      {
        name: "Panier Garni",
        price: "sur devis",
        description: "Repas ou apéritif selon vos préférences",
      },
    ],
  },
  {
    id: "dodge-challenger",
    name: "Dodge Challenger R/T 2023",
    description:
      "Ajoutez une touche de puissance et d'élégance à votre événement avec cette Dodge Challenger moderne. Son style musclé et son rugissement caractéristique ne laisseront personne indifférent lors de votre arrivée.",
    images: [
      "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/Locations/IMG_3783.jpg", //Mustang rouge
      "https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603553329474-99f95f35394f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603553329474-99f95f35394f?auto=format&fit=crop&w=1200&q=80",
    ],
    features: [
      "Location avec chauffeur uniquement",
      "Moteur V8 puissant",
      "Intérieur luxueux et confortable",
      "Idéal pour les événements modernes",
    ],
    packages: [
      {
        duration: "2h",
        distance: "50 km",
        price: "500",
      },
      {
        duration: "3h",
        distance: "80 km",
        price: "600",
      },
      {
        duration: "5h",
        distance: "120 km",
        price: "750",
      },
      {
        duration: "6h",
        distance: "150 km",
        price: "900",
      },
    ],
    extras: [
      {
        name: "Décoration Florale",
        price: "à partir de 150€",
        description: "Décoration personnalisée selon vos goûts",
      },
      {
        name: "Champagne",
        price: "à partir de 70€",
        description: "Champagne de qualité avec deux coupes",
      },
      {
        name: "Photographe",
        price: "sur devis",
        description: "Photographe professionnel pour immortaliser l'événement",
      },
      {
        name: "Panier Garni",
        price: "sur devis",
        description: "Repas ou apéritif selon vos préférences",
      },
    ],
  },
  {
    id: "cadillac-eldorado",
    name: "Cadillac Eldorado 1976",
    description:
      "Faites sensation avec cette Cadillac Eldorado, symbole du luxe américain des années 70. Sa silhouette imposante et son confort exceptionnel en font le véhicule parfait pour une arrivée remarquée lors de votre événement spécial.",
    images: [
      "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/Locations/IMG_2135.jpg", //Police
      "https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603553329474-99f95f35394f?auto=format&fit=crop&w=1200&q=80",
    ],
    features: [
      "Location avec chauffeur uniquement",
      "Intérieur cuir d'origine",
      "Véhicule de collection",
      "Parfait pour les mariages vintage",
    ],
    packages: [
      {
        duration: "2h",
        distance: "50 km",
        price: "480",
      },
      {
        duration: "3h",
        distance: "80 km",
        price: "580",
      },
      {
        duration: "5h",
        distance: "120 km",
        price: "730",
      },
      {
        duration: "6h",
        distance: "150 km",
        price: "880",
      },
    ],
    extras: [
      {
        name: "Décoration Florale",
        price: "à partir de 150€",
        description: "Décoration personnalisée selon vos goûts",
      },
      {
        name: "Champagne",
        price: "à partir de 70€",
        description: "Champagne de qualité avec deux coupes",
      },
      {
        name: "Photographe",
        price: "sur devis",
        description: "Photographe professionnel pour immortaliser l'événement",
      },
      {
        name: "Panier Garni",
        price: "sur devis",
        description: "Repas ou apéritif selon vos préférences",
      },
    ],
  },
];

export default function RentalPage() {
  const [activeVehicle, setActiveVehicle] = useState(vehicles[0].id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when changing vehicle
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeVehicle]);

  const selectedVehicle =
    vehicles.find((v) => v.id === activeVehicle) || vehicles[0];

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === selectedVehicle.images.length - 1 ? 0 : prev + 1
    );
  }, [selectedVehicle]);

  const previousImage = useCallback(() => {
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
          value={activeVehicle}
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
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${vehicle.id}-${currentImageIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
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
