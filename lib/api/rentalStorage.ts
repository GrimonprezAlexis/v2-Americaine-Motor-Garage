import { db } from "@/lib/firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  getDocs,
} from "firebase/firestore";
import { uploadToS3 } from "./s3";
import { RentalVehicle } from "@/types/rental";

/**
 * Récupère tous les véhicules de location
 * @returns Liste des véhicules de location
 */
export async function fetchRentalVehicles(): Promise<RentalVehicle[]> {
  try {
    const q = query(collection(db, "rentalVehicles"), orderBy("order", "asc"));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as RentalVehicle[];
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des véhicules de location:",
      error
    );
    throw error;
  }
}

/**
 * Récupère uniquement les véhicules de location actifs
 * @returns Liste des véhicules de location actifs
 */
export async function fetchActiveRentalVehicles(): Promise<RentalVehicle[]> {
  try {
    const q = query(
      collection(db, "rentalVehicles"),
      where("isActive", "==", true),
      orderBy("order", "asc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as RentalVehicle[];
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des véhicules de location actifs:",
      error
    );
    throw error;
  }
}

/**
 * Crée un nouveau véhicule de location
 * @param data Données du véhicule
 * @returns ID du véhicule créé
 */
export async function createRentalVehicle(
  data: Omit<RentalVehicle, "id">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "rentalVehicles"), {
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de la création du véhicule de location:", error);
    throw error;
  }
}

/**
 * Met à jour un véhicule de location existant
 * @param id ID du véhicule
 * @param data Données à mettre à jour
 */
export async function updateRentalVehicle(
  id: string,
  data: Partial<RentalVehicle>
): Promise<void> {
  try {
    const vehicleRef = doc(db, "rentalVehicles", id);
    await updateDoc(vehicleRef, {
      ...data,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du véhicule de location:",
      error
    );
    throw error;
  }
}

/**
 * Supprime un véhicule de location
 * @param id ID du véhicule à supprimer
 */
export async function deleteRentalVehicle(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "rentalVehicles", id));
  } catch (error) {
    console.error(
      "Erreur lors de la suppression du véhicule de location:",
      error
    );
    throw error;
  }
}

/**
 * Télécharge une image pour un véhicule de location vers S3
 * @param file Fichier image à télécharger
 * @returns URL de l'image téléchargée
 */
export async function uploadRentalVehicleImage(file: File): Promise<string> {
  try {
    // Utiliser uploadToS3 pour télécharger l'image vers S3
    return await uploadToS3(file, "rental_vehicles");
  } catch (error) {
    console.error(
      "Erreur lors du téléchargement de l'image du véhicule de location:",
      error
    );
    throw error;
  }
}
