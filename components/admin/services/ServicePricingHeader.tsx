"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

interface ServicePricingHeaderProps {
  title: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isAdding: boolean;
  isEditing: boolean;
  onAdd: () => void;
}

export function ServicePricingHeader({
  title,
  searchTerm,
  onSearchChange,
  isAdding,
  isEditing,
  onAdd,
}: ServicePricingHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        <div className="relative flex-1 md:flex-initial">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un service..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-gray-800 text-white w-full md:w-64"
          />
        </div>
        {!isAdding && !isEditing && (
          <Button
            onClick={onAdd}
            className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un tarif
          </Button>
        )}
      </div>
    </div>
  );
}