"use client";

import { motion } from "framer-motion";
import {
  Wrench,
  CheckCircle,
  Settings,
  Clock,
  Shield,
  Hammer,
} from "lucide-react";
import { PricingSection } from "@/components/services/pricing/PricingSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ReparationPage() {
  const services = [
    {
      title: "Diagnostic Électronique",
      description: "Analyse complète des systèmes électroniques du véhicule",
      icon: <Settings className="w-8 h-8 text-blue-500" />,
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
      icon: <Hammer className="w-8 h-8 text-blue-500" />,
      features: [
        "Vidange moteur / Filtration",
        "Freinage / Suspension",
        "Distribution / Embrayage",
      ],
    },
    {
      title: "Réparations Mécaniques",
      description: "Interventions sur tous types de pannes mécaniques",
      icon: <Wrench className="w-8 h-8 text-blue-500" />,
      features: [
        "Moteur / Suralimentation",
        "Trains roulants",
        "Transmission / Différentiel",
      ],
    },
    {
      title: "Garantie & Qualité",
      description: "Un Service transparent avec garantie sur nos interventions",
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      features: [
        "Pièce de qualité",
        "Garantie intervention",
        "Devis et Facturation détaillé",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      <main>
        {/* Hero Section */}
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

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-400">{service.description}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <PricingSection />

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-12"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 text-center">
            <Clock className="w-12 h-12 text-blue-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">
              Besoin d'un devis ?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Notre équipe de professionnels est à votre disposition pour
              étudier votre demande et vous proposer un devis personnalisé
              adapté à vos besoins.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Link href="/contact">Demander un devis</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-gray-800 hover:bg-gray-700"
                size="lg"
              >
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
