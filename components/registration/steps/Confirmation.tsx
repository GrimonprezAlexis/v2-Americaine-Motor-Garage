import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegistrationStore } from "@/store/registrationStore";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

interface ConfirmationProps {
  formData: any;
}

export function Confirmation({ formData }: ConfirmationProps) {
  const registrationStore = useRegistrationStore();
  const router = useRouter();

  useEffect(() => {
    // Simuler l'envoi d'email
    const emailContent = `
Nouvelle demande de carte grise

Service: ${formData.service}
Véhicule: ${formData.vehicleInfo.AWN_marque} ${formData.vehicleInfo.AWN_modele}
Immatriculation: ${formData.vehicleInfo.AWN_immat}
Code postal: ${formData.postalCode}
Email: ${formData.email}

Prix total: ${formData.totalAmount} €
    `;

    console.log(
      "Email qui serait envoyé à cartegrise@americaineimport.fr:",
      emailContent
    );

    // Effet de confetti
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 500);

    // Reset le formulaire après 30 secondes
    setTimeout(() => {
      registrationStore.resetRegistration();
    }, 30_000);
  }, [formData, registrationStore]);

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
          Votre demande de carte grise a été transmise. Nous vous contacterons
          prochainement à l'adresse email fournie pour la suite des démarches.
        </p>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <Button
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <FileText className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Button>
      </div>
    </motion.div>
  );
}
