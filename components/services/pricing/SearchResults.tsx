"use client";

import { motion } from "framer-motion";
import { ServicePrice } from "@/types/service";
import { SERVICE_CATEGORIES } from "@/types/service";
import { Car, Wrench, Gauge, Truck } from "lucide-react";

const categoryIcons = {
  [SERVICE_CATEGORIES.TIRES.id]: Car,
  [SERVICE_CATEGORIES.LABOR.id]: Wrench,
  [SERVICE_CATEGORIES.DIAGNOSTIC.id]: Gauge,
  [SERVICE_CATEGORIES.UTILITY.id]: Truck,
};

interface SearchResultsProps {
  prices: ServicePrice[];
  searchTerm: string;
}

export function SearchResults({ prices, searchTerm }: SearchResultsProps) {
  // Group prices by category
  const groupedResults = prices.reduce((acc, price) => {
    const category = price.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(price);
    return acc;
  }, {} as Record<string, ServicePrice[]>);

  if (Object.keys(groupedResults).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-gray-400">
          Aucun résultat trouvé pour "{searchTerm}"
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedResults).map(([categoryId, prices]) => {
        const category = Object.values(SERVICE_CATEGORIES).find(
          (c) => c.id === categoryId
        );
        if (!category) return null;

        const Icon = categoryIcons[categoryId];
        return (
          <motion.div
            key={categoryId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-semibold text-white">
                {category.name}
              </h3>
            </div>
            <div className="space-y-3">
              {prices.map((price) => (
                <motion.div
                  key={price.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between py-2 px-4 rounded-lg 
                           bg-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                  <div>
                    <span className="text-gray-300">
                      {price.subcategory && `[${price.subcategory}] - `}
                      {price.service}
                    </span>
                    {price.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {price.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-white">
                      {price.priceTTC.toFixed(2)} € TTC
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
