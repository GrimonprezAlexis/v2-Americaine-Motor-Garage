"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative max-w-xl mx-auto mb-8"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Rechercher un service (ex: Montage / Équilibrage, vidange, freins, pneus...)"
          className="pl-10 py-6 bg-gray-800/50 border-gray-700 text-white w-full rounded-xl 
                   placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/50"
        />
      </div>
    </motion.div>
  );
}
