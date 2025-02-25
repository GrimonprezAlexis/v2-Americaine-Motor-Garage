"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  ArrowLeft,
  FileText,
  MapPin,
  Car,
  Mail,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils/format";

interface SummaryProps {
  formData: any;
  onNext: () => void;
  onBack: () => void;
}

export function Summary({ formData, onNext, onBack }: SummaryProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email.trim()) {
      setError("L'adresse email est obligatoire");
      return;
    }
    // Valider le format de l'email avec une regex simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("L'adresse email n'est pas valide");
      return;
    }
    formData.email = email;
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <FileText className="w-12 h-12 mx-auto text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Récapitulatif de votre demande
        </h2>
        <p className="text-gray-400">
          Vérifiez les informations avant de valider
        </p>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-500" />
            Démarche
          </h3>
          <p className="text-gray-300">{formData.service}</p>
        </div>

        <Separator className="bg-gray-800" />

        <div>
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
            Localisation
          </h3>
          <p className="text-gray-300">{formData.postalCode}</p>
        </div>

        <Separator className="bg-gray-800" />

        <div>
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Car className="w-5 h-5 mr-2 text-blue-500" />
            Véhicule
          </h3>
          <p className="text-gray-300">{formData.plateNumber}</p>
        </div>

        <Separator className="bg-gray-800" />

        <div>
          <h3 className="text-lg font-medium text-white mb-4">
            Documents fournis
          </h3>
          <ul className="space-y-2">
            {Object.entries(formData.documents || {}).map(
              ([key, files]: [string, any]) => (
                <li key={key} className="text-gray-300">
                  {key}: {files.length} fichier(s)
                </li>
              )
            )}
          </ul>
        </div>

        <Separator className="bg-gray-800" />

        <div>
          <h3 className="text-lg font-medium text-white mb-4">
            Montant à régler
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Taxes et redevances</span>
              <span className="text-white">{formatPrice(formData.price)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Frais de service</span>
              <span className="text-white">
                {formatPrice(formData.serviceFee)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="text-gray-300">Total TTC</span>
              <span className="text-2xl font-bold text-white">
                {formatPrice(formData.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800" />

        <div>
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-blue-500" />
            Email de contact
          </h3>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="bg-gray-800 border-gray-700 text-white"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <p className="text-sm text-gray-400">
              Nous utiliserons cette adresse pour vous contacter concernant
              votre demande
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 bg-gray-800 hover:bg-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Envoyer la demande
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}
