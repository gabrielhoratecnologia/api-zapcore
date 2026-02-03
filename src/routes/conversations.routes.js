import { Router } from "express";
import { listConversations } from "../controllers/conversations.controller.js";
import { firestore } from "../services/firebase.service.js";

const router = Router();

router.get("/", listConversations);

// AGENTE ASSUME UMA CONVERSA
router.post("/:conversationId/assign", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const ref = firestore.collection("conversations").doc(conversationId);

    const result = await firestore.runTransaction(async (tx) => {
      const snap = await tx.get(ref);

      if (!snap.exists) {
        throw new Error("NOT_FOUND");
      }

      const data = snap.data();

      if (data.assignedTo && data.assignedTo !== userId) {
        return {
          conflict: true,
          assignedTo: data.assignedTo,
        };
      }

      if (data.assignedTo === userId) {
        return {
          alreadyAssigned: true,
        };
      }

      tx.update(ref, {
        assignedTo: userId,
        status: "assigned",
        updatedAt: new Date().toISOString(),
      });

      return { assigned: true };
    });

    if (result.conflict) {
      return res.status(409).json({
        ok: false,
        error: "Conversation already assigned",
        assignedTo: result.assignedTo,
      });
    }

    if (result.alreadyAssigned) {
      return res.json({
        ok: true,
        conversationId,
        assignedTo: userId,
        message: "Already assigned to this user",
      });
    }

    return res.json({
      ok: true,
      conversationId,
      assignedTo: userId,
    });
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ error: "Conversation not found" });
    }

    console.error("ASSIGN CONVERSATION TX ERROR", err);
    res.status(500).json({ error: "Internal error" });
  }
});


export default router;
