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
import { FileText, ArrowRight, Download } from "lucide-react";
import { REGISTRATION_SERVICES } from "@/types/registration";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ServiceSelectorProps {
  formData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

export function ServiceSelector({
  formData,
  onUpdate,
  onNext,
}: ServiceSelectorProps) {
  const [error, setError] = useState("");
  const selectedService = formData.service
    ? REGISTRATION_SERVICES[formData.service]
    : null;

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
              {Object.entries(REGISTRATION_SERVICES).map(([key, service]) => (
                <SelectItem key={key} value={key}>
                  {service.name}
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

        {selectedService && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {selectedService.name}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {selectedService.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Documents requis :
                </h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {selectedService.requiredDocuments.map((doc, index) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              </div>

              {/* <Button
                type="button"
                variant="outline"
                className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                onClick={() =>
                  window.open(selectedService.documentUrl, "_blank")
                }
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger les documents à remplir
              </Button> */}
            </CardContent>
          </Card>
        )}

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Continuer
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>
    </motion.div>
  );
}
