"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Vehicle } from "@/types/vehicle";
import {
  createVehicle,
  updateVehicle,
  uploadVehicleImage,
} from "@/lib/api/vehicleStorage";
import {
  X,
  Upload,
  Eye,
  Loader2,
  Image as ImageIcon,
  Search,
} from "lucide-react";
import { VehiclePreview } from "./VehiclePreview";
import { calculateRegistrationCost } from "@/lib/api/registration";
import confetti from "canvas-confetti";

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function VehicleForm({
  vehicle,
  onSuccess,
  onCancel,
}: VehicleFormProps) {
  const [formData, setFormData] = useState<Partial<Vehicle>>(
    vehicle || {
      title: "",
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      fuel: "",
      transmission: "",
      engine: "",
      power: "",
      acceleration: "",
      maxSpeed: "",
      description: "",
      images: [],
      registrationIncluded: false,
      isSold: false,
    }
  );
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [plateNumber, setPlateNumber] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
    onDrop: async (acceptedFiles) => {
      setLoading(true);
      try {
        const vehicleId =
          vehicle?.id || (await createVehicle(formData as Omit<Vehicle, "id">));
        const uploadedUrls = await Promise.all(
          acceptedFiles.map(async (file) => {
            setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
            const url = await uploadVehicleImage(vehicleId, file);
            setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
            return url;
          })
        );

        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...uploadedUrls],
        }));

        confetti({
          particleCount: 50,
          spread: 30,
          origin: { y: 0.6 },
        });
      } catch (error) {
        console.error("Error uploading images:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (vehicle?.id) {
        await updateVehicle(vehicle.id, formData);
      } else {
        await createVehicle(formData as Omit<Vehicle, "id">);
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      onSuccess();
    } catch (error) {
      console.error("Error saving vehicle:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async () => {
    if (!plateNumber.trim()) {
      setLookupError("Veuillez saisir un numéro d'immatriculation");
      return;
    }

    setLookupLoading(true);
    setLookupError("");

    try {
      const response = await calculateRegistrationCost(
        plateNumber,
        "73000",
        "1"
      );
      const vehicleInfo = response.data.vehicle;

      setFormData((prev) => ({
        ...prev,
        make: vehicleInfo.AWN_marque,
        model: vehicleInfo.AWN_modele,
        year: vehicleInfo.AWN_date_mise_en_circulation.split("/")[2],
        fuel: vehicleInfo.AWN_energie,
        power: vehicleInfo.AWN_puissance_fiscale,
        title: `${vehicleInfo.AWN_marque} ${vehicleInfo.AWN_modele} ${
          vehicleInfo.AWN_date_mise_en_circulation.split("/")[2]
        }`,
      }));

      confetti({
        particleCount: 50,
        spread: 30,
        origin: { y: 0.6 },
      });
    } catch (error) {
      console.error("Error looking up vehicle:", error);
      setLookupError("Erreur lors de la recherche du véhicule");
    } finally {
      setLookupLoading(false);
    }
  };

  if (preview && formData) {
    return (
      <div className="bg-gray-900 rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Prévisualisation</h2>
          <Button variant="outline" onClick={() => setPreview(false)}>
            <Eye className="w-4 h-4 mr-2" />
            Retour à l'édition
          </Button>
        </div>
        <VehiclePreview vehicle={formData as Vehicle} />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-900 rounded-xl p-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          {vehicle ? "Modifier le véhicule" : "Nouveau véhicule"}
        </h2>
        <Button
          type="button"
          variant="outline"
          onClick={() => setPreview(true)}
        >
          <Eye className="w-4 h-4 mr-2" />
          Prévisualiser
        </Button>
      </div>

      {/* Lookup Section */}
      <div className="space-y-4">
        <Label htmlFor="plateNumber">Recherche par immatriculation</Label>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <span className="text-blue-500 font-bold">F</span>
            </div>
            <Input
              id="plateNumber"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              placeholder="AA-123-AA"
              className="pl-8 bg-gray-800 border-gray-700 text-white uppercase"
            />
          </div>
          <Button
            type="button"
            onClick={handleLookup}
            disabled={lookupLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {lookupLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>
        {lookupError && <p className="text-sm text-red-500">{lookupError}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Titre"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="bg-gray-800 text-white"
        />
        <Input
          placeholder="Année"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          className="bg-gray-800 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Marque"
          value={formData.make}
          onChange={(e) => setFormData({ ...formData, make: e.target.value })}
          className="bg-gray-800 text-white"
        />
        <Input
          placeholder="Modèle"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          className="bg-gray-800 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Prix"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="bg-gray-800 text-white"
        />
        <Input
          placeholder="Kilométrage"
          value={formData.mileage}
          onChange={(e) =>
            setFormData({ ...formData, mileage: e.target.value })
          }
          className="bg-gray-800 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Carburant"
          value={formData.fuel}
          onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
          className="bg-gray-800 text-white"
        />
        <Input
          placeholder="Transmission"
          value={formData.transmission}
          onChange={(e) =>
            setFormData({ ...formData, transmission: e.target.value })
          }
          className="bg-gray-800 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Moteur"
          value={formData.engine}
          onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
          className="bg-gray-800 text-white"
        />
        <Input
          placeholder="Puissance (ch)"
          value={formData.power}
          onChange={(e) => setFormData({ ...formData, power: e.target.value })}
          className="bg-gray-800 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="0-100 km/h (s)"
          value={formData.acceleration}
          onChange={(e) =>
            setFormData({ ...formData, acceleration: e.target.value })
          }
          className="bg-gray-800 text-white"
        />
        <Input
          placeholder="Vitesse max (km/h)"
          value={formData.maxSpeed}
          onChange={(e) =>
            setFormData({ ...formData, maxSpeed: e.target.value })
          }
          className="bg-gray-800 text-white"
        />
      </div>

      <Textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="bg-gray-800 text-white min-h-[100px]"
      />

      <div className="space-y-4">
        <div className="flex items-center space-x-4 py-4">
          <Switch
            id="registrationIncluded"
            checked={formData.registrationIncluded}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, registrationIncluded: checked })
            }
          />
          <Label htmlFor="registrationIncluded" className="text-white">
            Carte grise incluse
          </Label>
        </div>

        <div className="flex items-center space-x-4 py-4">
          <Switch
            id="isSold"
            checked={formData.isSold}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isSold: checked })
            }
          />
          <Label htmlFor="isSold" className="text-white">
            Véhicule vendu
          </Label>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-600 hover:border-gray-500"
          }`}
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

      {formData.images && formData.images.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {formData.images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden"
            >
              <img
                src={image}
                alt={`Vehicle preview ${index + 1}`}
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={() => {
                  const newImages = [...(formData.images || [])];
                  newImages.splice(index, 1);
                  setFormData({ ...formData, images: newImages });
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="bg-gray-700 hover:bg-gray-600"
          disabled={loading}
        >
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
              {vehicle ? "Mise à jour..." : "Publication..."}
            </>
          ) : vehicle ? (
            "Mettre à jour"
          ) : (
            "Publier"
          )}
        </Button>
      </div>
    </form>
  );
}
