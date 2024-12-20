"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ServicePrice } from "@/types/service";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Loader2 } from "lucide-react";

interface ServicePriceListProps {
  category: string;
  subcategory?: string;
}

export function ServicePriceList({
  category,
  subcategory,
}: ServicePriceListProps) {
  const [prices, setPrices] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Construire les contraintes de requête
      const constraints: QueryConstraint[] = [
        where("category", "==", category),
        orderBy("order", "asc"),
      ];

      if (subcategory) {
        constraints.splice(1, 0, where("subcategory", "==", subcategory));
      }

      // Créer et exécuter la requête
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

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (prices.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400">
          {subcategory
            ? `Aucun tarif disponible pour ${subcategory}`
            : "Aucun tarif disponible pour cette catégorie"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {prices.map((price, index) => (
        <motion.div
          key={price.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="flex items-center justify-between py-2 px-4 rounded-lg 
                   bg-gray-800/50 hover:bg-gray-800 transition-colors"
        >
          <div className="flex-1">
            <span className="text-gray-300">{price.service}</span>
            {price.description && (
              <p className="text-sm text-gray-500 mt-1">{price.description}</p>
            )}
          </div>
          <div className="flex items-center gap-4 ml-4">
            <span className="font-medium text-white whitespace-nowrap">
              {price.priceTTC.toFixed(2)} € TTC
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
