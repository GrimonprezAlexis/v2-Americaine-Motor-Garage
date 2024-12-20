"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ServicePrice } from "@/types/service";

interface ServiceCategoryProps {
  category: {
    id: string;
    name: string;
    subcategories?: Record<string, string>;
  };
  icon: React.ReactNode;
  prices: ServicePrice[];
  loading: boolean;
}

export function ServiceCategory({
  category,
  icon,
  prices,
  loading,
}: ServiceCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const groupedPrices = prices.reduce((acc, price) => {
    const subcategory = price.subcategory || "default";
    if (!acc[subcategory]) {
      acc[subcategory] = [];
    }
    acc[subcategory].push(price);
    return acc;
  }, {} as Record<string, ServicePrice[]>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-blue-500">{icon}</div>
          <h3 className="text-xl font-semibold text-white">{category.name}</h3>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-gray-400 transition-transform duration-200",
            isExpanded && "transform rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : category.subcategories ? (
              <div className="grid gap-6 p-6">
                {Object.entries(category.subcategories).map(([key, name]) => {
                  const subcategoryPrices = groupedPrices[key] || [];
                  return (
                    <div key={key}>
                      <h4 className="text-lg font-medium text-white mb-4">
                        {name}
                      </h4>
                      {subcategoryPrices.length > 0 ? (
                        <div className="space-y-3">
                          {subcategoryPrices.map((price, index) => (
                            <PriceItem
                              key={price.id}
                              price={price}
                              index={index}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-center py-2">
                          Aucun tarif disponible pour {name}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6">
                {prices.length > 0 ? (
                  <div className="space-y-3">
                    {prices.map((price, index) => (
                      <PriceItem key={price.id} price={price} index={index} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-2">
                    Aucun tarif disponible
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface PriceItemProps {
  price: ServicePrice;
  index: number;
}

function PriceItem({ price, index }: PriceItemProps) {
  return (
    <motion.div
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
  );
}
