import { useState, useEffect } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../config/firebase";
import { User } from "../types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // 🔹 Utility: detect mobile device
  const isMobileDevice = () => {
    const ua = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      ua
    );
  };

  // 🔹 Handle redirect result once after returning from Google
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          await processUser(result.user, true);
        }
      } catch (error: any) {
        console.error("Redirect error:", error);
        setAuthError(error.message);
      }
    };

    checkRedirect();
  }, []);

  // 🔹 Auth state listener (covers refresh + popup login)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await processUser(firebaseUser, false);
      } else {
        setUser(null);
        setIsNewUser(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Common user processing
  const processUser = async (firebaseUser: FirebaseUser, fromRedirect: boolean) => {
    try {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUser(userDoc.data() as User);
        setIsNewUser(false);
      } else {
        const tempUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "",
          currency: "USD",
          photoURL: firebaseUser.photoURL || undefined,
        };
        setUser(tempUser);
        setIsNewUser(true);

        // Only save new users if it's fresh login
        if (fromRedirect) {
          await setDoc(userDocRef, tempUser);
        }
      }
    } catch (err) {
      console.error("Error processing user:", err);
      setAuthError("Failed to load user profile");
    }
  };

  // 🔹 Sign in
  const signInWithGoogle = async () => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      await setPersistence(auth, browserLocalPersistence);

      if (isMobileDevice()) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        if (result?.user) {
          await processUser(result.user, true);
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setAuthError(error.message || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  // 🔹 Sign out
  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
    setIsNewUser(false);
  };

  // 🔹 Complete profile
  const completeProfile = async (name: string, currency: string) => {
    if (!user) return;

    const userData: User = {
      ...user,
      name,
      currency,
    };

    await setDoc(doc(db, "users", user.uid), userData);
    setUser(userData);
    setIsNewUser(false);
  };

  return {
    user,
    loading,
    isNewUser,
    authError,
    authLoading,
    signInWithGoogle,
    signOutUser,
    completeProfile,
    clearAuthError: () => setAuthError(null),
  };
};
