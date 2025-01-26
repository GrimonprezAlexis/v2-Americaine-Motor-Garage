"use client";

import { create } from "zustand";

interface RepairQuote {
  service?: string;
  subject?: string;
  message?: string;
}

interface RepairQuoteState {
  quoteRequest: RepairQuote | null;
  setQuoteRequest: (quote: RepairQuote | null) => void;
  clearQuoteRequest: () => void;
}

export const useRepairQuoteStore = create<RepairQuoteState>((set) => ({
  quoteRequest: null,
  setQuoteRequest: (quote) => set({ quoteRequest: quote }),
  clearQuoteRequest: () => set({ quoteRequest: null }),
}));
