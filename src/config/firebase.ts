import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  setPersistence, 
  browserLocalPersistence,
  inMemoryPersistence
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCMr9xN0QTxALxlNjtlYrfm7j726H8HQY4",
  authDomain: "pangea-aa005.firebaseapp.com",
  projectId: "pangea-aa005",
  storageBucket: "pangea-aa005.firebasestorage.app",
  messagingSenderId: "895175948960",
  appId: "1:895175948960:web:fc8ef56c89b3d3878827c5",
  measurementId: "G-051RRG7LCB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Set persistence with better error handling
const initPersistence = async () => {
  try {
    // Try to use local storage first
    await setPersistence(auth, browserLocalPersistence);
    console.log("Auth persistence set to local storage");
  } catch (error) {
    console.warn("Local storage not available, using in-memory persistence");
    try {
      await setPersistence(auth, inMemoryPersistence);
    } catch (err) {
      console.error("Failed to set any persistence:", err);
    }
  }
};

initPersistence();

// Configure Google Auth Provider for better mobile compatibility
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Important: Set custom parameters for mobile devices
googleProvider.setCustomParameters({
  prompt: 'select_account', // Force account selection every time
  display: 'touch' // Optimize for touch devices
});

// Initialize Cloud Firestore
const db = getFirestore(app);

export { auth, googleProvider, db };
export default app;