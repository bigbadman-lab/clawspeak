import { listVoices, applyVoice, openAICompatAdapter } from 'clawspeak';

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

const draft =
  'Explain what ClawSpeak does in 3 short bullet points, then give one example sentence.';

const res = await applyVoice({
  text: draft,
  voiceId: 'east_end_londoner',
  model: adapter,
  options: { strength: 0.55, returnMetadata: true }
});

console.log('\n--- OUTPUT ---\n');
console.log(res.text);

console.log('\n--- META ---\n');
console.log(res.meta);
