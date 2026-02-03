import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      ...serviceAccount,
      private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
    }),
  });
}

export const firestore = admin.firestore();
export const auth = admin.auth();
