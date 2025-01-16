"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import {
  uploadRegistrationDocument,
  createRegistration,
} from "@/lib/api/registrationStorage";
import { useAuthStore } from "@/store/authStore";
import { REGISTRATION_SERVICES } from "@/types/registration";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DocumentUploadProps {
  formData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const DocumentUploadZone = ({
  docType,
  onDrop,
  hasFiles,
}: {
  docType: string;
  onDrop: (files: File[]) => void;
  hasFiles: boolean;
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/pdf": [".pdf"],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: true,
  });

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-medium">{docType}</h3>
          <p className="text-sm text-gray-400">
            Format accepté : JPG, PNG, PDF - Max 5MB
          </p>
        </div>
        {hasFiles ? (
          <Check className="w-5 h-5 text-green-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-yellow-500" />
        )}
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-600 hover:border-gray-500"
          }`}
      >
        <input {...getInputProps()} />
        <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-400">
          {isDragActive
            ? "Déposez les fichiers ici..."
            : "Glissez et déposez vos fichiers ou cliquez pour sélectionner"}
        </p>
      </div>
    </div>
  );
};

export function DocumentUpload({
  formData,
  onUpdate,
  onNext,
  onBack,
}: DocumentUploadProps) {
  const { user } = useAuthStore();
  const [registrationId, setRegistrationId] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string[]>>(
    {}
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const selectedService = useMemo(
    () => REGISTRATION_SERVICES[formData.service],
    [formData.service]
  );

  useEffect(() => {
    async function initializeRegistration() {
      if (!user) return;

      try {
        const id = await createRegistration(user.uid, {
          service: formData.service,
          vehicleInfo: formData.vehicleInfo,
          price: formData.price,
          serviceFee: formData.serviceFee,
          documents: {},
        });
        setRegistrationId(id);
      } catch (error) {
        console.error("Error creating registration:", error);
        setError("Erreur lors de l'initialisation de la demande");
      }
    }

    if (!registrationId) {
      initializeRegistration();
    }
  }, [user, formData, registrationId]);

  const handleDrop = async (documentType: string, acceptedFiles: File[]) => {
    if (!registrationId) {
      setError("Erreur: ID de demande non disponible");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const urls = await Promise.all(
        acceptedFiles.map((file) =>
          uploadRegistrationDocument(registrationId, documentType, file)
        )
      );

      const updatedFiles = {
        ...uploadedFiles,
        [documentType]: [...(uploadedFiles[documentType] || []), ...urls],
      };

      setUploadedFiles(updatedFiles);
      onUpdate({ documents: updatedFiles });
    } catch (error) {
      console.error("Error uploading files:", error);
      setError("Erreur lors du téléchargement des fichiers");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const missingDocuments = selectedService.requiredDocuments.filter(
      (doc) => !uploadedFiles[doc] || uploadedFiles[doc].length === 0
    );

    if (missingDocuments.length > 0) {
      setError(`Documents manquants : ${missingDocuments.join(", ")}`);
      return;
    }

    onNext();
  };

  if (!registrationId) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <Upload className="w-12 h-12 mx-auto text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Documents requis</h2>
        <p className="text-gray-400">
          Téléchargez les documents nécessaires à votre demande
        </p>
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Documents pour : {selectedService.name}
          </CardTitle>
          <CardDescription className="text-gray-400">
            Tous les documents suivants sont requis pour traiter votre demande
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedService.requiredDocuments.map((docType) => (
            <div key={docType}>
              <DocumentUploadZone
                docType={docType}
                onDrop={(files) => handleDrop(docType, files)}
                hasFiles={!!uploadedFiles[docType]?.length}
              />
              {uploadedFiles[docType]?.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-green-500">
                    {uploadedFiles[docType].length} fichier(s) téléchargé(s)
                  </p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div className="flex justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 bg-gray-800 hover:bg-gray-700"
          disabled={uploading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Téléchargement...
            </>
          ) : (
            <>
              Continuer
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
