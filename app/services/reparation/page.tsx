"use client";

import { motion } from "framer-motion";
import {
  Wrench,
  Settings,
  Clock,
  Shield,
  Hammer,
  Car,
  Truck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { PricingSection } from "@/components/services/pricing/PricingSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useRepairQuoteStore } from "@/store/repairQuoteStore";
import { useRouter } from "next/navigation";

export default function ReparationPage() {
  const router = useRouter();
  const setQuoteRequest = useRepairQuoteStore((state) => state.setQuoteRequest);

  const handleQuoteRequest = (service: string) => {
    setQuoteRequest({
      service,
      subject: `Demande de devis - ${service}`,
      message: `Bonjour,\n\nJe souhaite obtenir un devis pour le service suivant :\n${service}\n\nMerci de me recontacter pour plus d'informations.`,
    });
    router.push("/contact");
  };

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
      forUtility: false,
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
      forUtility: false,
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
      forUtility: false,
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
      forUtility: false,
    },
  ];

  const courtesyVehicles = [
    {
      title: "Véhicule de courtoisie - Vue avant",
      image:
        "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/Personnel/Ve%CC%81hicule+courtoisie+av.jpg",
    },
    {
      title: "Véhicule de courtoisie - Vue arrière",
      image:
        "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/Personnel/Ve%CC%81hicule+courtoisie+ar.jpg",
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 ${
                  service.forUtility ? "md:col-span-2 lg:col-span-3" : ""
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-400">{service.description}</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleQuoteRequest(service.title)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Demander un devis
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Courtesy Vehicles Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-12 mb-20"
        >
          <div className="text-center mb-12">
            <Car className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Véhicule de Courtoisie
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Pour votre confort, nous mettons à votre disposition un véhicule
              de courtoisie pendant la durée des travaux sur votre véhicule
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {courtesyVehicles.map((vehicle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative group"
              >
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

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
                onClick={() => handleQuoteRequest("Service général")}
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Demander un devis
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
