import { db } from "@/lib/firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { uploadToS3 } from "./s3";
import { Vehicle } from "@/types/vehicle";

/**
 * Crée un nouveau véhicule
 * @param data Données du véhicule
 * @returns ID du véhicule créé
 */
export async function createVehicle(data: Partial<Vehicle>): Promise<string> {
  const vehicle = {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const docRef = await addDoc(collection(db, "vehicles"), vehicle);
  return docRef.id;
}

/**
 * Télécharge une image pour un véhicule vers S3
 * @param vehicleId ID du véhicule
 * @param file Fichier image à télécharger
 * @returns URL de l'image téléchargée
 */
export async function uploadVehicleImage(
  vehicleId: string,
  file: File
): Promise<string> {
  try {
    // Utiliser uploadToS3 pour télécharger l'image vers S3
    const url = await uploadToS3(file, `vehicles/${vehicleId}`);

    // Mettre à jour le document du véhicule dans Firestore avec la nouvelle URL d'image
    const vehicleRef = doc(db, "vehicles", vehicleId);
    await updateDoc(vehicleRef, {
      images: arrayUnion(url),
      updatedAt: Date.now(),
    });

    return url;
  } catch (error) {
    console.error(
      "Erreur lors du téléchargement de l'image du véhicule:",
      error
    );
    throw new Error("Échec du téléchargement de l'image");
  }
}

/**
 * Met à jour un véhicule existant
 * @param id ID du véhicule
 * @param data Données à mettre à jour
 */
export async function updateVehicle(
  id: string,
  data: Partial<Vehicle>
): Promise<void> {
  const vehicleRef = doc(db, "vehicles", id);
  await updateDoc(vehicleRef, {
    ...data,
    updatedAt: Date.now(),
  });
}

/**
 * Supprime un véhicule
 * @param id ID du véhicule à supprimer
 */
export async function deleteVehicle(id: string): Promise<void> {
  await deleteDoc(doc(db, "vehicles", id));
}
