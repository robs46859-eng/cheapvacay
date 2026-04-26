import { cert, initializeApp, getApps, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let initialized = false;

export function ensureFirebaseAdmin() {
  if (initialized) return;
  if (getApps().length) {
    initialized = true;
    return;
  }

  const json = process.env.FIREBASE_SERVICE_ACCOUNT?.trim();
  const hasAdc = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim());

  if (json) {
    initializeApp({ credential: cert(JSON.parse(json)) });
  } else if (hasAdc) {
    initializeApp({ credential: applicationDefault() });
  } else {
    throw new Error(
      "Set FIREBASE_SERVICE_ACCOUNT (full service account JSON) or GOOGLE_APPLICATION_CREDENTIALS (path to the JSON file).",
    );
  }
  initialized = true;
}

export { getAuth, getFirestore };
