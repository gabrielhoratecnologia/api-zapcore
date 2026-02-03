import { getConversations } from "../services/conversations.service.js";

export async function listConversations(req, res) {
  try {
    const rawTenantId = req.query.tenantId;
    const tenantId = rawTenantId?.trim();

    console.log("LIST CONVERSATIONS", { tenantId });

    if (!tenantId) {
      return res.status(400).json({ error: "tenantId is required" });
    }

    const conversations = await getConversations({ tenantId });

    res.json({
      ok: true,
      data: conversations,
    });
  } catch (err) {
    console.error("listConversations error", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
