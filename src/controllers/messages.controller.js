import { getMessages } from "../services/messages.service.js";

export async function listMessages(req, res) {
  try {
    const rawConversationId = req.query.conversationId;
    const rawLimit = req.query.limit;
    const rawCursor = req.query.cursor;

    const conversationId = String(rawConversationId || "").trim();
    const limit = Number(rawLimit) || 30;
    const cursor = rawCursor ? new Date(rawCursor) : null;

    if (!conversationId) {
      return res.status(400).json({ error: "conversationId is required" });
    }

    const result = await getMessages({
      conversationId,
      limit,
      cursor,
    });

    return res.json({
      ok: true,
      ...result,
    });
  } catch (err) {
    console.error("LIST MESSAGES ERROR", err);
    return res.status(500).json({ error: "Failed to list messages" });
  }
}
