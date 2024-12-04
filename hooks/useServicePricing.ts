"use client";

import { useState, useCallback, useEffect } from "react";
import { useServiceStore } from "@/store/serviceStore";
import { ServicePrice } from "@/types/service";
import confetti from "canvas-confetti";

export function useServicePricing(category: string, subcategory?: string) {
  const {
    prices,
    loading,
    error,
    addPrice,
    updatePrice,
    deletePrice,
    fetchPrices,
  } = useServiceStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServicePrice>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const tableKey = `${category}${subcategory ? `-${subcategory}` : ""}`;
  const tablePrices = prices[tableKey] || [];

  const getFilteredPrices = useCallback(() => {
    return tablePrices.filter((price) =>
      price.service.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tablePrices, searchTerm]);

  useEffect(() => {
    const unsubscribe = fetchPrices(category, subcategory);
    return () => unsubscribe();
  }, [category, subcategory, fetchPrices]);

  const calculateTTC = useCallback((ht: number) => {
    return Math.round(ht * 1.2 * 100) / 100;
  }, []);

  // Validation Utility
  const validatePriceForm = (form: Partial<ServicePrice>): boolean => {
    if (!form.service || !form.priceHT) {
      alert("Veuillez remplir tous les champs");
      return false;
    }
    if (isNaN(Number(form.priceHT))) {
      alert("Le prix HT doit être un nombre valide");
      return false;
    }
    return true;
  };

  const handleSave = useCallback(async () => {
    if (!validatePriceForm(editForm)) return;

    const { service, priceHT } = editForm;

    try {
      const priceData = {
        service: service!,
        priceHT: Number(priceHT),
        priceTTC: calculateTTC(Number(priceHT)),
        category,
        subcategory,
      };

      if (isAdding) {
        await addPrice({ ...priceData, order: tablePrices.length });
      } else if (editingId) {
        await updatePrice(editingId, priceData);
      }

      // Reset state after success
      setEditingId(null);
      setEditForm({});
      setIsAdding(false);

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (error) {
      console.error("Error saving price:", error);
    }
  }, [
    editForm,
    isAdding,
    editingId,
    category,
    subcategory,
    tablePrices.length,
    addPrice,
    updatePrice,
    calculateTTC,
  ]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce tarif ?")) {
        await deletePrice(id, category, subcategory);
      }
    },
    [category, subcategory, deletePrice]
  );

  return {
    prices: tablePrices,
    filteredPrices: getFilteredPrices(),
    loading,
    error,
    editingId,
    editForm,
    isAdding,
    searchTerm,
    setEditingId,
    setEditForm,
    setIsAdding,
    setSearchTerm,
    handleSave,
    handleDelete,
    calculateTTC,
  };
}
