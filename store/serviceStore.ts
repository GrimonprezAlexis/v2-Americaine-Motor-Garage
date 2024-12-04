"use client";

import { create } from 'zustand';
import { db } from '@/lib/firebase/config';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  where,
  writeBatch,
  serverTimestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { ServicePrice } from '@/types/service';

interface ServiceStore {
  prices: { [key: string]: ServicePrice[] };
  loading: boolean;
  error: string | null;
  fetchPrices: (category: string, subcategory?: string) => () => void;
  addPrice: (price: Omit<ServicePrice, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePrice: (id: string, price: Partial<ServicePrice>) => Promise<void>;
  deletePrice: (id: string, category: string, subcategory?: string) => Promise<void>;
  clearPrices: () => void;
}

export const useServiceStore = create<ServiceStore>((set, get) => ({
  prices: {},
  loading: false,
  error: null,

  clearPrices: () => set({ prices: {}, loading: false, error: null }),

  fetchPrices: (category: string, subcategory?: string) => {
    set({ loading: true, error: null });

    const constraints: QueryConstraint[] = [
      where('category', '==', category),
      orderBy('category'),
    ];

    if (subcategory) {
      constraints.push(where('subcategory', '==', subcategory));
      constraints.push(orderBy('subcategory'));
    }

    constraints.push(orderBy('order'));

    const q = query(collection(db, 'servicePrices'), ...constraints);
    const key = `${category}${subcategory ? `-${subcategory}` : ''}`;

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const priceData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ServicePrice));

        set(state => ({
          prices: {
            ...state.prices,
            [key]: priceData
          },
          loading: false,
          error: null
        }));
      },
      (error) => {
        console.error('Error fetching prices:', error);
        set({ 
          error: 'Erreur lors de la récupération des prix. Vérifiez votre connexion.',
          loading: false 
        });
      }
    );

    return unsubscribe;
  },

  addPrice: async (price) => {
    try {
      set({ loading: true, error: null });
      const key = `${price.category}${price.subcategory ? `-${price.subcategory}` : ''}`;
      const currentPrices = get().prices[key] || [];
      
      await addDoc(collection(db, 'servicePrices'), {
        ...price,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        priceHT: Number(price.priceHT),
        priceTTC: Number(price.priceTTC),
        order: currentPrices.length,
      });
      
      set({ loading: false, error: null });
    } catch (error) {
      console.error('Error adding price:', error);
      set({ 
        error: 'Erreur lors de l\'ajout du prix. Veuillez réessayer.',
        loading: false 
      });
      throw error;
    }
  },

  updatePrice: async (id: string, price: Partial<ServicePrice>) => {
    try {
      set({ loading: true, error: null });
      const priceRef = doc(db, 'servicePrices', id);
      
      await updateDoc(priceRef, {
        ...price,
        updatedAt: serverTimestamp(),
        priceHT: Number(price.priceHT),
        priceTTC: Number(price.priceTTC),
      });

      set({ loading: false, error: null });
    } catch (error) {
      console.error('Error updating price:', error);
      set({ 
        error: 'Erreur lors de la mise à jour du prix. Veuillez réessayer.',
        loading: false 
      });
      throw error;
    }
  },

  deletePrice: async (id: string, category: string, subcategory?: string) => {
    try {
      set({ loading: true, error: null });
      const key = `${category}${subcategory ? `-${subcategory}` : ''}`;
      const currentPrices = get().prices[key] || [];
      
      const batch = writeBatch(db);
      
      // Delete the price
      batch.delete(doc(db, 'servicePrices', id));

      // Update remaining prices order
      const remainingPrices = currentPrices
        .filter(p => p.id !== id)
        .map((p, idx) => ({ ...p, order: idx }));

      remainingPrices.forEach(price => {
        batch.update(doc(db, 'servicePrices', price.id), { order: price.order });
      });

      await batch.commit();
      set({ loading: false, error: null });
    } catch (error) {
      console.error('Error deleting price:', error);
      set({ 
        error: 'Erreur lors de la suppression du prix. Veuillez réessayer.',
        loading: false 
      });
      throw error;
    }
  },
}));