"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUserRegistrations } from "@/lib/api/registrationStorage";
import { RegistrationDocument } from "@/types/registration";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

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

  const pendingRegistration = registrations.find(
    (reg) => reg.status === "pending"
  );

  const handleContinueRegistration = () => {
    if (pendingRegistration) {
      router.push(
        `/services/carte-grise?registration=${pendingRegistration.id}`
      );
    }
  };

  const handleNewRegistration = () => {
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

  if (!pendingRegistration) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">Aucune demande en cours</p>
        <Button
          onClick={handleNewRegistration}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Nouvelle demande
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-2">
        Demande en cours
      </h3>
      <p className="text-gray-400 mb-4">
        Vous avez une demande de carte grise en cours. Souhaitez-vous la
        continuer ?
      </p>
      <Button
        onClick={handleContinueRegistration}
        className="bg-blue-500 hover:bg-blue-600"
      >
        Continuer ma demande
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  );
}
