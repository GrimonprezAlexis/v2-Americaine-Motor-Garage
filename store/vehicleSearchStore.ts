"use client";

import { create } from "zustand";

interface VehicleSearchRequest {
  searchType: string;
  duration: string;
  subject?: string;
  message?: string;
}

interface VehicleSearchState {
  searchRequest: VehicleSearchRequest | null;
  setSearchRequest: (request: VehicleSearchRequest | null) => void;
  clearSearchRequest: () => void;
}

export const useVehicleSearchStore = create<VehicleSearchState>((set) => ({
  searchRequest: null,
  setSearchRequest: (request) => set({ searchRequest: request }),
  clearSearchRequest: () => set({ searchRequest: null }),
}));
