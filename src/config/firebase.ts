import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
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

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);