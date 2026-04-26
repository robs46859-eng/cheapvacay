/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  /** reCAPTCHA v3 site key from Firebase App Check (required for production API when enforcement is on). */
  readonly VITE_APPCHECK_RECAPTCHA_SITE_KEY?: string;
  /** Optional. Debug token for local dev (Firebase console → App Check → Manage debug tokens). */
  readonly VITE_APPCHECK_DEBUG_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
