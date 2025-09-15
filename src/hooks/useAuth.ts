// useAuth.ts
import { useState, useEffect, useCallback } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  signInWithPopup,
  setPersistence,
  indexedDBLocalPersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: number;
}

export function useAuth() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- normalize firebase user into our user type ---
  const processUser = async (fbUser: FirebaseUser, isNew?: boolean) => {
    if (!fbUser) return;

    const userData: UserData = {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName,
      photoURL: fbUser.photoURL,
      createdAt: Date.now(),
    };

    if (isNew) {
      const ref = doc(db, "users", fbUser.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, userData);
        console.log("🆕 Created new user doc:", fbUser.uid);
      }
    }

    setUser(userData);
    console.log("✅ User processed:", fbUser.uid);
  };

  // --- sign in with Google ---
  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      // Force persistence to IndexedDB for Safari/iOS safety
      await setPersistence(auth, indexedDBLocalPersistence);
      console.log("🔒 Auth persistence set to IndexedDB");

      try {
        console.log("🪟 Trying popup flow first...");
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
          await processUser(result.user, true);
        }
      } catch (popupError: any) {
        console.warn("⚠️ Popup blocked, falling back to redirect:", popupError?.message);
        sessionStorage.setItem("isRedirectLogin", "true");
        await signInWithRedirect(auth, provider);
      }
    } catch (err: any) {
      console.error("❌ Sign in failed:", err);
      setError(err.message || "Authentication error");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- handle redirect result (if popup blocked) ---
  useEffect(() => {
    const handleRedirect = async () => {
      if (sessionStorage.getItem("redirectHandled")) {
        console.log("⏭️ Redirect result already handled, skipping");
        return;
      }
      sessionStorage.setItem("redirectHandled", "true");

      try {
        console.log("🔄 Checking redirect result...");
        setLoading(true);

        await setPersistence(auth, indexedDBLocalPersistence);
        console.log("🔒 Auth persistence set to IndexedDB");

        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("✅ Redirect user found:", result.user.uid);
          await processUser(result.user, true);

          sessionStorage.removeItem("isRedirectLogin");
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          console.log("ℹ️ No user from redirect result");
        }
      } catch (err: any) {
        console.error("❌ Redirect error:", err);
        setError(err.message || "Redirect login failed");
      } finally {
        setLoading(false);
      }
    };

    handleRedirect();
  }, []);

  // --- listen to auth state changes ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        console.log("📡 Auth state changed: user", fbUser.uid);
        await processUser(fbUser);
      } else {
        console.log("📡 Auth state changed: no user");
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  // --- sign out ---
  const logout = async () => {
    try {
      await signOut(auth);
      console.log("👋 Signed out");
    } catch (err: any) {
      console.error("❌ Sign out failed:", err);
      setError(err.message || "Logout failed");
    }
  };

  return { user, loading, error, signInWithGoogle, logout };
}
