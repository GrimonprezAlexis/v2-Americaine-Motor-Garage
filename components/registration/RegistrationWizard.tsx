"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ServiceSelector } from "./steps/ServiceSelector";
import { VehicleDetails } from "./steps/VehicleDetails";
import { DocumentUpload } from "./steps/DocumentUpload";
import { Summary } from "./steps/Summary";
import { Confirmation } from "./steps/Confirmation";
import { ProgressSteps } from "./ProgressSteps";
import { useAuthStore } from "@/store/authStore";
import { useRegistrationStore } from "@/store/registrationStore";
import { AuthRedirect } from "@/components/auth/AuthRedirect";

const steps = [
  "Sélection du service",
  "Détails du véhicule",
  "Documents requis",
  "Récapitulatif",
  "Confirmation",
];

export function RegistrationWizard() {
  const { user } = useAuthStore();
  const registration = useRegistrationStore();
  const [initialized, setInitialized] = useState(false);

  // Hydrate the store on client side
  useEffect(() => {
    useRegistrationStore.persist.rehydrate();
    setInitialized(true);
  }, []);

  const handleNext = () => {
    if (registration.currentStep < steps.length - 1) {
      registration.setStep(registration.currentStep + 1);
    }
  };

  const handleBack = () => {
    if (registration.currentStep > 0) {
      registration.setStep(registration.currentStep - 1);
    }
  };

  const updateRegistration = (data: any) => {
    registration.updateRegistration(data);
  };

  // Show loading state while hydrating
  if (!initialized) {
    return null;
  }

  // Require authentication for document upload and later steps
  if (!user && registration.currentStep >= 2) {
    return (
      <AuthRedirect
        message="Veuillez vous connecter pour continuer votre demande de carte grise"
        returnPath="/services/carte-grise"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ProgressSteps steps={steps} currentStep={registration.currentStep} />

      <AnimatePresence mode="wait">
        <motion.div
          key={registration.currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          {registration.currentStep === 0 && (
            <ServiceSelector
              formData={registration}
              onUpdate={updateRegistration}
              onNext={handleNext}
            />
          )}
          {registration.currentStep === 1 && (
            <VehicleDetails
              formData={registration}
              onUpdate={updateRegistration}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {registration.currentStep === 2 && (
            <DocumentUpload
              formData={registration}
              onUpdate={updateRegistration}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {registration.currentStep === 3 && (
            <Summary
              formData={registration}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {registration.currentStep === 4 && (
            <Confirmation formData={registration} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
