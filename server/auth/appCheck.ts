import type { NextFunction, Request, Response } from "express";
import { getAppCheck } from "firebase-admin/app-check";
import { appCheckEnforce } from "../config.ts";
import { ensureFirebaseAdmin } from "../lib/firebase-admin.ts";

const APP_CHECK_HEADER = "x-firebase-appcheck";

/**
 * When App Check enforcement is on (production by default), requires a valid
 * `X-Firebase-AppCheck` token from the web client. Use with routes that are safe
 * without sign-in (e.g. `GET /destinations`) and before `requireFirebaseUser`.
 */
export async function requireAppCheck(req: Request, res: Response, next: NextFunction) {
  if (!appCheckEnforce) {
    next();
    return;
  }
  ensureFirebaseAdmin();
  const token = (req.header(APP_CHECK_HEADER) || req.header("X-Firebase-AppCheck"))?.trim();
  if (!token) {
    res.status(401).json({ error: "App Check token required." });
    return;
  }
  try {
    await getAppCheck().verifyToken(token);
    next();
  } catch (error) {
    console.error("App Check verification failed:", error);
    res.status(401).json({ error: "Invalid or expired App Check token." });
  }
}
