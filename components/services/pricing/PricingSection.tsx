"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ServiceCategory } from "./ServiceCategory";
import { SearchBar } from "./SearchBar";
import { SERVICE_CATEGORIES } from "@/types/service";
import { Wrench, Gauge, Car } from "lucide-react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { ServicePrice } from "@/types/service";
import { SearchResults } from "./SearchResults";

const categoryIcons = {
  tires: Car,
  labor: Wrench,
  diagnostic: Gauge,
};

export function PricingSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allPrices, setAllPrices] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "servicePrices"),
      orderBy("category"),
      orderBy("order")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const prices = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ServicePrice[];
        setAllPrices(prices);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching prices:", error);
        setError("Erreur lors du chargement des tarifs");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter prices based on search term
  const filteredPrices = searchTerm
    ? allPrices.filter(
        (price) =>
          price.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
          price.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          price.subcategory?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allPrices;

  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Nos Tarifs
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Des tarifs transparents et adaptés à tous vos besoins. Nos prix
            incluent la main d'œuvre qualifiée et l'utilisation d'équipements
            professionnels.
          </p>

          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>

        {error ? (
          <div className="text-center text-red-500 mb-8">{error}</div>
        ) : searchTerm ? (
          <SearchResults prices={filteredPrices} searchTerm={searchTerm} />
        ) : (
          <div className="grid gap-8">
            <SearchResults prices={filteredPrices} searchTerm={searchTerm} />
          </div>
        )}
      </motion.div>
    </section>
  );
}
