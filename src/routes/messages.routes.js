import { Router } from "express";
import { listMessages } from "../controllers/messages.controller.js";

const router = Router();

router.get("/", listMessages);

export default router;
