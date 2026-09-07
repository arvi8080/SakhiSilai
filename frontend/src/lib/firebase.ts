import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkV7TnevzzmKcY_Z9PFR9lYUDxgp0K_T0",
  authDomain: "sakhisilai-b7b43.firebaseapp.com",
  projectId: "sakhisilai-b7b43",
  storageBucket: "sakhisilai-b7b43.firebasestorage.app",
  messagingSenderId: "721609239599",
  appId: "1:721609239599:web:765aa59cda065f966faada",
  measurementId: "G-37K6J83ETB"
};

// Check if valid credentials are present
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('YourFirebaseApiKey')
);

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

/**
 * Upload an image file to Firebase Storage
 * @param file File object or Blob
 * @param storagePath Path in storage (e.g. 'custom_requests/123.jpg')
 * @returns Promise<string> Public Download URL
 */
export async function uploadImageToFirebase(file: File | Blob, storagePath: string): Promise<string> {
  try {
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (err) {
    console.error('Firebase Storage upload error:', err);
    throw err;
  }
}