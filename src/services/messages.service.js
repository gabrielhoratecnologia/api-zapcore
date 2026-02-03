import { text } from "express";
import { firestore } from "./firebase.service.js";
import { db } from "../config/firebase.js";

export async function getMessages({ conversationId, limit, cursor }) {
  let query = firestore
    .collection("messages")
    .where("conversationId", "==", conversationId)
    .orderBy("timestamp", "desc")
    .limit(limit);

  if (cursor) {
    query = query.startAfter(cursor);
  }

  const snap = await query.get();

  const messages = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      from: data.from,
      text: data.text,
      type: data.type,
      timestamp: data.timestamp?.toDate
        ? data.timestamp.toDate().toISOString()
        : data.timestamp
    };
  });

  const last = messages[messages.length - 1];
  const nextCursor = last?.timestamp || null;

  return {
    data: messages.reverse(),
    nextCursor,
  };
}

export async function createClientMessage({
  id,
  conversationId,
  tenantId,
  phone,
  text,
  type,
  senderName,
  senderPhoto,
  timestamp,
}) {
  const ref = db.collection("messages").doc(id);

  await ref.set({
    conversationId,
    tenantId,
    from: "client",
    phone,
    text,
    type,
    senderName: senderName || null,
    senderPhoto: senderPhoto || null,
    createdAt: new Date(),
    timestamp: timestamp ? new Date(timestamp) : new Date(),
    source: "uazapi-webhook",
  });
}