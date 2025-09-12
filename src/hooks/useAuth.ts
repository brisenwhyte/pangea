// Enhanced debug version of useAuth.ts
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
  GoogleAuthProvider,
  browserSessionPersistence
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

  // Enhanced mobile detection with more specific checks
  const isMobileDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'iemobile', 'opera mini'];
    const isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword));
    const isSmallScreen = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    console.log('Enhanced device detection:', { 
      userAgent, 
      isMobile, 
      isSmallScreen, 
      isTouchDevice, 
      isIOS,
      isAndroid,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      maxTouchPoints: navigator.maxTouchPoints
    });
    
    return isMobile || (isSmallScreen && isTouchDevice);
  };

  // Handle redirect result with enhanced logging
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        console.log('🔍 Checking for redirect result...');
        console.log('Current URL:', window.location.href);
        console.log('Auth state before redirect check:', auth.currentUser?.uid || 'No user');
        
        const result = await getRedirectResult(auth);
        console.log('Redirect result received:', result);
        
        if (result && result.user) {
          console.log('✅ Redirect login successful:', {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName
          });
          
          // Check if this was a fresh sign-in
          const credential = GoogleAuthProvider.credentialFromResult(result);
          console.log('Credential from result:', credential);
          
        } else {
          console.log('ℹ️ No redirect result found - this is normal if not coming from redirect');
        }
      } catch (error: any) {
        console.error('❌ Error handling redirect result:', {
          code: error.code,
          message: error.message,
          stack: error.stack
        });
        
        // Handle specific redirect errors
        if (error.code === 'auth/web-storage-unsupported') {
          setAuthError('Your browser doesn\'t support web storage. Please enable cookies and try again.');
        } else if (error.code === 'auth/operation-not-allowed') {
          setAuthError('Google sign-in is not enabled. Please contact support.');
        } else {
          setAuthError(`Authentication error: ${error.message}`);
        }
      }
    };

    handleRedirectResult();
  }, []);

  // Auth state listener with enhanced logging
  useEffect(() => {
    console.log('🎯 Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        console.log('🔄 Auth state changed:', {
          userId: firebaseUser?.uid || 'No user',
          email: firebaseUser?.email || 'No email',
          timestamp: new Date().toISOString()
        });
        
        if (firebaseUser) {
          try {
            console.log('👤 Processing authenticated user...');
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data() as User;
              console.log('📋 Existing user loaded from Firestore:', userData);
              setUser(userData);
              setIsNewUser(false);
            } else {
              const tempUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || '',
                currency: 'USD',
                photoURL: firebaseUser.photoURL || undefined,
              };
              console.log('🆕 New user profile created:', tempUser);
              setUser(tempUser);
              setIsNewUser(true);
            }
          } catch (error: any) {
            console.error('❌ Error loading user data from Firestore:', error);
            setAuthError('Failed to load user profile');
          }
        } else {
          console.log('🚪 No authenticated user, clearing state');
          setUser(null);
          setIsNewUser(false);
        }
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  // Enhanced sign in function
  const signInWithGoogle = async () => {
    console.log('🚀 signInWithGoogle initiated');
    console.log('Auth object:', auth);
    console.log('Google provider:', googleProvider);
    
    setAuthLoading(true);
    setAuthError(null);

    try {
      // Test Firebase connection
      console.log('🔗 Testing Firebase connection...');
      console.log('Auth app:', auth.app.name);
      console.log('Auth config:', auth.config);

      // Set persistence with logging
      console.log('💾 Setting persistence...');
      await setPersistence(auth, browserLocalPersistence);
      console.log('✅ Persistence set successfully');

      // Configure provider with detailed logging
      console.log('⚙️ Configuring Google provider...');
      googleProvider.addScope('email');
      googleProvider.addScope('profile');
      googleProvider.setCustomParameters({
        prompt: 'select_account',
         // Remove any domain restriction
      });
      console.log('✅ Provider configured with scopes and custom parameters');

      const isMobile = isMobileDevice();
      console.log(`📱 Authentication method: ${isMobile ? 'REDIRECT' : 'POPUP'}`);

      if (isMobile) {
        console.log('🔄 Starting redirect authentication...');
        console.log('Current location before redirect:', window.location.href);
        
        // Add a small delay to ensure all logging is captured
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await signInWithRedirect(auth, googleProvider);
        console.log('🎯 Redirect initiated (you should be redirected now)');
        
      } else {
        console.log('🪟 Starting popup authentication...');
        
        try {
          const result = await signInWithPopup(auth, googleProvider);
          console.log('✅ Popup authentication successful:', {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName
          });
          
          const credential = GoogleAuthProvider.credentialFromResult(result);
          console.log('🔑 Credential obtained:', credential?.accessToken ? 'Yes' : 'No');
          
        } catch (popupError: any) {
          console.error('❌ Popup authentication failed:', popupError);
          
          if (popupError.code === 'auth/popup-blocked') {
            console.log('🚫 Popup blocked, falling back to redirect...');
            await signInWithRedirect(auth, googleProvider);
          } else {
            throw popupError;
          }
        }
      }
      
    } catch (error: any) {
      console.error('❌ Authentication error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      let errorMessage = 'Authentication failed';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in was cancelled';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Google sign-in is not properly configured';
          break;
        default:
          errorMessage = error.message || 'Unknown authentication error';
      }
      
      setAuthError(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign out with logging
  const signOutUser = async () => {
    try {
      console.log('👋 Signing out user...');
      await signOut(auth);
      console.log('✅ Sign out successful');
    } catch (error: any) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
  };

  // Complete profile with logging
  const completeProfile = async (name: string, currency: string) => {
    if (!user) {
      console.error('❌ Cannot complete profile: no user');
      return;
    }

    const userData: User = {
      ...user,
      name,
      currency,
    };

    try {
      console.log('💾 Saving user profile to Firestore:', userData);
      await setDoc(doc(db, 'users', user.uid), userData);
      setUser(userData);
      setIsNewUser(false);
      console.log('✅ Profile saved successfully');
    } catch (error: any) {
      console.error('❌ Error saving user profile:', error);
      throw error;
    }
  };

  const clearAuthError = () => {
    console.log('🧹 Clearing auth error');
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