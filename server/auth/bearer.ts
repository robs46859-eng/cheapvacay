import type { NextFunction, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { ensureFirebaseAdmin } from "../lib/firebase-admin.ts";

export async function requireFirebaseUser(req: Request, res: Response, next: NextFunction) {
  ensureFirebaseAdmin();
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Sign in required." });
    return;
  }
  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    res.status(401).json({ error: "Sign in required." });
    return;
  }
  try {
    const decoded = await getAuth().verifyIdToken(token, true);
    req.userId = decoded.uid;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired session. Sign in again." });
  }
}
