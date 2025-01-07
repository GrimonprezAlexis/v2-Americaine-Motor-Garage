"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RegistrationDocument, RegistrationStatus } from "@/types/registration";
import { updateRegistrationStatus } from "@/lib/api/registrationStorage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, formatPrice } from "@/lib/utils/format";
import { Car, FileText, Mail, MapPin } from "lucide-react";
import confetti from "canvas-confetti";

interface RegistrationDetailsProps {
  registration: RegistrationDocument;
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/50",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/50",
  completed: "bg-green-500/10 text-green-500 border-green-500/50",
  rejected: "bg-red-500/10 text-red-500 border-red-500/50",
};

const statusLabels = {
  pending: "En attente",
  processing: "En cours",
  completed: "Terminé",
  rejected: "Rejeté",
};

export function RegistrationDetails({
  registration,
}: RegistrationDetailsProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: RegistrationStatus) => {
    setLoading(true);
    try {
      await updateRegistrationStatus(registration.id, newStatus);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-8 space-y-8"
    >
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-white">Détails de la demande</h2>
        <Badge className={statusColors[registration.status]}>
          {statusLabels[registration.status]}
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Informations véhicule */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Car className="w-5 h-5 mr-2 text-blue-500" />
            Véhicule
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Marque / Modèle</p>
              <p className="text-white">
                {registration.vehicleInfo.AWN_marque}{" "}
                {registration.vehicleInfo.AWN_modele}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Immatriculation</p>
              <p className="text-white">{registration.vehicleInfo.AWN_immat}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Mise en circulation</p>
              <p className="text-white">
                {registration.vehicleInfo.AWN_date_mise_en_circulation}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Puissance</p>
              <p className="text-white">
                {registration.vehicleInfo.AWN_puissance_fiscale} CV
              </p>
            </div>
          </div>
        </div>

        {/* Informations demande */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-500" />
            Démarche
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Type</p>
              <p className="text-white">{registration.service}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Date de demande</p>
              <p className="text-white">{formatDate(registration.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Montant</p>
              <p className="text-white">{formatPrice(registration.price)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">N° de demande</p>
              <p className="text-white font-mono">{registration.id}</p>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4">
            Documents fournis
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(registration.documents).map(([type, url]) => (
              <a
                key={type}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-400 hover:text-blue-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                {type}
              </a>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <Select
              value={registration.status}
              onValueChange={(value: RegistrationStatus) =>
                handleStatusChange(value)
              }
              disabled={loading}
            >
              <SelectTrigger className="w-[200px] bg-gray-800">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="processing">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="bg-gray-800 hover:bg-gray-700"
              asChild
            >
              <a href={`mailto:user@example.com`}>
                <Mail className="w-4 h-4 mr-2" />
                Contacter
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
