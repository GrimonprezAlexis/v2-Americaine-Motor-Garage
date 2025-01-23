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
  X,
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
import { uploadToS3 } from "@/lib/api/s3";

interface DocumentUploadProps {
  formData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const DocumentUploadZone = ({
  docType,
  existingFiles = [],
  onDrop,
  onRemove,
  hasFiles,
  uploading,
}: {
  docType: string;
  existingFiles?: string[];
  onDrop: (files: File[]) => void;
  onRemove?: (url: string) => void;
  hasFiles: boolean;
  uploading: boolean;
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/pdf": [".pdf"],
    },
    maxSize: 5 * 1024 * 1024,
    disabled: uploading,
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

      {existingFiles.length > 0 && (
        <div className="mb-4 space-y-2">
          {existingFiles.map((url, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-700/50 rounded p-2"
            >
              <span className="text-sm text-gray-300 truncate flex-1">
                Document {index + 1}
              </span>
              {onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(url)}
                  className="hover:bg-gray-600"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-600 hover:border-gray-500"
          } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
            <p className="text-sm text-gray-400">Téléchargement en cours...</p>
          </div>
        ) : (
          <>
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-400">
              {isDragActive
                ? "Déposez les fichiers ici..."
                : "Glissez et déposez vos fichiers ou cliquez pour sélectionner"}
            </p>
          </>
        )}
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
    formData.documents || {}
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const selectedService = useMemo(
    () => REGISTRATION_SERVICES[formData.service],
    [formData.service]
  );

  // useEffect(() => {
  //   async function initializeRegistration() {
  //     if (!user) return;

  //     try {
  //       const id = await createRegistration(user.uid, {
  //         service: formData.service,
  //         vehicleInfo: formData.vehicleInfo,
  //         price: formData.price,
  //         serviceFee: formData.serviceFee,
  //         documents: formData.documents,
  //         userId: user.uid,
  //       });
  //       setRegistrationId(id);
  //     } catch (error) {
  //       console.error("Error creating registration:", error);
  //       setError("Erreur lors de l'initialisation de la demande");
  //     }
  //   }

  //   if (!registrationId) {
  //     initializeRegistration();
  //   }
  // }, [user, formData, registrationId]);

  const handleDrop = async (documentType: string, acceptedFiles: File[]) => {
    // if (!registrationId) {
    //   setError("Erreur: ID de demande non disponible");
    //   return;
    // }

    setUploading(true);
    setError("");

    try {
      // Validate total size of all files
      const totalSize = acceptedFiles.reduce((sum, file) => sum + file.size, 0);
      const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB total
      if (totalSize > MAX_TOTAL_SIZE) {
        throw new Error(
          "La taille totale des fichiers dépasse la limite de 20MB"
        );
      }

      const uploadPromises = acceptedFiles.map(async (file) => {
        try {
          const timestamp = Date.now();
          const uniqueId = Math.random().toString(36).substring(2, 15);
          const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
          const filename = `${timestamp}-${uniqueId}-${safeFileName}`;

          return await uploadToS3(
            file,
            `temp-documents/${user?.uid}/${documentType}/${filename}`
          );
        } catch (error: any) {
          console.error(`Error uploading file ${file.name}:`, error);
          throw new Error(
            `Erreur lors du téléchargement de ${file.name}: ${error.message}`
          );
        }
      });

      const urls = await Promise.all(uploadPromises);

      const updatedFiles = {
        ...uploadedFiles,
        [documentType]: [...(uploadedFiles[documentType] || []), ...urls],
      };

      setUploadedFiles(updatedFiles);
      onUpdate({ documents: updatedFiles });
    } catch (error: any) {
      console.error("Error uploading files:", error);
      setError(error.message || "Erreur lors du téléchargement des fichiers");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (documentType: string, url: string) => {
    const updatedFiles = {
      ...uploadedFiles,
      [documentType]: uploadedFiles[documentType].filter(
        (fileUrl) => fileUrl !== url
      ),
    };
    setUploadedFiles(updatedFiles);
    onUpdate({ documents: updatedFiles });
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

  // if (!registrationId) {
  //   return (
  //     <div className="flex justify-center items-center py-12">
  //       <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
  //     </div>
  //   );
  // }

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
            <DocumentUploadZone
              key={docType}
              docType={docType}
              existingFiles={uploadedFiles[docType] || []}
              onDrop={(files) => handleDrop(docType, files)}
              onRemove={(url) => handleRemoveFile(docType, url)}
              hasFiles={!!uploadedFiles[docType]?.length}
              uploading={uploading}
            />
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
