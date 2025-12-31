import dotenv from "dotenv";
dotenv.config();

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || "";
}

export const env = {
  PORT: getEnvVar("PORT", "3000"),
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  DATABASE_URL: getEnvVar("DATABASE_URL"),
  JINA_API_KEY: getEnvVar("JINA_API_KEY"),
  GROQ_API_KEY: getEnvVar("GROQ_API_KEY"),
  NODE_ENV: process.env.NODE_ENV || "development",
};
