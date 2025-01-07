"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useRegistrationStore } from "@/store/registrationStore";
import { createRegistration } from "@/lib/api/registrationStorage";
import { generateRegistrationId } from "@/lib/utils/registration";
import confetti from "canvas-confetti";

interface ConfirmationProps {
  formData: any;
}

export function Confirmation({ formData }: ConfirmationProps) {
  const { user } = useAuthStore();
  const registrationStore = useRegistrationStore();
  const registrationId = generateRegistrationId();

  useEffect(() => {
    async function saveRegistration() {
      if (!user) return;

      try {
        await createRegistration(user.uid, {
          service: formData.service,
          vehicleInfo: formData.vehicleInfo,
          price: formData.price,
          documents: {},
          userId: "",
        });

        // Reset registration store after successful save
        registrationStore.resetRegistration();

        // Celebrate!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (error) {
        console.error("Error saving registration:", error);
      }
    }

    saveRegistration();
  }, [user, formData]);

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
        <p className="text-gray-300 mb-2">Numéro de demande</p>
        <p className="text-2xl font-mono text-white">{registrationId}</p>
      </div>

      <div className="flex justify-center gap-4">
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <a href="/profile?tab=requests">Suivre ma demande</a>
        </Button>
      </div>
    </motion.div>
  );
}
