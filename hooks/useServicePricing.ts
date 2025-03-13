import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  QueryConstraint,
} from "firebase/firestore";
import { ServicePrice } from "@/types/service";

export function useServicePricing(category: string, subcategory?: string) {
  const [prices, setPrices] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServicePrice>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Build query constraints
      const constraints: QueryConstraint[] = [
        where("category", "==", category),
        orderBy("order", "asc"),
      ];

      if (subcategory) {
        constraints.splice(1, 0, where("subcategory", "==", subcategory));
      }

      // Create and execute query
      const q = query(collection(db, "servicePrices"), ...constraints);

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const priceData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ServicePrice[];
          setPrices(priceData);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching prices:", error);
          setError("Erreur lors du chargement des tarifs");
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up price listener:", err);
      setError("Erreur lors de l'initialisation");
      setLoading(false);
    }
  }, [category, subcategory]);

  const calculateTTC = (ht: number): number => {
    return Math.round(ht * 1.2 * 100) / 100; // 20% TVA
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate form data
      if (!editForm.service || !editForm.priceHT) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      // Create base price data without subcategory
      const basePriceData = {
        service: editForm.service,
        category,
        priceHT: Number(editForm.priceHT),
        priceTTC: calculateTTC(Number(editForm.priceHT)),
        order: editingId ? editForm.order : prices.length,
        description: editForm.description || null,
        updatedAt: Date.now(),
      };

      // Only add subcategory if it exists
      const priceData = subcategory
        ? {
            ...basePriceData,
            subcategory,
          }
        : basePriceData;

      if (editingId) {
        // Update existing price
        await updateDoc(doc(db, "servicePrices", editingId), priceData);
      } else {
        // Add new price
        await addDoc(collection(db, "servicePrices"), {
          ...priceData,
          createdAt: Date.now(),
        });
      }

      // Reset form
      setEditingId(null);
      setEditForm({});
      setIsAdding(false);
      setError(null);
    } catch (err) {
      console.error("Error saving price:", err);
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'enregistrement"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteDoc(doc(db, "servicePrices", id));
    } catch (err) {
      console.error("Error deleting price:", err);
      setError("Erreur lors de la suppression");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Filter prices based on search term
  const filteredPrices = searchTerm
    ? prices.filter(
        (price) =>
          price.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
          price.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : prices;

  return {
    prices: filteredPrices,
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
