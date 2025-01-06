"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RegistrationDocument } from "@/types/registration";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";
import { RegistrationDetails } from "./registrationDetails";
import { Alert } from "@/components/ui/alert";

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

export function RegistrationList() {
  const [registrations, setRegistrations] = useState<RegistrationDocument[]>(
    []
  );
  const [selectedRegistration, setSelectedRegistration] =
    useState<RegistrationDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "registrations"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as RegistrationDocument[];
        setRegistrations(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching registrations:", error);
        setError("Erreur lors du chargement des demandes");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="destructive">{error}</Alert>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Liste des demandes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">
          Demandes de carte grise
        </h2>

        {registrations.map((registration) => (
          <motion.div
            key={registration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gray-900 rounded-xl p-6 cursor-pointer transition-colors
              ${
                selectedRegistration?.id === registration.id
                  ? "ring-2 ring-blue-500"
                  : "hover:bg-gray-800"
              }`}
            onClick={() => setSelectedRegistration(registration)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {registration.vehicleInfo.AWN_marque}{" "}
                  {registration.vehicleInfo.AWN_modele}
                </h3>
                <p className="text-sm text-gray-400">
                  {registration.vehicleInfo.AWN_immat}
                </p>
              </div>
              <Badge className={statusColors[registration.status]}>
                {statusLabels[registration.status]}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {formatDate(registration.createdAt)}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-blue-400 hover:text-blue-300"
                asChild
              >
                <a href={`mailto:user@example.com`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Contacter
                </a>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Détails de la demande */}
      <div className="lg:sticky lg:top-24">
        {selectedRegistration ? (
          <RegistrationDetails registration={selectedRegistration} />
        ) : (
          <div className="bg-gray-900 rounded-xl p-8 text-center">
            <p className="text-gray-400">
              Sélectionnez une demande pour voir les détails
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
