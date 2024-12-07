// firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import authentication module
import { getFirestore } from "firebase/firestore"; // Import Firestore module

const firebaseConfig = {
  apiKey: "AIzaSyDm1QHxEfwGM4FJIuwt-KBBPjpbvDJea3A",
  authDomain: "to-do-app-33d47.firebaseapp.com",
  projectId: "to-do-app-33d47",
  storageBucket: "to-do-app-33d47.appspot.com",
  messagingSenderId: "822814226575",
  appId: "1:822814226575:web:c75996b91ecf457ec418fa",
  measurementId: "G-3LMH0QM00T",
};

// Initialize Firebase only if not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
