import { useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithRedirect, getRedirectResult, signOut, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase'; // Assuming your firebase config is in this path
import { User } from '../types'; // Assuming your User type is defined here

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // This listener is the single source of truth for the user's auth state.
    // It automatically handles the result of a redirect.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in. Check if they are new or existing.
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // User exists in Firestore, set their data.
          const userData = userDoc.data() as User;
          setUser(userData);
          setIsNewUser(false);
        } else {
          // This is a new user who needs to complete their profile.
          // Create a temporary user object from the Google account info.
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            currency: 'USD', // A default value
            photoURL: firebaseUser.photoURL || undefined
          });
          setIsNewUser(true);
        }
      } else {
        // User is signed out.
        setUser(null);
        setIsNewUser(false);
      }
      setLoading(false);
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      // Simple check for mobile user agents
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (!isMobile) {
        // Use popup for a smoother experience on desktop
        await signInWithPopup(auth, googleProvider);
      } else {
        // Use redirect for mobile, as popups are often blocked
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

    // Create the final user data object to save
    const userData: User = {
      ...user,
      name,
      currency
    };

    try {
      // Save the complete profile to Firestore
      await setDoc(doc(db, 'users', user.uid), userData);
      // Update the local state
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
