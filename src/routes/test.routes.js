import { Router } from "express";
import { firestore } from "../services/firebase.service.js";

const router = Router();

router.get("/firestore-test", async (req, res) => {
  try {
    const snap = await firestore.collection("conversations").get();

    res.json({
      ok: true,
      count: snap.size,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Firestore error" });
  }
});

export default router;
