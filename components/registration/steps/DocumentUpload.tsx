"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { uploadRegistrationDocument } from "@/lib/api/registrationStorage";

interface DocumentUploadProps {
  formData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const requiredDocuments = [
  {
    id: "identity",
    name: "Pièce d'identité",
    description:
      "Carte d'identité, passeport ou titre de séjour en cours de validité",
  },
  {
    id: "proof_address",
    name: "Justificatif de domicile",
    description: "De moins de 6 mois (facture électricité, gaz, téléphone...)",
  },
  {
    id: "registration",
    name: "Carte grise",
    description: "Carte grise originale du véhicule",
  },
];

export function DocumentUpload({
  formData,
  onUpdate,
  onNext,
  onBack,
}: DocumentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string[]>>(
    {}
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(
    null
  );

  const {
    getRootProps: getDropzoneProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (!currentDocumentId) return;

      setUploading(true);
      try {
        const urls = await Promise.all(
          acceptedFiles.map((file) =>
            uploadRegistrationDocument(formData.id, currentDocumentId, file)
          )
        );

        setUploadedFiles((prev) => ({
          ...prev,
          [currentDocumentId]: [...(prev[currentDocumentId] || []), ...urls],
        }));

        onUpdate({
          documents: { ...formData.documents, [currentDocumentId]: urls },
        });
      } catch (error) {
        setError("Erreur lors du téléchargement des fichiers");
        console.error(error);
      } finally {
        setUploading(false);
      }
    },
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/pdf": [".pdf"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allDocumentsUploaded = requiredDocuments.every(
      (doc) => uploadedFiles[doc.id]?.length > 0
    );

    if (!allDocumentsUploaded) {
      setError("Veuillez télécharger tous les documents requis");
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
        <Upload className="w-12 h-12 mx-auto text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Documents requis</h2>
        <p className="text-gray-400">
          Téléchargez les documents nécessaires à votre demande
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {requiredDocuments.map((doc) => (
            <div key={doc.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-medium">{doc.name}</h3>
                  <p className="text-sm text-gray-400">{doc.description}</p>
                </div>
                {uploadedFiles[doc.id]?.length > 0 ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
              </div>

              <div
                {...getDropzoneProps({
                  onClick: () => setCurrentDocumentId(doc.id),
                })}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
                  ${
                    isDragActive
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
              >
                <input {...getInputProps()} />
                <p className="text-sm text-gray-400">
                  {isDragActive
                    ? "Déposez les fichiers ici..."
                    : "Glissez et déposez vos fichiers ou cliquez pour sélectionner"}
                </p>
              </div>

              {uploadedFiles[doc.id]?.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-green-500">
                    {uploadedFiles[doc.id].length} fichier(s) téléchargé(s)
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

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
            type="submit"
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
      </form>
    </motion.div>
  );
}
