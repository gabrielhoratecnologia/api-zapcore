// src/services/conversations.service.js
import { firestore } from "./firebase.service.js";
import { db } from "../config/firebase.js";

export async function getConversations({ tenantId, limit = 50 }) {
  const snap = await firestore
    .collection("conversations")
    .where("tenantId", "==", tenantId)
    .orderBy("updatedAt", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      phone: data.phone,
      lastMessage: data.lastMessage || null,
      updatedAt: data.updatedAt?.toDate?.() || null,
      assignedTo: data.assignedTo || null,
      brideName: data.brideName || null,
      weddingDate: data.weddingDate || null,
      status: data.status || "open",
    };
  });
}

export async function upsertConversation({
  tenantId,
  phone,
  lastMessage,
  senderName,
  photo,
}) {
  const convId = `${tenantId}_${phone}`;
  const ref = db.collection("conversations").doc(convId);
  const snap = await ref.get();

  if (snap.exists) {
    await ref.update({
      lastMessage,
      updatedAt: new Date(),
    });
  } else {
    await ref.set({
      id: convId,
      phone,
      tenantId,
      status: "open",
      assignedTo: null,
      assignedByName: senderName || null,
      lastMessage,
      photo: photo || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return convId;
}