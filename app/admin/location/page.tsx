"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { RentalVehicleForm } from "@/components/admin/rental/RentalVehicleForm";
import { RentalVehicleList } from "@/components/admin/rental/RentalVehicleList";
import { RentalVehicle } from "@/types/rental";
import { Plus, Car, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { fetchRentalVehicles } from "@/lib/api/rentalStorage";

export default function AdminRentalPage() {
  const [vehicles, setVehicles] = useState<RentalVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<RentalVehicle | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVehicles() {
      try {
        setLoading(true);
        const data = await fetchRentalVehicles();
        setVehicles(data);
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

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await fetchRentalVehicles();
      setVehicles(data);
      setError(null);
    } catch (err) {
      console.error("Error refreshing rental vehicles:", err);
      setError("Erreur lors du rafraîchissement des véhicules de location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <AdminNavigation />
      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Gestion des Véhicules de Location
          </h1>
          <Button
            onClick={() => {
              setSelectedVehicle(null);
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau véhicule
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 bg-red-500/10 text-red-500 border-red-500/50">
            {error}
          </Alert>
        )}

        {loading && !vehicles.length ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {showForm ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2"
              >
                <RentalVehicleForm
                  vehicle={selectedVehicle}
                  onSuccess={() => {
                    setShowForm(false);
                    setSelectedVehicle(null);
                    handleRefresh();
                  }}
                  onCancel={() => {
                    setShowForm(false);
                    setSelectedVehicle(null);
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="lg:col-span-2"
              >
                <RentalVehicleList
                  vehicles={vehicles}
                  onEdit={(vehicle) => {
                    setSelectedVehicle(vehicle);
                    setShowForm(true);
                  }}
                  onRefresh={handleRefresh}
                />
              </motion.div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
