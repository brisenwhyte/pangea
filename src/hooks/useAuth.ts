import { useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { User } from '../types';
import { signInWithPopup } from "firebase/auth";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      // Check for redirect result first
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          firebaseUser = result.user;
        }
      } catch (error) {
        console.error('Error getting redirect result:', error);
      }

      if (firebaseUser) {
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser(userData);
          setIsNewUser(false);
        } else {
          // New user - needs profile setup
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            currency: 'USD',
            photoURL: firebaseUser.photoURL || undefined
          });
          setIsNewUser(true);
        }
      } else {
        setUser(null);
        setIsNewUser(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

const signInWithGoogle = async () => {
  try {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!isMobile) {
      // Desktop → Popup
      await signInWithPopup(auth, googleProvider);
    } else {
      // Mobile → Redirect
      await signInWithRedirect(auth, googleProvider);
    }
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};


  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const completeProfile = async (name: string, currency: string) => {
    if (!user) return;

    const userData: User = {
      ...user,
      name,
      currency
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
    completeProfile
  };
};