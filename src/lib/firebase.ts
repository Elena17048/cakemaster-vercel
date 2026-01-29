import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  enableNetwork,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * Firebase client config
 * Pouze NEXT_PUBLIC_* proměnné
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

/**
 * Firebase app – singleton
 */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/**
 * 🔥 Firestore – důležité nastavení pro Vercel
 * (řeší "client is offline" + 30s čekání)
 */
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

enableNetwork(db);

/**
 * Ostatní Firebase služby
 */
export const auth = getAuth(app);
export const storage = getStorage(app);

export { app };
