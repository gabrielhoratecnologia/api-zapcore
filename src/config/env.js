import "dotenv/config";

export const env = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  defaultTenantId: process.env.DEFAULT_TENANT_ID
};
