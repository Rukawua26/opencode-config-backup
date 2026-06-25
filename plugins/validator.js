// OpenCode Plugin: API Key Validator
// Verifies that configured API keys match expected patterns on startup.
// Runs once per session, zero impact on LLM tokens.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const HOME = process.env.HOME || "/tmp";
const ENV_FILE = join(HOME, ".config/opencode/.env");

const KEY_PATTERNS = [
  {
    var: "GOOGLE_API_KEY",
    label: "Google AI (Gemini)",
    pattern: /^AIza[0-9A-Za-z_-]{35}$/,
    url: "https://aistudio.google.com/app/apikey",
  },
  {
    var: "OPENAI_API_KEY",
    label: "OpenAI",
    pattern: /^sk-[0-9A-Za-z]{20,}$/,
    url: "https://platform.openai.com/api-keys",
  },
  {
    var: "ANTHROPIC_API_KEY",
    label: "Anthropic (Claude)",
    pattern: /^sk-ant-[0-9A-Za-z]{32,}$/,
    url: "https://console.anthropic.com/settings/keys",
  },
  {
    var: "GEMINI_API_KEY",
    label: "Gemini (legacy)",
    pattern: /^AIza[0-9A-Za-z_-]{35}$/,
    url: "https://aistudio.google.com/app/apikey",
  },
  {
    var: "SAKANA_API_KEY",
    label: "Sakana API",
    pattern: /^fish_[0-9a-f]{64}$/,
    url: "https://platform.torafugu.app/api-keys",
  },
];

function loadEnv() {
  if (!existsSync(ENV_FILE)) return {};
  const env = {};
  for (const line of readFileSync(ENV_FILE, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx > 0) env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
  return env;
}

function validate() {
  const env = loadEnv();
  let hasWarnings = false;

  for (const { var: key, label, pattern, url } of KEY_PATTERNS) {
    const value = env[key];
    if (!value || value.startsWith("sk-...") || value.startsWith("MY_")) continue;

    if (!pattern.test(value)) {
      console.warn(
        `[validator] ⚠️  ${key} (${label}) parece tener un formato inválido. ` +
        `Obten una key en: ${url}`
      );
      hasWarnings = true;
    }
  }

  if (!hasWarnings && env["GOOGLE_API_KEY"]) {
    console.log("[validator] ✅ API keys válidas");
  }
}

validate();
