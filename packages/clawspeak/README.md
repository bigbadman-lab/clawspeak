# clawspeak 🦞

ClawSpeak is a **tone/voice overlay** for agent outputs.

**Draft → ClawSpeak rewrite → final**

It changes how text sounds (voice/style) without changing meaning, capability, or safety boundaries.

## Install

```bash
npm i clawspeak
```

## Usage (OpenAI)

```ts
import { listVoices, applyVoice, openAICompatAdapter } from 'clawspeak';

const adapter = openAICompatAdapter({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4.1-mini',
  baseUrl: 'https://api.openai.com/v1'
});

console.log(listVoices());

const res = await applyVoice({
  text: 'Explain what ClawSpeak does in 3 bullet points.',
  voiceId: 'glaswegian',
  model: adapter,
  options: { strength: 0.55, returnMetadata: true }
});

console.log(res.text);
console.log(res.meta);
```

## Usage (Grok / xAI)

Grok is OpenAI-compatible. Just swap the base URL + model id:

```ts
import { applyVoice, openAICompatAdapter } from 'clawspeak';

const adapter = openAICompatAdapter({
  apiKey: process.env.XAI_API_KEY,
  model: 'grok-2-latest',
  baseUrl: 'https://api.x.ai/v1'
});

const res = await applyVoice({
  text: 'Summarize this clearly in 4 lines.',
  voiceId: 'dublin',
  model: adapter
});

console.log(res.text);
```

## Voices

Use `listVoices()` to see available voices. ClawSpeak ships with:

- east_end_londoner
- scouse
- glaswegian
- geordie
- dublin
- new_yorker
- texan

## API

- `listVoices()` → voice ids + descriptions
- `applyVoice({ text, voiceId, model, options })` → rewritten text (and optional metadata)
- `previewVoice({ voiceId, sampleText, model, options })` → quick preview
- **`createVoicedAgent({ agent, voiceId, model, strength?, onMeta? })`** → wraps an agent so every response is rewritten into the chosen voice; returns `Promise<ApplyResult>` (always includes `text` and `meta`). Use `onMeta` for warnings/telemetry.
- **`createVoicedTextAgent(opts)`** → same options as `createVoicedAgent`, but returns `Promise<string>` (only the rewritten text).

## Notes

- Keep strength subtle (0.35–0.75).
- Voices are designed to be understandable and avoid stereotypes.
