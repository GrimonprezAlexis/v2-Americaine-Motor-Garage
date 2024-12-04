"use client";

import { motion } from 'framer-motion';
import { Vehicle } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { deleteDoc, doc } from 'firebase/firestore';

interface VehicleListProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
}

export function VehicleList({ vehicles, onEdit }: VehicleListProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      await deleteDoc(doc(db, 'vehicles', id));
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Véhicules</h2>
      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="text-white font-semibold">{vehicle.title}</h3>
              <p className="text-gray-400">
                {vehicle.make} {vehicle.model} - {vehicle.year}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(vehicle)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(vehicle.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}