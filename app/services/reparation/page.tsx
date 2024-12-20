"use client";

import { motion } from "framer-motion";
import { Wrench, CheckCircle } from "lucide-react";
import { PricingSection } from "@/components/services/pricing/PricingSection";

export default function ReparationPage() {
  const services = [
    {
      title: "Diagnostic Électronique",
      description: "Analyse complète des systèmes électroniques du véhicule",
      features: [
        "Lecture des codes défaut",
        "Diagnostic précis",
        "Solutions adaptées",
      ],
    },
    {
      title: "Entretien Régulier",
      description:
        "Maintenance préventive pour garder votre véhicule en parfait état",
      features: ["Vidange moteur", "Filtration", "Freinage"],
    },
    {
      title: "Réparations Mécaniques",
      description: "Interventions sur tous types de pannes mécaniques",
      features: ["Moteur", "Transmission", "Suspension"],
    },
    {
      title: "Personnalisation",
      description: "Modifications et améliorations sur mesure",
      features: ["Échappement", "Suspension sport", "Optimisation moteur"],
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      <main>
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Wrench className="w-16 h-16 text-blue-500 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Réparation & Entretien
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Service multimarques spécialisé en véhicules américains et
              européens
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900 rounded-xl p-8 hover:bg-gray-800 transition-colors"
              >
                <h3 className="text-2xl font-bold text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        <PricingSection />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-12"
        >
          <div className="text-center bg-gray-900 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">
              Besoin d'un devis ?
            </h2>
            <p className="text-gray-400 mb-8">
              Contactez-nous pour obtenir un devis personnalisé pour votre
              véhicule
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors"
            >
              Demander un devis
            </a>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
