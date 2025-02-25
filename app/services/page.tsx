"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Wrench, Car, FileText, Calendar } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      title: "Service Carte Grise",
      description: "Gestion complète de vos démarches administratives",
      icon: <FileText className="w-12 h-12" />,
      href: "/services/carte-grise",
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Réparations / Entretien",
      description:
        "Service Multimarques Spécialisé en véhicule Américaines et Européens",
      icon: <Wrench className="w-12 h-12" />,
      href: "/services/reparation",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Vente / Importation",
      description: "Import clé en main USA/CANADA/EUROPE",
      icon: <Car className="w-12 h-12" />,
      href: "/services/vente",
      image:
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Location événement",
      description: "Location de véhicules d'exception",
      icon: <Calendar className="w-12 h-12" />,
      href: "/services/location",
      image:
        "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/Images-services/location_bg.JPG",
      comingSoon: false,
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <main className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nos Services
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Découvrez notre gamme complète de services automobiles
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Link key={index} href={service.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group h-[400px] rounded-2xl overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${service.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
                  <div className="mb-4 transform transition-transform duration-500 group-hover:scale-110">
                    {service.icon}
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-center">
                    {service.title}
                  </h2>
                  <p className="text-lg text-gray-200 text-center max-w-md">
                    {service.description}
                  </p>
                  {service.comingSoon && (
                    <span className="mt-4 px-4 py-2 bg-blue-500 rounded-full text-sm font-semibold">
                      Bientôt disponible
                    </span>
                  )}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
