"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VehicleForm } from './VehicleForm';
import { VehicleList } from './VehicleList';
import { VehiclePreview } from './VehiclePreview';
import { Vehicle } from '@/types/vehicle';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Alert } from '@/components/ui/alert';
import confetti from 'canvas-confetti';

export function AdminDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const q = query(collection(db, 'vehicles'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const vehicleData: Vehicle[] = [];
        snapshot.forEach((doc) => {
          vehicleData.push({ id: doc.id, ...doc.data() } as Vehicle);
        });
        setVehicles(vehicleData);
        setError(null);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError('Erreur de connexion à la base de données. Les modifications seront synchronisées une fois la connexion rétablie.');
      }
    );

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  const handleSuccess = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {(error || isOffline) && (
        <Alert className="mb-6 bg-yellow-500/10 text-yellow-500 border-yellow-500/50">
          {isOffline ? 'Mode hors ligne. Les modifications seront synchronisées une fois la connexion rétablie.' : error}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <VehicleForm
            vehicle={selectedVehicle}
            onSuccess={() => {
              handleSuccess();
              setSelectedVehicle(null);
              setIsEditing(false);
            }}
            onCancel={() => {
              setSelectedVehicle(null);
              setIsEditing(false);
            }}
          />
          <VehicleList
            vehicles={vehicles}
            onEdit={(vehicle) => {
              setSelectedVehicle(vehicle);
              setIsEditing(true);
              setShowPreview(true);
            }}
          />
        </motion.div>

        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:sticky lg:top-24"
            >
              <VehiclePreview vehicle={selectedVehicle} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}