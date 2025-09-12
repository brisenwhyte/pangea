// useAuth.ts
import { useState, useEffect } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  signInWithPopup,
  setPersistence, 
  browserLocalPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase'; // adjust path if needed
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  // Handle redirect result (important for mobile)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          console.log('Redirect login successful:', result.user);
          // Optionally handle Firestore write here
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      }
    };

    handleRedirectResult();
  }, []);

  // Main auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
            setIsNewUser(false);
          } else {
            // New user, prepare temp profile
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              currency: 'USD',
              photoURL: firebaseUser.photoURL || undefined,
            });
            setIsNewUser(true);
          }
        } else {
          setUser(null);
          setIsNewUser(false);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Sign in with Google (popup on desktop, redirect on mobile)
  const signInWithGoogle = async () => {
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      await setPersistence(auth, browserLocalPersistence);
      if (isMobile) {
        
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Complete profile for new users
  const completeProfile = async (name: string, currency: string) => {
    if (!user) return;

    const userData: User = {
      ...user,
      name,
      currency,
    };

    try {
      await setDoc(doc(db, 'users', user.uid), userData);
      setUser(userData);
      setIsNewUser(false);
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    isNewUser,
    signInWithGoogle,
    signOutUser,
    completeProfile,
  };
};
