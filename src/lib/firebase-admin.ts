import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

const serviceAccount = {
  projectId: getEnv("FIREBASE_PROJECT_ID"),
  clientEmail: getEnv("FIREBASE_CLIENT_EMAIL"),
  privateKey: getEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
};

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApps()[0];

// 🔥 TADY JE KLÍČ
const db = getFirestore(app);
db.settings({ databaseId: "cakemaster" });

export const adminDb = db;
