import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { listVoices, createVoicedAgent, openAICompatAdapter } from 'clawspeak';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath, override: true });

console.log('Using env file:', envPath);
console.log('API_KEY prefix:', process.env.API_KEY ? process.env.API_KEY.slice(0, 7) : '(missing)');
console.log('MODEL:', process.env.MODEL ?? '(not set)');
console.log('PROVIDER:', process.env.PROVIDER ?? 'openai');

const provider = process.env.PROVIDER ?? 'openai';
// openai => https://api.openai.com/v1
// grok  => https://api.x.ai/v1

const baseUrl = provider === 'grok' ? 'https://api.x.ai/v1' : 'https://api.openai.com/v1';

const apiKey = process.env.API_KEY;
const model = process.env.MODEL;

if (!apiKey) throw new Error('Missing API_KEY env var');
if (!model) throw new Error('Missing MODEL env var');

console.log('Available voices:', listVoices());

const adapter = openAICompatAdapter({ apiKey, model, baseUrl });

// Base agent (neutral)
const baseAgent = async (prompt) => {
  return `Explain what ClawSpeak does in 3 short bullet points, then give one example sentence.\n\nPrompt: ${prompt}`;
};

// Voiced agent wrapper
const voiced = createVoicedAgent({
  agent: baseAgent,
  voiceId: 'east_end_londoner',
  model: adapter,
  strength: 0.55,
  includeMeta: true,
  onMeta: (meta) => {
    if (meta.warnings?.length) console.log('ClawSpeak warnings:', meta.warnings);
  }
});

const out = await voiced('Demo request');

console.log('\n--- OUTPUT ---\n');
console.log(out.text);

console.log('\n--- META ---\n');
console.log(out.meta);
