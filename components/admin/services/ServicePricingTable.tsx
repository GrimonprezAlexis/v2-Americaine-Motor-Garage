"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Trash2, Edit2, X, Loader2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { ServicePricingHeader } from "./ServicePricingHeader";
import { useServicePricing } from "@/hooks/useServicePricing";
import confetti from "canvas-confetti";

interface ServicePricingTableProps {
  category: string;
  subcategory?: string;
  title: string;
}

export function ServicePricingTable({
  category,
  subcategory,
  title,
}: ServicePricingTableProps) {
  const {
    filteredPrices,
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
  } = useServicePricing(category, subcategory);

  const onSuccessfulSave = async () => {
    await handleSave();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-900 rounded-xl p-6"
    >
      <ServicePricingHeader
        title={title}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isAdding={isAdding}
        isEditing={!!editingId}
        onAdd={() => {
          setIsAdding(true);
          setEditForm({});
        }}
      />

      {error && (
        <Alert className="mb-6 bg-red-500/10 text-red-500 border-red-500/50">
          {error}
        </Alert>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-400">Prestation</th>
              <th className="text-right py-3 px-4 text-gray-400">Prix HT</th>
              <th className="text-right py-3 px-4 text-gray-400">Prix TTC</th>
              <th className="text-right py-3 px-4 text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isAdding && (
              <tr className="border-b border-gray-800 bg-gray-800/50">
                <td className="py-3 px-4">
                  <Input
                    value={editForm.service || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, service: e.target.value })
                    }
                    placeholder="Nom de la prestation"
                    className="bg-gray-800 text-white"
                  />
                </td>
                <td className="py-3 px-4">
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.priceHT || ""}
                    onChange={(e) => {
                      const ht = Number(e.target.value);
                      setEditForm({
                        ...editForm,
                        priceHT: ht,
                        priceTTC: calculateTTC(ht),
                      });
                    }}
                    placeholder="0.00"
                    className="bg-gray-800 text-white text-right"
                  />
                </td>
                <td className="py-3 px-4 text-right text-gray-400">
                  {editForm.priceHT
                    ? `${calculateTTC(Number(editForm.priceHT)).toFixed(2)} €`
                    : "-"}
                </td>
                <td className="py-3 px-4 text-right">
                  <Button
                    size="sm"
                    onClick={onSuccessfulSave}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 mr-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsAdding(false);
                      setEditForm({});
                    }}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            )}

            {loading && !filteredPrices.length ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Chargement des tarifs...
                </td>
              </tr>
            ) : !filteredPrices.length ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">
                  {searchTerm
                    ? "Aucun résultat trouvé"
                    : "Aucun tarif enregistré"}
                </td>
              </tr>
            ) : (
              filteredPrices.map((price) => (
                <tr key={price.id} className="border-b border-gray-800">
                  <td className="py-3 px-4 text-white">
                    {editingId === price.id ? (
                      <Input
                        value={editForm.service || price.service}
                        onChange={(e) =>
                          setEditForm({ ...editForm, service: e.target.value })
                        }
                        className="bg-gray-800 text-white"
                      />
                    ) : (
                      price.service
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-white">
                    {editingId === price.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editForm.priceHT || price.priceHT}
                        onChange={(e) => {
                          const ht = Number(e.target.value);
                          setEditForm({
                            ...editForm,
                            priceHT: ht,
                            priceTTC: calculateTTC(ht),
                          });
                        }}
                        className="bg-gray-800 text-white text-right"
                      />
                    ) : (
                      `${price.priceHT.toFixed(2)} €`
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-white">
                    {editingId === price.id
                      ? editForm.priceHT
                        ? `${calculateTTC(Number(editForm.priceHT)).toFixed(
                            2
                          )} €`
                        : `${price.priceTTC.toFixed(2)} €`
                      : `${price.priceTTC.toFixed(2)} €`}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {editingId === price.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={onSuccessfulSave}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 mr-2"
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingId(null);
                            setEditForm({});
                          }}
                          className="bg-gray-600 hover:bg-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingId(price.id);
                            setEditForm(price);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 mr-2"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(price.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
