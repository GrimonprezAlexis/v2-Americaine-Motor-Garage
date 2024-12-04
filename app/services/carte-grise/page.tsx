"use client";

import { motion } from "framer-motion";
import { FileText, LogIn, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function CarteGrisePage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const services = [
    "CHANGEMENT DE TITULAIRE",
    "PREMIÈRE IMMATRICULATION FRANCAISE",
    "IMMATRICULATION PROVISOIRE WW",
    "DECLARATION ACHAT",
    "DÉCLARATION VENTE",
    "DEMANDE DE DUPLICATA",
    "DEMANDE DE CORRECTION",
    "CHANGEMENT ADRESSE",
    "PASSAGE EN CG COLLECTION +30ANS",
    "CHANGEMENT DONNEES PERSONNELLES",
    "CERTIFICAT DE NON GAGE",
  ];

  const handleStartRequest = () => {
    if (!user) {
      router.push("/auth?redirect=/profile?tab=requests");
    } else {
      router.push("/profile?tab=requests");
    }
  };

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
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Gestion complète de vos démarches administratives
          </p>

          <Button
            onClick={handleStartRequest}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
          >
            {user ? (
              <>
                Démarrer une demande
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            ) : (
              <>
                Se connecter pour démarrer
                <LogIn className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {service}
                </h3>
                <ArrowRight className="w-5 h-5 text-blue-500 transform group-hover:translate-x-1 transition-transform" />
              </div>
              <Button
                onClick={handleStartRequest}
                variant="outline"
                className="w-full mt-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border-blue-500/20 hover:border-blue-500/30"
              >
                {user ? "Démarrer" : "Se connecter"}
              </Button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}