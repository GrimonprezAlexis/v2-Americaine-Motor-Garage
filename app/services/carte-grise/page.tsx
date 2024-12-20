"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { RegistrationWizard } from "@/components/registration/RegistrationWizard";

export default function CarteGrisePage() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <FileText className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Service Carte Grise
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Effectuez votre démarche carte grise en quelques clics
          </p>
        </motion.div>

        <RegistrationWizard />
      </main>
    </div>
  );
}