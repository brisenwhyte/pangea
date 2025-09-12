// useAuth.ts - Debug version with enhanced mobile support
import { useState, useEffect } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  signInWithPopup,
  setPersistence, 
  browserLocalPersistence,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Enhanced mobile detection
  const isMobileDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    console.log('Device detection:', { isMobile, isSmallScreen, isTouchDevice, userAgent });
    return isMobile || (isSmallScreen && isTouchDevice);
  };

  // Handle redirect result (important for mobile)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        console.log('Checking for redirect result...');
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          console.log('Redirect login successful:', result.user);
          // The onAuthStateChanged will handle the user state update
        } else {
          console.log('No redirect result found');
        }
      } catch (error: any) {
        console.error('Error handling redirect result:', error);
        setAuthError(error.message || 'Authentication failed');
      }
    };

    handleRedirectResult();
  }, []);

  // Main auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        console.log('Auth state changed:', firebaseUser?.uid || 'No user');
        
        if (firebaseUser) {
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data() as User;
              console.log('Existing user loaded:', userData);
              setUser(userData);
              setIsNewUser(false);
            } else {
              // New user, prepare temp profile
              const tempUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || '',
                currency: 'USD',
                photoURL: firebaseUser.photoURL || undefined,
              };
              console.log('New user created:', tempUser);
              setUser(tempUser);
              setIsNewUser(true);
            }
          } catch (error) {
            console.error('Error loading user data:', error);
            setAuthError('Failed to load user data');
          }
        } else {
          console.log('No user, clearing state');
          setUser(null);
          setIsNewUser(false);
        }
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  // Enhanced sign in with Google
  const signInWithGoogle = async () => {
    console.log('signInWithGoogle called');
    setAuthLoading(true);
    setAuthError(null);

    try {
      // Set persistence first
      await setPersistence(auth, browserLocalPersistence);
      console.log('Persistence set to local');

      // Configure the provider with additional scopes if needed
      googleProvider.addScope('email');
      googleProvider.addScope('profile');
      
      // Set custom parameters
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });

      const isMobile = isMobileDevice();
      console.log('Is mobile device:', isMobile);

      if (isMobile) {
        console.log('Using redirect method for mobile');
        // For mobile, use redirect
        await signInWithRedirect(auth, googleProvider);
        // Note: After redirect, the page will reload and getRedirectResult will handle the result
      } else {
        console.log('Using popup method for desktop');
        // For desktop, use popup
        const result = await signInWithPopup(auth, googleProvider);
        console.log('Popup sign-in successful:', result.user);
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/popup-blocked') {
        console.log('Popup blocked, falling back to redirect');
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError: any) {
          console.error('Redirect also failed:', redirectError);
          setAuthError('Sign-in failed. Please try again.');
        }
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log('User cancelled the sign-in');
        setAuthError('Sign-in was cancelled');
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.log('User closed the popup');
        setAuthError('Sign-in popup was closed');
      } else {
        setAuthError(error.message || 'Authentication failed');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      console.log('Signing out user');
      await signOut(auth);
    } catch (error: any) {
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
      console.log('Saving user profile:', userData);
      await setDoc(doc(db, 'users', user.uid), userData);
      setUser(userData);
      setIsNewUser(false);
    } catch (error: any) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  };

  // Clear auth error
  const clearAuthError = () => {
    setAuthError(null);
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
    clearAuthError,
  };
};