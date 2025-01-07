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

export async function createVehicle(
  data: Omit<Vehicle, "id">
): Promise<string> {
  const vehicle = {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const docRef = await addDoc(collection(db, "vehicles"), vehicle);
  return docRef.id;
}

export async function uploadVehicleImage(
  vehicleId: string,
  file: File
): Promise<string> {
  try {
    // Upload to S3 with path including vehicle ID
    const url = await uploadToS3(file, `vehicles/${vehicleId}`);

    // Update vehicle document in Firestore with the new image URL
    const vehicleRef = doc(db, "vehicles", vehicleId);
    await updateDoc(vehicleRef, {
      images: arrayUnion(url),
      updatedAt: Date.now(),
    });

    return url;
  } catch (error) {
    console.error("Error uploading vehicle image:", error);
    throw new Error("Failed to upload image");
  }
}

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

export async function deleteVehicle(id: string): Promise<void> {
  await deleteDoc(doc(db, "vehicles", id));
}
