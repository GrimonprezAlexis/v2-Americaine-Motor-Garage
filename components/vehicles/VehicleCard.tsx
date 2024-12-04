"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Vehicle } from "@/types/vehicle";
import { Car, Calendar, Gauge, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleDetailModal } from "./VehicleDetailModal";
import { Badge } from "@/components/ui/badge";

interface VehicleCardProps {
  vehicle: Vehicle;
  index: number;
}

export function VehicleCard({ vehicle, index }: VehicleCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          {vehicle.images?.[0] ? (
            <Image
              src={vehicle.images[0]}
              alt={vehicle.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority={index < 3}
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <Car className="w-12 h-12 text-gray-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
          
          {vehicle.status && (
            <Badge className="absolute top-4 right-4 bg-blue-500/90 hover:bg-blue-600">
              {vehicle.status}
            </Badge>
          )}
        </div>

        <div className="relative p-6">
          <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">
            {vehicle.title}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{vehicle.year}</span>
            </div>
            <div className="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors">
              <Gauge className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{vehicle.mileage} km</span>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-gray-400 group-hover:text-gray-300 transition-colors">
              <span>Moteur:</span>
              <span className="font-medium">{vehicle.engine}</span>
            </div>
            <div className="flex justify-between text-gray-400 group-hover:text-gray-300 transition-colors">
              <span>Puissance:</span>
              <span className="font-medium">{vehicle.power} ch</span>
            </div>
            <div className="flex justify-between text-gray-400 group-hover:text-gray-300 transition-colors">
              <span>Transmission:</span>
              <span className="font-medium">{vehicle.transmission}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            <div className="flex items-center text-blue-400 text-2xl font-bold group-hover:text-blue-300 transition-colors">
              <DollarSign className="w-6 h-6 mr-1" />
              {vehicle.price}
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border-blue-500/20 hover:border-blue-500/30 transition-all duration-300 group/button"
            >
              <span>Détails</span>
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover/button:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-gray-900 via-transparent to-transparent pointer-events-none" />
        </div>
      </motion.div>

      <VehicleDetailModal
        vehicle={vehicle}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}