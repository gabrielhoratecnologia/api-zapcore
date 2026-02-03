import express from "express";
import { handleUazapiWebhook } from "../controllers/uazapiwebhook.controller.js";

const router = express.Router();

router.post("/uazapi", handleUazapiWebhook);

export default router;
