"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUserRegistrations } from "@/lib/api/registrationStorage";
import { RegistrationDocument } from "@/types/registration";
import { formatDate, formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, ArrowRight, Car, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

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

export function RegistrationList({ userId }: { userId: string }) {
  const [registrations, setRegistrations] = useState<RegistrationDocument[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const handleNewRequest = () => {
    router.push("/services/carte-grise");
  };

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
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400 mb-6">Aucune demande en cours</p>
        <Button
          onClick={handleNewRequest}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Nouvelle demande
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">
          Mes demandes de carte grise
        </h2>
        <Button
          onClick={handleNewRequest}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Nouvelle demande
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {registrations.map((registration, index) => (
        <motion.div
          key={registration.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-gray-900 rounded-xl p-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {registration.service}
              </h3>
              <p className="text-sm text-gray-400">
                Demande #{registration.id}
              </p>
            </div>
            <Badge className={statusColors[registration.status]}>
              {statusLabels[registration.status]}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Car className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Véhicule</p>
                  <p className="text-white">
                    {registration.vehicleInfo.AWN_marque}{" "}
                    {registration.vehicleInfo.AWN_modele}
                  </p>
                  <p className="text-sm text-gray-400">
                    Immatriculation: {registration.vehicleInfo.AWN_immat}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Date de la demande</p>
                  <p className="text-white">
                    {formatDate(registration.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Documents fournis</p>
                <div className="mt-2 space-y-2">
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

              <div>
                <p className="text-sm text-gray-400">Montant</p>
                <p className="text-xl font-semibold text-white">
                  {formatPrice(registration.price)}
                </p>
              </div>
            </div>
          </div>

          {registration.status === "pending" && (
            <div className="pt-4 border-t border-gray-800">
              <Button
                onClick={() =>
                  router.push(
                    `/services/carte-grise?registration=${registration.id}`
                  )
                }
                variant="outline"
                className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
              >
                Continuer la demande
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
