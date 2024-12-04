"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { VehicleFilters } from '@/components/vehicles/VehicleFilters';
import { Vehicle } from '@/types/vehicle';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function VentePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const q = query(collection(db, 'vehicles'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const vehicleData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Vehicle[];
        setVehicles(vehicleData);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Une erreur est survenue lors du chargement des véhicules.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    if (selectedFilter === 'all') return true;
    // Add your filtering logic here based on vehicle categories
    return true;
  });

  return (
    <div className="min-h-screen bg-black pt-20">
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nos Véhicules
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Découvrez notre sélection de véhicules américains disponibles à la vente
          </p>
        </motion.div>

        <VehicleFilters
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        {error && (
          <div className="text-red-500 text-center mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Aucun véhicule disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle, index) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                index={index}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}