"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleForm } from '@/components/admin/vehicles/VehicleForm';
import { VehicleList } from '@/components/admin/vehicles/VehicleList';
import { Vehicle } from '@/types/vehicle';
import { Alert } from '@/components/ui/alert';

export default function AdminVehiclesPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black pt-20">
      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Gestion des Véhicules</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {showForm ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <VehicleForm
                vehicle={selectedVehicle}
                onSuccess={() => {
                  setShowForm(false);
                  setSelectedVehicle(null);
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
              <VehicleList
                onEdit={(vehicle) => {
                  setSelectedVehicle(vehicle);
                  setShowForm(true);
                }}
              />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}