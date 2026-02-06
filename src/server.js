import "dotenv/config";
import express from "express";
import conversationsRoutes from "./routes/conversations.routes.js";
import messagesRoutes from "./routes/messages.routes.js";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import webhooksRoutes from "./routes/webhooks.routes.js";

const app = express();

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

console.log("PORT ENV:", process.env.PORT);

app.use(express.json());

app.use("/conversations", conversationsRoutes);

app.use("/messages", messagesRoutes);

app.use("/auth", authRoutes);

app.use("/webhooks", webhooksRoutes);

app.listen(env.port, "0.0.0.0", () => {
  console.log(`🚀 API rodando na porta ${env.port}`);
});
