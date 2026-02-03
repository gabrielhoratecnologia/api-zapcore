import "dotenv/config";
import express from "express";
import conversationsRoutes from "./routes/conversations.routes.js";
import messagesRoutes from "./routes/messages.routes.js";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import webhooksRoutes from "./routes/webhooks.routes.js";

const app = express();

app.use(express.json());

app.use("/conversations", conversationsRoutes);

app.use("/messages", messagesRoutes);

app.use("/auth", authRoutes);

app.use("/webhooks", webhooksRoutes);

app.listen(env.port, () => {
  console.log(`🚀 API rodando na porta ${env.port}`);
});
