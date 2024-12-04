"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Vehicle } from "@/types/vehicle";
import { db, storage } from "@/lib/firebase/config";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { X, Upload, Eye, Loader2 } from "lucide-react";
import { VehiclePreview } from "./VehiclePreview";
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
    }
  );
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  const onDrop = async (acceptedFiles: File[]) => {
    const uploadedUrls: string[] = [];
    for (const file of acceptedFiles) {
      const storageRef = ref(storage, `vehicles/${Date.now()}_${file.name}`);

      // Create upload task
      const uploadTask = uploadBytes(storageRef, file);

      // Track progress
      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

      try {
        await uploadTask;
        const url = await getDownloadURL(storageRef);
        uploadedUrls.push(url);

        // Update progress to complete
        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...uploadedUrls],
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
  });

  const handleRemoveImage = async (url: string, index: number) => {
    try {
      // Delete from Storage
      const imageRef = ref(storage, url);
      await deleteObject(imageRef);

      // Update form data
      setFormData((prev) => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index),
      }));
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (vehicle?.id) {
        await updateDoc(doc(db, "vehicles", vehicle.id), {
          ...formData,
          updatedAt: Date.now(),
        });
      } else {
        await addDoc(collection(db, "vehicles"), {
          ...formData,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      onSuccess();
    } catch (error) {
      console.error("Error saving vehicle:", error);
    }

    setLoading(false);
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

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Nom du véhicule"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="bg-gray-800 text-white"
          required
        />
        <Input
          placeholder="Année"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          className="bg-gray-800 text-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Prix"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="bg-gray-800 text-white"
          required
        />
        <Input
          placeholder="Kilométrage"
          value={formData.mileage}
          onChange={(e) =>
            setFormData({ ...formData, mileage: e.target.value })
          }
          className="bg-gray-800 text-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          value={formData.fuel}
          onValueChange={(value) => setFormData({ ...formData, fuel: value })}
        >
          <SelectTrigger className="bg-gray-800 text-white">
            <SelectValue placeholder="Carburant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="essence">Essence</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
            <SelectItem value="hybride">Hybride</SelectItem>
            <SelectItem value="electrique">Électrique</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={formData.transmission}
          onValueChange={(value) =>
            setFormData({ ...formData, transmission: value })
          }
        >
          <SelectTrigger className="bg-gray-800 text-white">
            <SelectValue placeholder="Transmission" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manuelle">Manuelle</SelectItem>
            <SelectItem value="automatique">Automatique</SelectItem>
          </SelectContent>
        </Select>
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
        required
      />

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
        <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-400">
          {isDragActive
            ? "Déposez les images ici..."
            : "Glissez et déposez des images ou cliquez pour sélectionner"}
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
                onClick={() => handleRemoveImage(image, index)}
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
