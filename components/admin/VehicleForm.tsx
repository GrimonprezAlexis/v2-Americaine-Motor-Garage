"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Vehicle } from '@/types/vehicle';
import { db, storage } from '@/lib/firebase/config';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Save, X } from 'lucide-react';

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function VehicleForm({ vehicle, onSuccess, onCancel }: VehicleFormProps) {
  const [formData, setFormData] = useState<Partial<Vehicle>>(
    vehicle || {
      title: '',
      make: '',
      model: '',
      year: '',
      price: '',
      description: '',
      images: [],
    }
  );
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (files: FileList) => {
    const uploadedUrls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(storage, `vehicles/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      uploadedUrls.push(url);
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (vehicle?.id) {
        await updateDoc(doc(db, 'vehicles', vehicle.id), {
          ...formData,
          updatedAt: Date.now(),
        });
      } else {
        await addDoc(collection(db, 'vehicles'), {
          ...formData,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
      onSuccess();
      if (!vehicle) {
        setFormData({
          title: '',
          make: '',
          model: '',
          year: '',
          price: '',
          description: '',
          images: [],
        });
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }

    setLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-gray-900 rounded-xl p-6 shadow-xl"
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        {vehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
      </h2>

      <div className="space-y-4">
        <Input
          placeholder="Titre"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="bg-gray-800 text-white"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Marque"
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
            className="bg-gray-800 text-white"
            required
          />
          <Input
            placeholder="Modèle"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="bg-gray-800 text-white"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Année"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="bg-gray-800 text-white"
            required
          />
          <Input
            placeholder="Prix"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="bg-gray-800 text-white"
            required
          />
        </div>

        <Textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-gray-800 text-white"
          required
        />

        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={async (e) => {
            if (e.target.files) {
              const urls = await handleImageUpload(e.target.files);
              setFormData({
                ...formData,
                images: [...(formData.images || []), ...urls],
              });
            }
          }}
          className="bg-gray-800 text-white"
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="bg-gray-700 hover:bg-gray-600"
          >
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {vehicle ? (
              <Save className="w-4 h-4 mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {vehicle ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </div>
      </div>
    </motion.form>
  );
}