import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

const configured = Boolean(projectId && clientEmail && privateKey);

function getApp() {
  if (!configured) {
    throw new Error(
      "Firebase Admin belum dikonfigurasi. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, dan FIREBASE_PRIVATE_KEY di .env.local",
    );
  }
  const apps = getApps();
  if (apps.length > 0) return apps[0]!;
  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey!.replace(/\\n/g, "\n"),
    }),
  });
}

let db: ReturnType<typeof getFirestore> | null = null;

export function getDb() {
  if (!db) db = getFirestore(getApp());
  return db;
}

export function isFirebaseConfigured() {
  return configured;
}

let auth: Auth | null = null;

export function getAuthAdmin() {
  if (!auth) auth = getAuth(getApp());
  return auth;
}