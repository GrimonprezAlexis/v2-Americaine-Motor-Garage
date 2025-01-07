"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Car,
  Calendar as CalendarIcon,
  Clock,
  Mail,
  Check,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import confetti from "canvas-confetti";

interface RentalVehicle {
  id: string;
  name: string;
  description: string;
  image: string;
  pricePerDay: number;
  features: string[];
}

const vehicles: RentalVehicle[] = [
  {
    id: "1",
    name: "Ford Mustang GT",
    description:
      "Muscle car emblématique, parfaite pour vos événements spéciaux",
    image:
      "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80",
    pricePerDay: 350,
    features: [
      "Moteur V8 5.0L",
      "460 chevaux",
      "Boîte automatique",
      "Intérieur cuir",
      "Système audio premium",
    ],
  },
  {
    id: "2",
    name: "Dodge Challenger",
    description: "Puissance et style américain pour une expérience unique",
    image:
      "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?auto=format&fit=crop&w=800&q=80",
    pricePerDay: 400,
    features: [
      "Moteur HEMI V8",
      "485 chevaux",
      "Mode Sport",
      "Sièges chauffants",
      "Caméra de recul",
    ],
  },
];

export default function RentalPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<RentalVehicle | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle || !selectedDate) return;

    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Show success message
    setShowSuccess(true);

    // Reset form after delay
    setTimeout(() => {
      setSelectedVehicle(null);
      setSelectedDate(undefined);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setShowSuccess(false);
    }, 3000);
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
          <Car className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Location Événementielle
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Rendez votre événement inoubliable avec nos véhicules d'exception
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Vehicles Section */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Nos Véhicules Disponibles
            </h2>

            <div className="grid gap-6">
              {vehicles.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-gray-900 rounded-xl overflow-hidden cursor-pointer transition-all
                    ${
                      selectedVehicle?.id === vehicle.id
                        ? "ring-2 ring-blue-500"
                        : "hover:bg-gray-800"
                    }`}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className="relative h-48 group">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {vehicle.name}
                    </h3>
                    <p className="text-gray-400 mb-4">{vehicle.description}</p>
                    <div className="space-y-2 mb-4">
                      {vehicle.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-gray-400"
                        >
                          <Check className="w-4 h-4 mr-2 text-blue-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-blue-400">
                        {vehicle.pricePerDay}€
                        <span className="text-sm text-gray-400 ml-1">
                          / jour
                        </span>
                      </p>
                      <Button
                        variant="outline"
                        className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                      >
                        Sélectionner
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Booking Form */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-24 space-y-6"
          >
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center"
                >
                  <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Demande envoyée !
                  </h3>
                  <p className="text-gray-400">
                    Nous vous contacterons rapidement pour confirmer votre
                    réservation.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gray-900 rounded-xl p-8"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Réserver un Véhicule
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Calendar */}
                    <div className="bg-gray-800 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <CalendarIcon className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-medium text-white">
                          Date de location
                        </h3>
                      </div>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="bg-gray-800 text-white rounded-lg"
                        disabled={(date) => date < new Date()}
                      />
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <Input
                        placeholder="Nom complet"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <Input
                        type="tel"
                        placeholder="Téléphone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <Textarea
                        placeholder="Message (optionnel)"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="bg-gray-800 border-gray-700 text-white"
                        rows={4}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                      disabled={!selectedVehicle || !selectedDate}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Envoyer la demande
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>

        {/* Additional Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 bg-gray-900 rounded-xl p-8"
        >
          <Clock className="w-12 h-12 text-blue-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Informations Importantes
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Conditions de Location
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-blue-500" />
                  Location minimum 24 heures
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-blue-500" />
                  Caution requise
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-blue-500" />
                  Kilométrage limité inclus
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Services Inclus
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-blue-500" />
                  Assurance tous risques
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-blue-500" />
                  Assistance 24/7
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-blue-500" />
                  Livraison possible
                </li>
              </ul>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
