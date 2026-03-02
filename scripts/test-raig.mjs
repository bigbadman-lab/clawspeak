import {
  listVoices,
  applyVoice,
  openAICompatAdapter,
} from "../packages/clawspeak/dist/index.js";

const voiceId = "raig_bait_chef";
const text =
  "Please review my README and suggest improvements. Keep it clear and actionable.";

console.log("Available voices:");
console.log(listVoices());

console.log("\n--- DRAFT ---\n" + text);

// Pick provider + key from env
const baseURL = process.env.LLM_BASE_URL; // optional (for Grok/xAI or any OpenAI-compatible)
const apiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("Missing LLM_API_KEY (or OPENAI_API_KEY)");

const model = openAICompatAdapter({
  apiKey,
  // adjust if your adapter uses different field names:
  baseURL,
  model: process.env.LLM_MODEL || "gpt-4o-mini",
});

const res = await applyVoice({
  text,
  voiceId,
  model,
  options: { strength: 0.9, returnMetadata: true },
});

console.log("\n--- RAIG BAIT CHEF ---\n" + res.text);
console.log("\n--- META ---\n", res.meta);
