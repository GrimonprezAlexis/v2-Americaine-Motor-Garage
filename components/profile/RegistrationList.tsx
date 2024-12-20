"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUserRegistrations } from "@/lib/api/registrationStore";
import { RegistrationDocument } from "@/types/registration";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

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

interface RegistrationListProps {
  userId: string;
}

export function RegistrationList({ userId }: RegistrationListProps) {
  const [registrations, setRegistrations] = useState<RegistrationDocument[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRegistrations() {
      try {
        const data = await getUserRegistrations(userId);
        setRegistrations(data);
      } catch (err) {
        setError("Erreur lors du chargement des demandes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRegistrations();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Aucune demande en cours</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {registrations.map((registration, index) => (
        <motion.div
          key={registration.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-gray-900 rounded-xl p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {registration.vehicleInfo.AWN_marque}{" "}
                {registration.vehicleInfo.AWN_modele}
              </h3>
              <p className="text-sm text-gray-400">
                Immatriculation: {registration.vehicleInfo.AWN_immat}
              </p>
            </div>
            <Badge className={statusColors[registration.status]}>
              {statusLabels[registration.status]}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-400">Démarche</p>
              <p className="text-white">{registration.service}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Date</p>
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

          {registration.documents &&
            Object.keys(registration.documents).length > 0 && (
              <div className="border-t border-gray-800 pt-4 mt-4">
                <p className="text-sm text-gray-400 mb-2">Documents fournis</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(registration.documents).map(([type, url]) => (
                    <a
                      key={type}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      {type}
                    </a>
                  ))}
                </div>
              </div>
            )}
        </motion.div>
      ))}
    </div>
  );
}
