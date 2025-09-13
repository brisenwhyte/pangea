import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  setPersistence, 
  browserLocalPersistence 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
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

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Set persistence to local storage
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to local storage");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
// Add additional scopes if needed
googleProvider.addScope('profile');
googleProvider.addScope('email');
// Optional: Force account selection every time
// googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Export initialized services
export { auth, googleProvider, db };

// Optional: Export the app instance if needed elsewhere
export default app;