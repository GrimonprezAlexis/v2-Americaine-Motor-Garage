"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ServiceSelector } from "./steps/ServiceSelector";
import { VehicleDetails } from "./steps/VehicleDetails";
import { DocumentUpload } from "./steps/DocumentUpload";
import { Summary } from "./steps/Summary";
import { Confirmation } from "./steps/Confirmation";
import { ProgressSteps } from "./ProgressSteps";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const steps = [
  "Sélection du service",
  "Détails du véhicule",
  "Documents requis",
  "Récapitulatif",
  "Confirmation",
];

export function RegistrationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    service: "",
    postalCode: "",
    plateNumber: "",
    documents: [],
    price: 0,
  });
  const { user } = useAuthStore();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data });
  };

  if (!user && currentStep >= 2) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Connexion requise
        </h2>
        <p className="text-gray-400 mb-8 text-center max-w-md">
          Veuillez vous connecter pour continuer votre demande de carte grise
        </p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <a href="/auth?redirect=/services/carte-grise">
            <LogIn className="w-4 h-4 mr-2" />
            Se connecter
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ProgressSteps steps={steps} currentStep={currentStep} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          {currentStep === 0 && (
            <ServiceSelector
              formData={formData}
              onUpdate={updateFormData}
              onNext={handleNext}
            />
          )}
          {currentStep === 1 && (
            <VehicleDetails
              formData={formData}
              onUpdate={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 2 && (
            <DocumentUpload
              formData={formData}
              onUpdate={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <Summary
              formData={formData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 4 && (
            <Confirmation formData={formData} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}