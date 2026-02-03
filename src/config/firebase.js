import admin from "firebase-admin";

const raw = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!raw) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT não configurada");
}

const serviceAccount = JSON.parse(raw);
serviceAccount.private_key = serviceAccount.private_key
  .replace(/\\n/g, "\n")
  .trim();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();