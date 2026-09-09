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

const firebaseConfig = isFirebaseConfigured ? {
  apiKey: envApiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId}.firebaseapp.com`,
  projectId: envProjectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.firebasestorage.app`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
} : null;

// Initialize Firebase App singleton safely
export const app = firebaseConfig ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)) : null;

// Only initialize services if app is configured
export const auth = (isFirebaseConfigured && app) ? getAuth(app) : null;
export const firestore = (isFirebaseConfigured && app) ? getFirestore(app) : null;
export const storage = (isFirebaseConfigured && app) ? getStorage(app) : null;

/**
 * Upload an image file to Firebase Storage with fallback
 */
export async function uploadImageToFirebase(file: File | Blob, storagePath: string): Promise<string> {
  if (!storage) {
    console.warn('Firebase Storage unavailable, using local preview URL fallback');
    return URL.createObjectURL(file);
  }
  try {
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (err) {
    console.error('Firebase Storage upload error:', err);
    return URL.createObjectURL(file);
  }
}