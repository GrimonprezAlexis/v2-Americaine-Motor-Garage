"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, FileText, MapPin, Car } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SummaryProps {
  formData: any;
  onNext: () => void;
  onBack: () => void;
}

export function Summary({ formData, onNext, onBack }: SummaryProps) {
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
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total TTC</span>
            <span className="text-2xl font-bold text-white">
              {formData.price.toFixed(2)} €
            </span>
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
          onClick={onNext}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Envoyer la demande
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}
