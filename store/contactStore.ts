"use client";

import { create } from "zustand";
import { Vehicle } from "@/types/vehicle";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactState {
  selectedVehicle: Vehicle | null;
  formData: ContactFormData;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  setFormData: (data: Partial<ContactFormData>) => void;
  clearForm: () => void;
}

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export const useContactStore = create<ContactState>((set) => ({
  selectedVehicle: null,
  formData: initialFormData,
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  clearForm: () =>
    set({
      selectedVehicle: null,
      formData: initialFormData,
    }),
}));
