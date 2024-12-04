"use client";

import { motion } from "framer-motion";
import { Car } from "lucide-react";
import Image from "next/image";

export default function VentePage() {
  const features = [
    {
      title: "Recherche Personnalisée",
      description: "Nous trouvons le véhicule de vos rêves selon vos critères",
    },
    {
      title: "Import USA & Canada",
      description: "Gestion complète de l'importation de votre véhicule",
    },
    {
      title: "Garantie Véhicule",
      description: "Tous nos véhicules sont garantis pour votre tranquillité",
    },
  ];

  const vehicles = [
    {
      name: "Dodge Challenger",
      image: "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?auto=format&fit=crop&w=800&q=80",
      year: "2023",
    },
    {
      name: "Ford Mustang",
      image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80",
      year: "2022",
    },
    {
      name: "Chevrolet Camaro",
      image: "https://images.unsplash.com/photo-1603553329474-99f95f35394f?auto=format&fit=crop&w=800&q=80",
      year: "2023",
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Car className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Vente & Importation
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Importation clé en main depuis USA/CANADA/EUROPE
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900 rounded-xl p-8 text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Véhicules Disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative group"
              >
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {vehicle.name}
                    </h3>
                    <p className="text-gray-300">{vehicle.year}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center bg-gray-900 rounded-xl p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Vous recherchez un véhicule spécifique ?
          </h2>
          <p className="text-gray-400 mb-8">
            Contactez-nous avec vos critères, nous le trouverons pour vous.
          </p>
          <div className="inline-flex space-x-4">
            <a
              href="/contact"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}