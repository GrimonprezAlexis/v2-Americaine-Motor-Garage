"use client";

import { useState } from 'react';
import { Vehicle } from '@/types/vehicle';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VehiclePreviewProps {
  vehicle: Vehicle;
}

export function VehiclePreview({ vehicle }: VehiclePreviewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  return (
    <div className="space-y-8">
      {vehicle.images && vehicle.images.length > 0 && (
        <div className="relative aspect-video rounded-xl overflow-hidden">
          <Image
            src={vehicle.images[currentImageIndex]}
            alt={vehicle.title}
            fill
            className="object-cover"
          />
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
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {vehicle.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-white">{vehicle.title}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-blue-400">{vehicle.year}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Prix</span>
              <span className="text-white">{vehicle.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Kilométrage</span>
              <span className="text-white">{vehicle.mileage} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Carburant</span>
              <span className="text-white">{vehicle.fuel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Transmission</span>
              <span className="text-white">{vehicle.transmission}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Moteur</span>
              <span className="text-white">{vehicle.engine}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Puissance</span>
              <span className="text-white">{vehicle.power} ch</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">0-100 km/h</span>
              <span className="text-white">{vehicle.acceleration}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Vitesse max</span>
              <span className="text-white">{vehicle.maxSpeed} km/h</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Description</h3>
          <p className="text-gray-400">{vehicle.description}</p>
        </div>

        {vehicle.images && vehicle.images.length > 1 && (
          <div className="grid grid-cols-6 gap-2">
            {vehicle.images.map((image, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`relative aspect-square rounded-lg overflow-hidden ${
                  index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image
                  src={image}
                  alt={`${vehicle.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}