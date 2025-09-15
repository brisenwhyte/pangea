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
  browserSessionPersistence,
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
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
  };

  // 🔹 Handle redirect result after returning from Google
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        console.log("Checking for redirect result...");
        setAuthLoading(true);

        // Set persistence before checking result
        await setPersistence(
          auth,
          isMobileDevice() ? browserSessionPersistence : browserLocalPersistence
        );

        const result = await getRedirectResult(auth);
        console.log("Redirect result:", result);

        if (result?.user) {
          console.log("✅ Redirect user found:", result.user.uid);
          await processUser(result.user, true);

          // Clean up flags & URL
          sessionStorage.removeItem("isRedirectLogin");
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          console.log("ℹ️ No user in redirect result");
        }
      } catch (error: any) {
        console.error("❌ Redirect error:", error);
        setAuthError(error.message || "Authentication failed");
        sessionStorage.removeItem("isRedirectLogin");
      } finally {
        setAuthLoading(false);
      }
    };

    handleRedirectResult();
  }, []);

  // 🔹 Auth state listener (covers refresh + popup login)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser?.uid);

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
      console.log("Processing user:", firebaseUser.uid, "fromRedirect:", fromRedirect);

      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log("User document exists");
        setUser(userDoc.data() as User);
        setIsNewUser(false);
      } else {
        console.log("User document doesn't exist, creating new user");
        const tempUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "",
          currency: "USD",
          photoURL: firebaseUser.photoURL || undefined,
        };
        setUser(tempUser);
        setIsNewUser(true);

        // Save new user to database
        await setDoc(userDocRef, tempUser);
        console.log("New user saved to database");
      }
    } catch (err) {
      console.error("Error processing user:", err);
      setAuthError("Failed to load user profile");
    } finally {
      setAuthLoading(false);
    }
  };

  // 🔹 Sign in
  const signInWithGoogle = async () => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (isMobileDevice()) {
        console.log("📱 Mobile device detected, using redirect flow");
        await setPersistence(auth, browserSessionPersistence);
        sessionStorage.setItem("isRedirectLogin", "true");
        await signInWithRedirect(auth, googleProvider);
        // Don't set authLoading to false — page will redirect
      } else {
        console.log("💻 Desktop device detected, using popup flow");
        await setPersistence(auth, browserLocalPersistence);
        const result = await signInWithPopup(auth, googleProvider);
        if (result?.user) {
          await processUser(result.user, true);
        }
        setAuthLoading(false);
      }
    } catch (error: any) {
      console.error("❌ Auth error:", error);
      setAuthError(error.message || "Authentication failed");
      sessionStorage.removeItem("isRedirectLogin");
      setAuthLoading(false);
    }
  };

  // 🔹 Sign out
  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
    setIsNewUser(false);
    sessionStorage.removeItem("isRedirectLogin");
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
