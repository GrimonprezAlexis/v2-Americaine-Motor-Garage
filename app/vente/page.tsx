"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Vehicle } from "@/types/vehicle";
import { db } from "@/lib/firebase/config";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleFilters } from "@/components/vehicles/VehicleFilters";
import { Input } from "@/components/ui/input";
import { Search, Car, Loader2 } from "lucide-react";

export default function VentePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(collection(db, "vehicles"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const vehicleData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Vehicle[];
        setVehicles(vehicleData);
        setFilteredVehicles(vehicleData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching vehicles:", error);
        setError("Une erreur est survenue lors du chargement des véhicules.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = [...vehicles];

    // Apply category filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter((vehicle) => {
        switch (selectedFilter) {
          case "muscle":
            return (
              vehicle.make.toLowerCase().includes("mustang") ||
              vehicle.make.toLowerCase().includes("challenger") ||
              vehicle.make.toLowerCase().includes("camaro")
            );
          case "pickup":
            return (
              vehicle.make.toLowerCase().includes("ram") ||
              vehicle.make.toLowerCase().includes("f-150") ||
              vehicle.make.toLowerCase().includes("silverado")
            );
          case "suv":
            return (
              vehicle.make.toLowerCase().includes("tahoe") ||
              vehicle.make.toLowerCase().includes("explorer") ||
              vehicle.make.toLowerCase().includes("durango")
            );
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.title.toLowerCase().includes(term) ||
          vehicle.make.toLowerCase().includes(term) ||
          vehicle.model.toLowerCase().includes(term) ||
          vehicle.description.toLowerCase().includes(term)
      );
    }

    setFilteredVehicles(filtered);
  }, [vehicles, selectedFilter, searchTerm]);

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
            Nos Véhicules
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Découvrez notre sélection de véhicules américains disponibles à la
            vente
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un véhicule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6 bg-gray-900 border-gray-800 text-white w-full rounded-xl 
                       placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <VehicleFilters
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center mb-8"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredVehicles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400">
              {searchTerm
                ? "Aucun véhicule ne correspond à votre recherche"
                : "Aucun véhicule disponible pour le moment"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredVehicles.map((vehicle, index) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}
