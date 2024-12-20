"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, ArrowRight } from "lucide-react";

const SERVICES = [
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

interface ServiceSelectorProps {
  formData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

export function ServiceSelector({ formData, onUpdate, onNext }: ServiceSelectorProps) {
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.service || !formData.postalCode) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    if (!/^\d{5}$/.test(formData.postalCode)) {
      setError("Code postal invalide");
      return;
    }
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
          Sélectionnez votre démarche
        </h2>
        <p className="text-gray-400">
          Choisissez le type de démarche et renseignez votre code postal
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Select
            value={formData.service}
            onValueChange={(value) => onUpdate({ service: value })}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Type de démarche" />
            </SelectTrigger>
            <SelectContent>
              {SERVICES.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="Code postal"
            value={formData.postalCode}
            onChange={(e) => onUpdate({ postalCode: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white"
            maxLength={5}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Continuer
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>
    </motion.div>
  );
}