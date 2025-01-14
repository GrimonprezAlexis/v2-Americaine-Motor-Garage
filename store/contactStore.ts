"use client";

import { create } from "zustand";
import { Vehicle } from "@/types/vehicle";

interface ContactState {
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  clearSelectedVehicle: () => void;
}

export const useContactStore = create<ContactState>((set) => ({
  selectedVehicle: null,
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  clearSelectedVehicle: () => set({ selectedVehicle: null }),
}));
