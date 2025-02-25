"use client";

import { motion } from "framer-motion";
import { VehicleInfo as VehicleInfoType } from "@/types/registration";
import { VehicleImage } from "./VehicleImage";
import { formatPrice } from "@/lib/utils/format";
import { REGISTRATION_SERVICES } from "@/types/registration";

interface VehicleInfoProps {
  vehicle: VehicleInfoType;
  price: string | number;
  service: string;
}

export function VehicleInfo({ vehicle, price, service }: VehicleInfoProps) {
  const selectedService = REGISTRATION_SERVICES[service];
  const serviceFee = parseFloat(
    selectedService.tarif.replace("€", "").replace(",", ".")
  );
  const totalPrice = Number(price) + serviceFee;

  const details = [
    {
      label: "Mise en circulation",
      value: vehicle.AWN_date_mise_en_circulation,
    },
    {
      label: "Puissance",
      value: `${vehicle.AWN_puissance_fiscale} CV`,
    },
    {
      label: "CO2",
      value: `${vehicle.AWN_emission_co_2} g/Km`,
    },
    {
      label: "Énergie",
      value: vehicle.AWN_energie,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-6"
    >
      <div className="flex items-start gap-6">
        <div className="relative w-24 h-24 flex-shrink-0">
          <VehicleImage
            src={vehicle.AWN_url_image || ""}
            alt={vehicle.AWN_marque}
          />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white">
              {vehicle.AWN_marque} {vehicle.AWN_modele}
            </h3>
            <p className="text-gray-400">
              Immatriculation: {vehicle.AWN_immat}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {details.map((detail, index) => (
              <div key={index}>
                <p className="text-sm text-gray-400">{detail.label}</p>
                <p className="text-white">{detail.value}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-800 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">Taxes et redevances</p>
              <p className="text-white">{formatPrice(price)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">Frais de service</p>
              <p className="text-white">{selectedService.tarif}</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-700">
              <p className="text-sm font-medium text-gray-300">
                Coût total de la démarche
              </p>
              <p className="text-2xl font-bold text-blue-500">
                {formatPrice(totalPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
