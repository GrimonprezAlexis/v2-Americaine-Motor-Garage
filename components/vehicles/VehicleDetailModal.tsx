"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Vehicle } from "@/types/vehicle";
import { useContactStore } from "@/store/contactStore";
import { useRouter } from "next/navigation";
import {
  Car,
  Calendar,
  Gauge,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Settings,
  Clock,
  Cog,
  Phone,
  Share2,
  Heart,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface VehicleDetailModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

export function VehicleDetailModal({
  vehicle,
  isOpen,
  onClose,
}: VehicleDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();
  const setSelectedVehicle = useContactStore(
    (state) => state.setSelectedVehicle
  );

  const nextImage = () => {
    if (vehicle.images && currentImageIndex < vehicle.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const previousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleContact = () => {
    setSelectedVehicle(vehicle);
    router.push("/contact");
    onClose();
  };

  const mainSpecs = [
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Année",
      value: vehicle.year,
    },
    {
      icon: <Gauge className="w-5 h-5" />,
      label: "Kilométrage",
      value: `${vehicle.mileage} km`,
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Moteur",
      value: vehicle.engine,
    },
    {
      icon: <Cog className="w-5 h-5" />,
      label: "Transmission",
      value: vehicle.transmission,
    },
  ];

  const performanceSpecs = [
    {
      icon: <Gauge className="w-5 h-5" />,
      label: "Puissance",
      value: `${vehicle.power} ch`,
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "0-100 km/h",
      value: `${vehicle.acceleration}s`,
    },
    {
      icon: <Gauge className="w-5 h-5" />,
      label: "Vitesse max",
      value: `${vehicle.maxSpeed} km/h`,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700/50 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Image Section */}
          <div className="relative h-[300px] lg:h-full min-h-[500px]">
            {vehicle.images && vehicle.images.length > 0 ? (
              <>
                <Image
                  src={vehicle.images[currentImageIndex]}
                  alt={`${vehicle.title} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
                {vehicle.isSold ? (
                  <Badge className="absolute top-4 left-4 bg-red-500/90 hover:bg-red-600">
                    Vendu
                  </Badge>
                ) : (
                  vehicle.registrationIncluded && (
                    <Badge className="absolute top-4 left-4 bg-blue-500/90 hover:bg-blue-600">
                      Carte grise incluse
                    </Badge>
                  )
                )}
                {vehicle.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                      onClick={previousImage}
                      disabled={currentImageIndex === 0}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                      onClick={nextImage}
                      disabled={currentImageIndex === vehicle.images.length - 1}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {vehicle.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? "bg-white scale-125"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <Car className="w-20 h-20 text-gray-600" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6 lg:p-8 overflow-y-auto max-h-[85vh] lg:max-h-[800px]">
            <DialogHeader className="mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {vehicle.title}
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>Savoie, France</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-gray-800/50 hover:bg-gray-700/50 border-gray-700/50"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isLiked ? "fill-red-500 text-red-500" : "text-gray-400"
                      }`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-gray-800/50 hover:bg-gray-700/50 border-gray-700/50"
                  >
                    <Share2 className="w-5 h-5 text-gray-400" />
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Prix */}
              <div className="flex items-center text-3xl font-bold text-blue-400">
                <DollarSign className="w-8 h-8 mr-1" />
                {vehicle.price}
              </div>

              {/* Main Specs */}
              <div className="grid grid-cols-2 gap-4">
                {mainSpecs.map((spec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-800/50 rounded-xl p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-400">{spec.icon}</div>
                      <div>
                        <p className="text-sm text-gray-400">{spec.label}</p>
                        <p className="text-white font-medium">{spec.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Separator className="bg-gray-700/50" />

              {/* Performance */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Performance
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {performanceSpecs.map((spec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-blue-400 flex justify-center mb-2">
                        {spec.icon}
                      </div>
                      <p className="text-sm text-gray-400 mb-1">{spec.label}</p>
                      <p className="text-white font-medium">{spec.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <Separator className="bg-gray-700/50" />

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {vehicle.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={handleContact}
                  disabled={vehicle.isSold}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {vehicle.isSold ? "Véhicule vendu" : "Nous contacter"}
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 bg-gray-800/50 hover:bg-gray-700/50 border-gray-700/50"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
