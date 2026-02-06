import "dotenv/config";

const isProd = process.env.NODE_ENV === "production";

if (isProd && !process.env.PORT) {
  throw new Error("PORT não definida (Railway)");
}

export const env = {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  defaultTenantId: process.env.DEFAULT_TENANT_ID,
};
