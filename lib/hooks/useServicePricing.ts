"use client";

import { useState, useCallback, useEffect } from 'react';
import { useServiceStore } from '@/store/serviceStore';
import { ServicePrice } from '@/types/service';

export function useServicePricing(category: string, subcategory?: string) {
  const { prices, loading, error, addPrice, updatePrice, deletePrice, fetchPrices } = useServiceStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServicePrice>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const tableKey = `${category}${subcategory ? `-${subcategory}` : ''}`;
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

  const handleSave = useCallback(async () => {
    if (!editForm.service || !editForm.priceHT) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      if (isAdding) {
        await addPrice({
          service: editForm.service,
          priceHT: Number(editForm.priceHT),
          priceTTC: calculateTTC(Number(editForm.priceHT)),
          category,
          subcategory,
          order: tablePrices.length,
        });
      } else if (editingId) {
        await updatePrice(editingId, {
          ...editForm,
          priceTTC: calculateTTC(Number(editForm.priceHT)),
        });
      }

      setEditingId(null);
      setEditForm({});
      setIsAdding(false);
    } catch (err) {
      console.error('Error saving price:', err);
    }
  }, [editForm, isAdding, editingId, category, subcategory, tablePrices.length, addPrice, updatePrice, calculateTTC]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce tarif ?')) {
      await deletePrice(id, category, subcategory);
    }
  }, [category, subcategory, deletePrice]);

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