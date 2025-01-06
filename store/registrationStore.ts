"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VehicleInfo } from "@/types/registration";

interface RegistrationState {
  currentStep: number;
  service: string;
  postalCode: string;
  plateNumber: string;
  vehicleInfo?: VehicleInfo;
  price?: number;
  documents: Record<string, string[]>;
  setStep: (step: number) => void;
  updateRegistration: (data: Partial<RegistrationState>) => void;
  resetRegistration: () => void;
}

const initialState = {
  currentStep: 0,
  service: "",
  postalCode: "",
  plateNumber: "",
  documents: {},
};

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),

      updateRegistration: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      resetRegistration: () => set(initialState),
    }),
    {
      name: "registration-storage",
      skipHydration: true,
    }
  )
);
