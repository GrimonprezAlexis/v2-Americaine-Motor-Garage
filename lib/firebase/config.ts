"use client";

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCgb8YwThBMw0wD-qsr0Vgh8we9vSuruEA",
  authDomain: "americaineimport-d147b.firebaseapp.com",
  projectId: "americaineimport-d147b",
  storageBucket: "americaineimport-d147b.firebasestorage.app",
  messagingSenderId: "274310009449",
  appId: "1:274310009449:web:dc571f35ea7bec66f348f8",
  measurementId: "G-XLPLGTNNQ5",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (typeof window !== "undefined") {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
}

export { app, auth, db, storage };
