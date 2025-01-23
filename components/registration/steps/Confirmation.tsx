"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useRegistrationStore } from "@/store/registrationStore";
import { createRegistration } from "@/lib/api/registrationStorage";
import { generateRegistrationId } from "@/lib/utils/registration";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import confetti from "canvas-confetti";

interface ConfirmationProps {
  formData: any;
}

export function Confirmation({ formData }: ConfirmationProps) {
  const { user } = useAuthStore();
  const registrationStore = useRegistrationStore();
  const router = useRouter();
  const [registrationId, setRegistrationId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function saveRegistration() {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const id = await createRegistration(user.uid, {
          service: formData.service,
          vehicleInfo: formData.vehicleInfo,
          price: formData.price,
          serviceFee: formData.serviceFee,
          documents: formData.documents || {},
          userId: user.uid,
        });

        setRegistrationId(id);

        setTimeout(() => {
          // Trigger confetti effect
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }, 3_000);

        setTimeout(() => {
          registrationStore.resetRegistration();
        }, 30_000);
      } catch (error: any) {
        console.error("Error saving registration:", error);
        setError(
          error.message ||
            "Une erreur est survenue lors de la création de la demande"
        );
      } finally {
        setLoading(false);
      }
    }

    saveRegistration();
  }, [user, formData, registrationStore]);

  const handleViewDetails = () => {
    router.push(`/profile?tab=requests`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-gray-400">Création de votre demande en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">{error}</Alert>
        <Button
          onClick={() => router.push("/profile")}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Retour à mon profil
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8"
    >
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <CheckCircle2 className="w-24 h-24 text-green-500" />
        </motion.div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">
          Demande envoyée avec succès !
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Votre demande de carte grise a été transmise. Vous recevrez un email
          de confirmation avec les détails de votre demande.
        </p>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 max-w-sm mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-500" />
          <p className="text-gray-300">Numéro de demande</p>
        </div>
        <p className="text-2xl font-mono text-white">{registrationId}</p>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <Button
          onClick={handleViewDetails}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <FileText className="w-4 h-4 mr-2" />
          Consulter ma demande
        </Button>
        <p className="text-sm text-gray-400">
          Vous pouvez suivre l'avancement de votre demande dans votre espace
          personnel
        </p>
      </div>
    </motion.div>
  );
}
