import { db, storage } from "@/lib/firebase/config";
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { RentalVehicle } from "@/types/rental";

export async function fetchRentalVehicles(): Promise<RentalVehicle[]> {
  try {
    const q = query(collection(db, "rentalVehicles"), orderBy("order", "asc"));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as RentalVehicle[];
  } catch (error) {
    console.error("Error fetching rental vehicles:", error);
    throw error;
  }
}

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
    console.error("Error fetching active rental vehicles:", error);
    throw error;
  }
}

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
    console.error("Error creating rental vehicle:", error);
    throw error;
  }
}

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
    console.error("Error updating rental vehicle:", error);
    throw error;
  }
}

export async function deleteRentalVehicle(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "rentalVehicles", id));
  } catch (error) {
    console.error("Error deleting rental vehicle:", error);
    throw error;
  }
}

export async function uploadRentalVehicleImage(file: File): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileName = `rental_vehicles/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading rental vehicle image:", error);
    throw error;
  }
}
