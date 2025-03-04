"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RentalVehicle } from "@/types/rental";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, RefreshCw, Eye, Check, X } from "lucide-react";
import {
  deleteRentalVehicle,
  updateRentalVehicle,
} from "@/lib/api/rentalStorage";
import Image from "next/image";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface RentalVehicleListProps {
  vehicles: RentalVehicle[];
  onEdit: (vehicle: RentalVehicle) => void;
  onRefresh: () => Promise<void>;
}

export function RentalVehicleList({
  vehicles,
  onEdit,
  onRefresh,
}: RentalVehicleListProps) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteRentalVehicle(id);
      await onRefresh();
    } catch (error) {
      console.error("Error deleting rental vehicle:", error);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error("Error refreshing rental vehicles:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleActive = async (vehicle: RentalVehicle) => {
    setIsUpdating(vehicle.id);
    try {
      await updateRentalVehicle(vehicle.id, {
        isActive: !vehicle.isActive,
      });
      await onRefresh();
    } catch (error) {
      console.error("Error updating rental vehicle:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          className="bg-gray-800 hover:bg-gray-700"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            Aucun véhicule de location trouvé
          </div>
        ) : (
          vehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-xl overflow-hidden group"
            >
              <div className="relative aspect-video">
                {vehicle.images?.[0] ? (
                  <Image
                    src={vehicle.images[0]}
                    alt={vehicle.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400">Aucune image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(vehicle)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTarget(vehicle.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    <Link href="/services/location" target="_blank">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                  <Badge
                    className={
                      vehicle.isActive ? "bg-green-500" : "bg-gray-500"
                    }
                  >
                    {vehicle.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-white">
                    {vehicle.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActive(vehicle)}
                    disabled={isUpdating === vehicle.id}
                    className={`${
                      vehicle.isActive
                        ? "text-red-400 hover:text-red-300"
                        : "text-green-400 hover:text-green-300"
                    }`}
                  >
                    {isUpdating === vehicle.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : vehicle.isActive ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                  {vehicle.description}
                </p>
                <div className="text-sm text-gray-500">
                  <p>Ordre: {vehicle.order}</p>
                  <p>{vehicle.packages.length} forfaits</p>
                  <p>{vehicle.features.length} caractéristiques</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-gray-900 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Êtes-vous sûr de vouloir supprimer ce véhicule de location ? Cette
              action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
