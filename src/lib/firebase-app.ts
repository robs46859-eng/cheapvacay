import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider, getToken, type AppCheck } from "firebase/app-check";
import { getAuth, type Auth } from "firebase/auth";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function createOrGetApp(): FirebaseApp {
  if (getApps().length) {
    return getApp();
  }
  if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
    throw new Error("Missing Vite env: VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID");
  }
  return initializeApp(config);
}

export const firebaseApp: FirebaseApp = createOrGetApp();
export const firebaseAuth: Auth = getAuth(firebaseApp);

const recaptchaSiteKey = import.meta.env.VITE_APPCHECK_RECAPTCHA_SITE_KEY?.trim() || "";
const debugToken = import.meta.env.VITE_APPCHECK_DEBUG_TOKEN?.trim();

if (import.meta.env.DEV && debugToken) {
  const g = globalThis as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean };
  g.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken === "true" ? true : debugToken;
}

/** Set when `VITE_APPCHECK_RECAPTCHA_SITE_KEY` is present (register the web app in Firebase App Check → reCAPTCHA v3). */
export const firebaseAppCheck: AppCheck | null = recaptchaSiteKey
  ? initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaV3Provider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    })
  : null;

export async function getAppCheckTokenForApi(): Promise<string | null> {
  if (!firebaseAppCheck) {
    return null;
  }
  const { token } = await getToken(firebaseAppCheck, false);
  return token;
}
