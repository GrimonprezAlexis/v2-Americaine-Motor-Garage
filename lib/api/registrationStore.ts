import { db, storage } from "@/lib/firebase/config";
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { RegistrationDocument, RegistrationStatus } from "@/types/registration";

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

export async function uploadRegistrationDocument(
  registrationId: string,
  documentType: string,
  file: File
): Promise<string> {
  const path = `registrations/${registrationId}/${documentType}/${file.name}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  const registrationRef = doc(db, "registrations", registrationId);
  await updateDoc(registrationRef, {
    [`documents.${documentType}`]: url,
    updatedAt: Date.now(),
  });

  return url;
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
) {
  const registrationRef = doc(db, "registrations", registrationId);
  await updateDoc(registrationRef, {
    status,
    updatedAt: Date.now(),
  });
}
