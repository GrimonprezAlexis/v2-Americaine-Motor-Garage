"use client";

import { motion } from 'framer-motion';
import { Vehicle } from '@/types/vehicle';
import Image from 'next/image';

interface VehiclePreviewProps {
  vehicle: Vehicle | null;
}

export function VehiclePreview({ vehicle }: VehiclePreviewProps) {
  if (!vehicle) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-900 rounded-xl p-6 shadow-xl"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Aperçu</h2>
      <div className="space-y-6">
        <div className="aspect-video relative rounded-lg overflow-hidden">
          {vehicle.images?.[0] && (
            <Image
              src={vehicle.images[0]}
              alt={vehicle.title}
              fill
              className="object-cover"
            />
          )}
        </div>
        <h3 className="text-2xl font-bold text-white">{vehicle.title}</h3>
        <div className="flex justify-between text-gray-400">
          <span>{vehicle.make} {vehicle.model}</span>
          <span>{vehicle.year}</span>
        </div>
        <p className="text-xl font-bold text-blue-500">{vehicle.price}</p>
        <p className="text-gray-300">{vehicle.description}</p>
        {vehicle.images && vehicle.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {vehicle.images.slice(1).map((image, index) => (
              <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`${vehicle.title} - Image ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}