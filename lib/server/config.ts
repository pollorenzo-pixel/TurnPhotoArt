export type ImageProviderName = "fake" | "openai";
export type ImageQuality = "medium" | "high";

const positiveInt = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const operatingMode = {
  aiEnabled: process.env.TURNPHOTOART_AI_ENABLED === "true",
  privateTestEnabled: process.env.TURNPHOTOART_PRIVATE_TEST_ENABLED === "true",
  paused: process.env.TURNPHOTOART_GENERATION_PAUSED !== "false",
  provider: (process.env.TURNPHOTOART_IMAGE_PROVIDER === "openai" ? "openai" : "fake") as ImageProviderName,
  quality: (process.env.TURNPHOTOART_IMAGE_QUALITY === "high" ? "high" : "medium") as ImageQuality,
  dailyRequestLimit: positiveInt(process.env.TURNPHOTOART_DAILY_REQUEST_LIMIT, 6),
  hourlyIpLimit: positiveInt(process.env.TURNPHOTOART_HOURLY_IP_LIMIT, 3),
  globalConcurrencyLimit: positiveInt(process.env.TURNPHOTOART_GLOBAL_CONCURRENCY_LIMIT, 1),
  dailyCostLimitUnits: positiveInt(process.env.TURNPHOTOART_DAILY_COST_LIMIT_UNITS, 1000),
  reservationUnits: positiveInt(process.env.TURNPHOTOART_COST_RESERVATION_UNITS_PER_GENERATION, 100),
} as const;

export function isPrivateFoundationEnabled() {
  return operatingMode.aiEnabled && operatingMode.privateTestEnabled;
}

export function validatePrivateConfiguration(): string[] {
  if (!isPrivateFoundationEnabled()) return ["private_mode_disabled"];
  const errors: string[] = [];
  if (!process.env.TURNPHOTOART_TEST_ACCESS_CODE) errors.push("access_code_missing");
  if (!process.env.TURNPHOTOART_SESSION_SECRET || process.env.TURNPHOTOART_SESSION_SECRET.length < 32) errors.push("session_secret_invalid");
  if (!process.env.SUPABASE_URL) errors.push("database_url_missing");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) errors.push("database_key_missing");
  if (operatingMode.provider === "openai" && !process.env.OPENAI_API_KEY) errors.push("provider_key_missing");
  return errors;
}

export function assertGenerationAllowed() {
  const errors = validatePrivateConfiguration();
  if (errors.length) throw new Error("private_configuration_invalid");
  if (operatingMode.paused) throw new Error("generation_paused");
  if (operatingMode.provider !== "fake" && operatingMode.provider !== "openai") throw new Error("provider_not_allowed");
}
