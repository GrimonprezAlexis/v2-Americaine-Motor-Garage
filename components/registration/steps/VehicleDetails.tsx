"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Car, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { calculateRegistrationCost } from "@/lib/api/registration";
import { RegistrationResponse } from "@/types/registration";
import { VehicleInfo } from "@/components/registration/vehicle/VehicleInfo";

interface VehicleDetailsProps {
  formData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function VehicleDetails({
  formData,
  onUpdate,
  onNext,
  onBack,
}: VehicleDetailsProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<RegistrationResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.plateNumber) {
      setError("Veuillez saisir le numéro d'immatriculation");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await calculateRegistrationCost(
        formData.plateNumber,
        formData.postalCode,
        "1" // Démarche par défaut
      );

      setVehicleData(response);
      onUpdate({
        ...formData,
        vehicleInfo: response.data.vehicle,
        price: parseFloat(response.data.price.total),
        make: response.data.vehicle.AWN_marque,
        model: response.data.vehicle.AWN_modele,
        registration: response.data.vehicle.AWN_immat,
        power: response.data.vehicle.AWN_puissance_fiscale,
        firstRegistration: response.data.vehicle.AWN_date_mise_en_circulation,
        co2: response.data.vehicle.AWN_emission_co_2,
        energy: response.data.vehicle.AWN_energie,
      });
    } catch (error) {
      setError("Erreur lors de la récupération des informations du véhicule");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <Car className="w-12 h-12 mx-auto text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Détails du véhicule
        </h2>
        <p className="text-gray-400">
          Renseignez les informations de votre véhicule
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Numéro d'immatriculation (ex: AA-123-AA)"
              value={formData.plateNumber}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                onUpdate({ ...formData, plateNumber: value });
              }}
              className="bg-gray-800 border-gray-700 text-white uppercase pl-12"
              maxLength={9}
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <span className="text-blue-500 font-bold">F</span>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {vehicleData && (
          <VehicleInfo 
            vehicle={vehicleData.data.vehicle}
            price={vehicleData.data.price.total}
          />
        )}

        <div className="flex justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 bg-gray-800 hover:bg-gray-700"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          {vehicleData ? (
            <Button
              type="button"
              onClick={onNext}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Continuer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Calcul en cours...
                </>
              ) : (
                "Calculer le coût"
              )}
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  );
}