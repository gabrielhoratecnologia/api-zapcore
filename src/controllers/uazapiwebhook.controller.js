import { upsertConversation } from "../services/conversations.service.js";
import { createClientMessage } from "../services/messages.service.js";

export async function handleUazapiWebhook(req, res) {
  try {
    const TENANT_ID = process.env.DEFAULT_TENANT_ID;

    const data = req.body;
    const message = data?.message;
    const chat = data?.chat;

    console.log("== PAYLOAD RECEBIDO DO UAZAPI ==");
    console.log(JSON.stringify(req.body, null, 2));

    if (!message || !chat) {
      return res.status(200).send("ignored-invalid-payload");
    }

    if (message.wasSentByApi === true) {
      return res.status(200).send("ignored-api");
    }

    if (message.isGroup === true || chat.wa_isGroup === true) {
      return res.status(200).send("ignored-group");
    }

    const phone = chat.phone?.replace(/\D/g, "");
    if (!phone) {
      return res.status(200).send("ignored-invalid-phone");
    }

    const text = message.text || message.content || "";
    const senderName = message.senderName || null;
    const senderPhoto = chat.imagePreview || chat.image || null;
    const messageId = message.id || `fallback_${phone}_${Date.now()}`;

    const conversationId = await upsertConversation({
      tenantId: TENANT_ID,
      phone,
      lastMessage: text || "[mídia]",
      senderName,
      photo: senderPhoto,
    });

    await createClientMessage({
      id: messageId,
      conversationId,
      tenantId: TENANT_ID,
      phone,
      text,
      type: message.type || "text",
      senderName,
      senderPhoto,
      timestamp: message.messageTimestamp,
    });

    return res.status(200).send("ok");
  } catch (err) {
    console.error("UAZAPI WEBHOOK ERROR:", err);
    return res.status(500).send("error");
  }
}
