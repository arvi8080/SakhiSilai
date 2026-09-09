import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

// Check if valid production credentials are provided in .env
export const isFirebaseConfigured = Boolean(
  envApiKey &&
  envProjectId &&
  !envApiKey.includes('YourFirebaseApiKey') &&
  !envApiKey.includes('AIzaSyDkV7TnevzzmKcY')
);

// Your web app's Firebase configuration (supports .env configuration)
const firebaseConfig = {
  apiKey: envApiKey || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: envProjectId || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Only initialize Firebase Auth if valid production credentials are present
export const auth = isFirebaseConfigured ? getAuth(app) : null;
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