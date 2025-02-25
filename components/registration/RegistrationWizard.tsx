"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ServiceSelector } from "./steps/ServiceSelector";
import { VehicleDetails } from "./steps/VehicleDetails";
import { DocumentUpload } from "./steps/DocumentUpload";
import { Summary } from "./steps/Summary";
import { Confirmation } from "./steps/Confirmation";
import { ProgressSteps } from "./ProgressSteps";
import { useRegistrationStore } from "@/store/registrationStore";
import { ScrollArea } from "@/components/ui/scroll-area";

const steps = [
  "Sélection du service",
  "Détails du véhicule",
  "Documents requis",
  "Récapitulatif",
  "Confirmation",
];

export function RegistrationWizard() {
  const registration = useRegistrationStore();
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    useRegistrationStore.persist.rehydrate();
    setMounted(true);
  }, []);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [registration.currentStep]);

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < registration.currentStep) {
      registration.setStep(stepIndex);
    }
  };

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

  if (!mounted) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12 px-4 md:px-0">
        <ProgressSteps
          steps={steps}
          currentStep={registration.currentStep}
          onStepClick={handleStepClick}
        />
      </div>

      <ScrollArea className="h-[calc(100vh-200px)] px-4 md:px-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={registration.currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="pb-8"
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
      </ScrollArea>
    </div>
  );
}
