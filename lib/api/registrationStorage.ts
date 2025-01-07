import { db } from "@/lib/firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { uploadToS3 } from "./s3";
import { RegistrationDocument, RegistrationStatus } from "@/types/registration";

export async function uploadRegistrationDocument(
  registrationId: string,
  documentType: string,
  file: File
): Promise<string> {
  try {
    console.log(">> uploadToS3", file, registrationId, documentType);
    // Upload to S3 with path including registration ID
    const url = await uploadToS3(
      file,
      `registrations/${registrationId}/${documentType}`
    );

    // Update registration document in Firestore
    const registrationRef = doc(db, "registrations", registrationId);
    await updateDoc(registrationRef, {
      [`documents.${documentType}`]: url,
      updatedAt: Date.now(),
    });

    return url;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw new Error("Failed to upload document");
  }
}

export async function createRegistration(
  userId: string,
  data: Omit<RegistrationDocument, "id" | "status" | "createdAt" | "updatedAt">
): Promise<string> {
  const registration = {
    ...data,
    userId,
    status: "pending" as RegistrationStatus,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const docRef = await addDoc(collection(db, "registrations"), registration);
  return docRef.id;
}

export async function getUserRegistrations(userId: string) {
  const q = query(
    collection(db, "registrations"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as RegistrationDocument[];
}

export async function updateRegistrationStatus(
  registrationId: string,
  status: RegistrationStatus
): Promise<void> {
  const registrationRef = doc(db, "registrations", registrationId);
  await updateDoc(registrationRef, {
    status,
    updatedAt: Date.now(),
  });
}
