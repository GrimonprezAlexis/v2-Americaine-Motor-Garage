"use client";

import { create } from 'zustand';
import { auth, db } from '@/lib/firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  phone?: string;
  address?: string;
  photoURL?: string | null;
  createdAt: number;
  lastLogin: number;
}

interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserData | null) => void;
  updateProfile: (data: Partial<UserData>) => Promise<void>;
}

const getUserData = async (user: User): Promise<UserData> => {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  const now = Date.now();
  
  if (userDoc.exists()) {
    const userData = userDoc.data() as UserData;
    await updateDoc(userRef, { lastLogin: now });
    return { ...userData, lastLogin: now };
  }
  
  const userData: UserData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    createdAt: now,
    lastLogin: now,
  };
  
  await setDoc(userRef, userData);
  return userData;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await getUserData(userCredential.user);
      set({ user: userData, loading: false });
      return userData; // Retourne les données utilisateur pour la redirection
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const now = Date.now();
      const userData: UserData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: name,
        createdAt: now,
        lastLogin: now,
      };
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      set({ user: userData, loading: false });
      return userData; // Retourne les données utilisateur pour la redirection
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const userData = await getUserData(userCredential.user);
      set({ user: userData, loading: false });
      return userData; // Retourne les données utilisateur pour la redirection
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  setUser: (user: UserData | null) => {
    set({ user, loading: false });
  },

  updateProfile: async (data: Partial<UserData>) => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: Date.now(),
      });
      set({ user: { ...user, ...data } });
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  },
}));