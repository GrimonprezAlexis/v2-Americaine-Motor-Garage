"use client";

import { create } from 'zustand';
import { db, storage } from '@/lib/firebase/config';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Vehicle } from '@/types/vehicle';

interface VehicleStore {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  fetchVehicles: () => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  deleteImage: (url: string) => Promise<void>;
}

export const useVehicleStore = create<VehicleStore>((set, get) => ({
  vehicles: [],
  loading: false,
  error: null,

  fetchVehicles: async () => {
    try {
      set({ loading: true, error: null });
      const q = query(collection(db, 'vehicles'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const vehicles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vehicle[];
      set({ vehicles, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addVehicle: async (vehicle) => {
    try {
      set({ loading: true, error: null });
      const docRef = await addDoc(collection(db, 'vehicles'), {
        ...vehicle,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      const newVehicle = { id: docRef.id, ...vehicle };
      set(state => ({
        vehicles: [newVehicle, ...state.vehicles],
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateVehicle: async (id, vehicle) => {
    try {
      set({ loading: true, error: null });
      await updateDoc(doc(db, 'vehicles', id), {
        ...vehicle,
        updatedAt: Date.now(),
      });
      set(state => ({
        vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...vehicle } : v),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteVehicle: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, 'vehicles', id));
      set(state => ({
        vehicles: state.vehicles.filter(v => v.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  uploadImage: async (file: File) => {
    const storageRef = ref(storage, `vehicles/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },

  deleteImage: async (url: string) => {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  },
}));