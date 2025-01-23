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
  getDoc,
} from "firebase/firestore";
import { uploadToS3 } from "./s3";
import { RegistrationDocument, RegistrationStatus } from "@/types/registration";

export async function createRegistration(
  userId: string,
  data: Omit<RegistrationDocument, "id" | "status" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    // Check for existing registration with same vehicle info
    const q = query(
      collection(db, "registrations"),
      where("userId", "==", userId),
      where("vehicleInfo.AWN_immat", "==", data.vehicleInfo.AWN_immat),
      where("status", "in", ["pending", "processing"])
    );

    const existingDocs = await getDocs(q);

    // If there's an existing pending or processing registration, return its ID
    if (!existingDocs.empty) {
      const existingDoc = existingDocs.docs[0];
      return existingDoc.id;
    }

    //KEEP THIS CODE FOR EDIT A REGISTER FROM REGISTER DETAIL
    // // If there's an existing pending or processing registration, return its ID
    // if (!existingDocs.empty) {
    //   const existingDoc = existingDocs.docs[0];
    //   const existingData = existingDoc.data();

    //   // Update the existing registration with new data if needed
    //   if (data.documents || data.price !== existingData.price) {
    //     await updateDoc(doc(db, "registrations", existingDoc.id), {
    //       ...data,
    //       updatedAt: Date.now(),
    //     });
    //   }

    //   return existingDoc.id;
    // }

    // If no existing registration found, create a new one
    const registration = {
      ...data,
      userId,
      status: "pending" as RegistrationStatus,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    console.log("registration", registration);
    const docRef = await addDoc(collection(db, "registrations"), registration);
    return docRef.id;
  } catch (error) {
    console.error("Error creating registration:", error);
    throw error;
  }
}

export async function uploadRegistrationDocument(
  registrationId: string,
  documentType: string,
  file: File
): Promise<string> {
  try {
    // Generate a unique filename
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filename = `${timestamp}-${uniqueId}-${safeFileName}`;

    // Upload to S3 with path including registration ID and document type
    const url = await uploadToS3(
      file,
      `registrations/${registrationId}/${documentType}/${filename}`
    );

    // Update registration document in Firestore with the new document URL
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

export async function getUserRegistrations(
  userId: string
): Promise<RegistrationDocument[]> {
  try {
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
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    throw error;
  }
}

export async function updateRegistrationStatus(
  registrationId: string,
  status: RegistrationStatus
): Promise<void> {
  try {
    const registrationRef = doc(db, "registrations", registrationId);
    await updateDoc(registrationRef, {
      status,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error("Error updating registration status:", error);
    throw error;
  }
}
