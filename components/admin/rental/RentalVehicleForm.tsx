"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { RentalVehicle, RentalPackage, RentalExtra } from "@/types/rental";
import {
  createRentalVehicle,
  updateRentalVehicle,
  uploadRentalVehicleImage,
} from "@/lib/api/rentalStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Plus,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Alert } from "@/components/ui/alert";
import confetti from "canvas-confetti";

interface RentalVehicleFormProps {
  vehicle: RentalVehicle | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RentalVehicleForm({
  vehicle,
  onSuccess,
  onCancel,
}: RentalVehicleFormProps) {
  const [formData, setFormData] = useState<Omit<RentalVehicle, "id">>({
    name: vehicle?.name || "",
    description: vehicle?.description || "",
    images: vehicle?.images || [],
    features: vehicle?.features || [""],
    packages: vehicle?.packages || [
      { duration: "2h", distance: "50 km", price: "450" },
      { duration: "3h", distance: "80 km", price: "550" },
    ],
    extras: vehicle?.extras || [
      {
        name: "Décoration Florale",
        price: "à partir de 150€",
        description: "Décoration personnalisée selon vos goûts",
      },
      {
        name: "Champagne",
        price: "à partir de 70€",
        description: "Champagne de qualité avec deux coupes",
      },
    ],
    isActive: vehicle?.isActive ?? true,
    order: vehicle?.order ?? 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
    onDrop: async (acceptedFiles) => {
      setLoading(true);
      try {
        // Valider la taille totale des fichiers
        const totalSize = acceptedFiles.reduce(
          (sum, file) => sum + file.size,
          0
        );
        const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB au total

        if (totalSize > MAX_TOTAL_SIZE) {
          throw new Error(
            "La taille totale des fichiers dépasse la limite de 20MB"
          );
        }

        const uploadedUrls = await Promise.all(
          acceptedFiles.map(async (file) => {
            try {
              // Initialiser la progression à 0%
              setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

              // Télécharger l'image vers S3
              const url = await uploadRentalVehicleImage(file);

              // Mettre à jour la progression à 100%
              setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));

              return url;
            } catch (error: any) {
              console.error(
                `Erreur lors du téléchargement de ${file.name}:`,
                error
              );
              throw new Error(
                `Erreur lors du téléchargement de ${file.name}: ${error.message}`
              );
            }
          })
        );

        // Mettre à jour les images dans le formulaire
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls],
        }));

        // Effet de confetti pour indiquer le succès
        confetti({
          particleCount: 50,
          spread: 30,
          origin: { y: 0.6 },
        });
      } catch (error: any) {
        console.error("Erreur lors du téléchargement des images:", error);
        setError(error.message || "Erreur lors du téléchargement des images");
      } finally {
        setLoading(false);
      }
    },
  });

  // Features management
  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""],
    });
  };

  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  // Packages management
  const addPackage = () => {
    setFormData({
      ...formData,
      packages: [
        ...formData.packages,
        { duration: "", distance: "", price: "" },
      ],
    });
  };

  const updatePackage = (
    index: number,
    field: keyof RentalPackage,
    value: string
  ) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[index] = {
      ...updatedPackages[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      packages: updatedPackages,
    });
  };

  const removePackage = (index: number) => {
    const updatedPackages = [...formData.packages];
    updatedPackages.splice(index, 1);
    setFormData({
      ...formData,
      packages: updatedPackages,
    });
  };

  // Extras management
  const addExtra = () => {
    setFormData({
      ...formData,
      extras: [...formData.extras, { name: "", price: "", description: "" }],
    });
  };

  const updateExtra = (
    index: number,
    field: keyof RentalExtra,
    value: string
  ) => {
    const updatedExtras = [...formData.extras];
    updatedExtras[index] = {
      ...updatedExtras[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      extras: updatedExtras,
    });
  };

  const removeExtra = (index: number) => {
    const updatedExtras = [...formData.extras];
    updatedExtras.splice(index, 1);
    setFormData({
      ...formData,
      extras: updatedExtras,
    });
  };

  // Image management
  const removeImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === formData.images.length - 1)
    ) {
      return;
    }

    const newImages = [...formData.images];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    [newImages[index], newImages[newIndex]] = [
      newImages[newIndex],
      newImages[index],
    ];

    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Valider le formulaire
      if (!formData.name) {
        throw new Error("Le nom du véhicule est requis");
      }

      if (formData.images.length === 0) {
        throw new Error("Au moins une image est requise");
      }

      if (formData.features.some((f) => !f.trim())) {
        throw new Error("Toutes les caractéristiques doivent être remplies");
      }

      if (
        formData.packages.some((p) => !p.duration || !p.distance || !p.price)
      ) {
        throw new Error("Tous les champs des forfaits doivent être remplis");
      }

      if (formData.extras.some((e) => !e.name || !e.price)) {
        throw new Error(
          "Tous les champs des services additionnels doivent être remplis"
        );
      }

      // Enregistrer dans la base de données
      if (vehicle?.id) {
        await updateRentalVehicle(vehicle.id, formData);
      } else {
        await createRentalVehicle(formData);
      }

      // Effet de confetti pour indiquer le succès
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      onSuccess();
    } catch (err: any) {
      console.error("Erreur lors de l'enregistrement du véhicule:", err);
      setError(err.message || "Erreur lors de l'enregistrement du véhicule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-gray-900 rounded-xl p-8"
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        {vehicle
          ? "Modifier le véhicule de location"
          : "Ajouter un véhicule de location"}
      </h2>

      {error && (
        <Alert className="bg-red-500/10 text-red-500 border-red-500/50">
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Informations de base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du véhicule</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="order">Ordre d'affichage</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="isActive">Véhicule actif</Label>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Caractéristiques</CardTitle>
            <Button
              type="button"
              size="sm"
              onClick={addFeature}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Caractéristique"
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeFeature(index)}
                  disabled={formData.features.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Packages */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Forfaits</CardTitle>
          <Button
            type="button"
            size="sm"
            onClick={addPackage}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.packages.map((pkg, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-medium">
                    Forfait {index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removePackage(index)}
                    disabled={formData.packages.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor={`pkg-duration-${index}`}>Durée</Label>
                    <Input
                      id={`pkg-duration-${index}`}
                      value={pkg.duration}
                      onChange={(e) =>
                        updatePackage(index, "duration", e.target.value)
                      }
                      placeholder="ex: 2h"
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`pkg-distance-${index}`}>Distance</Label>
                    <Input
                      id={`pkg-distance-${index}`}
                      value={pkg.distance}
                      onChange={(e) =>
                        updatePackage(index, "distance", e.target.value)
                      }
                      placeholder="ex: 50 km"
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`pkg-price-${index}`}>Prix</Label>
                    <Input
                      id={`pkg-price-${index}`}
                      value={pkg.price}
                      onChange={(e) =>
                        updatePackage(index, "price", e.target.value)
                      }
                      placeholder="ex: 450"
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Extras */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Services additionnels</CardTitle>
          <Button
            type="button"
            size="sm"
            onClick={addExtra}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.extras.map((extra, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-medium">
                    Service {index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeExtra(index)}
                    disabled={formData.extras.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor={`extra-name-${index}`}>Nom</Label>
                    <Input
                      id={`extra-name-${index}`}
                      value={extra.name}
                      onChange={(e) =>
                        updateExtra(index, "name", e.target.value)
                      }
                      placeholder="ex: Décoration Florale"
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`extra-price-${index}`}>Prix</Label>
                    <Input
                      id={`extra-price-${index}`}
                      value={extra.price}
                      onChange={(e) =>
                        updateExtra(index, "price", e.target.value)
                      }
                      placeholder="ex: à partir de 150€"
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`extra-description-${index}`}>
                      Description
                    </Label>
                    <Input
                      id={`extra-description-${index}`}
                      value={extra.description}
                      onChange={(e) =>
                        updateExtra(index, "description", e.target.value)
                      }
                      placeholder="Description du service"
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-600 hover:border-gray-500"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input {...getInputProps()} />
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400">
              {isDragActive
                ? "Déposez les images ici..."
                : "Glissez et déposez des images ou cliquez pour sélectionner"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Formats acceptés: JPG, PNG, WEBP - Max 5MB par image
            </p>
          </div>

          {Object.keys(uploadProgress).length > 0 && (
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-400">{fileName}</span>
                  <span className="text-sm text-gray-400">{progress}%</span>
                </div>
              ))}
            </div>
          )}

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => moveImage(index, "up")}
                        disabled={index === 0}
                        className="bg-gray-800/80 hover:bg-gray-700/80 border-gray-600"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => moveImage(index, "down")}
                        disabled={index === formData.images.length - 1}
                        className="bg-gray-800/80 hover:bg-gray-700/80 border-gray-600"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => removeImage(index)}
                      className="bg-red-500/80 hover:bg-red-600/80 border-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {index === 0 ? "Principale" : `Image ${index + 1}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="bg-gray-700 hover:bg-gray-600"
          disabled={loading}
        >
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {vehicle ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {vehicle ? "Mettre à jour" : "Enregistrer"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
