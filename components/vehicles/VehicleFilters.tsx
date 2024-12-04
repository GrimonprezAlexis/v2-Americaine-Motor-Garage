"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface VehicleFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export function VehicleFilters({ selectedFilter, onFilterChange }: VehicleFiltersProps) {
  const filters = [
    { id: "all", label: "Tous" },
    { id: "muscle", label: "Muscle Cars" },
    { id: "pickup", label: "Pick-up" },
    { id: "suv", label: "SUV" },
    { id: "classic", label: "Classiques" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-4 mb-8"
    >
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={selectedFilter === filter.id ? "default" : "outline"}
          onClick={() => onFilterChange(filter.id)}
          className={`
            ${selectedFilter === filter.id
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-900 hover:bg-gray-800 text-gray-400"}
            transition-all duration-300
          `}
        >
          {filter.label}
        </Button>
      ))}
    </motion.div>
  );
}