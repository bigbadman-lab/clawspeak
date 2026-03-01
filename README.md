# ClawSpeak 🦞

**Tone-only voice overlays for agent outputs. Draft → ClawSpeak → final.**

## What it is

ClawSpeak rewrites text into a chosen voice or persona. It changes **how** something sounds (tone, style, light regional flavour) without changing meaning, facts, or safety boundaries. Use it as a post-processing step: write a solid draft, run it through ClawSpeak, then ship the rewritten text.

## Quickstart (Node)

From the repo root:

```bash
pnpm install
pnpm -r build
cd examples/node-basic
cp .env.example .env
# Edit .env: set API_KEY, MODEL, and optionally PROVIDER (openai | grok)
pnpm start
```

Or from root: `pnpm --filter clawspeak-node-basic start` (after setting `examples/node-basic/.env`).

## Usage (NPM)

**OpenAI**

```ts
import { listVoices, applyVoice, openAICompatAdapter } from 'clawspeak';

const adapter = openAICompatAdapter({
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'gpt-4.1-mini',
  baseUrl: 'https://api.openai.com/v1'
});

const res = await applyVoice({
  text: 'Explain this in 3 bullet points.',
  voiceId: 'glaswegian',
  model: adapter,
  options: { strength: 0.55, returnMetadata: true }
});
console.log(res.text);
```

**Grok (xAI)** — same API; swap base URL and model:

```ts
const adapter = openAICompatAdapter({
  apiKey: process.env.XAI_API_KEY!,
  model: 'grok-2-latest',
  baseUrl: 'https://api.x.ai/v1'
});

const res = await applyVoice({ text: '...', voiceId: 'dublin', model: adapter });
```

## OpenClaw plugin

The **@clawspeak/openclaw** plugin exposes ClawSpeak as tools for [OpenClaw](https://github.com/openclaw)-compatible agents.

- **packages/openclaw** — plugin package and `openclaw.plugin.json`
- **Tools:** `clawspeak_list`, `clawspeak_apply`, `clawspeak_preview`
- **Skill:** ships a Skill in `packages/openclaw/skills/clawspeak/` so agents know when and how to use the overlay.

Configure the plugin with `apiKey`, `model`, and optionally `baseUrl` and `defaultVoiceId`. See [packages/openclaw/README.md](packages/openclaw/README.md).

## Voices

Use `listVoices()` for full labels and descriptions. Built-in voice ids:

| Voice id |
|----------|
| `east_end_londoner` |
| `scouse` |
| `glaswegian` |
| `geordie` |
| `dublin` |
| `new_yorker` |
| `texan` |

## Guardrails

- **Slang cap** — per-voice limit on allowed slang per 100 words; metadata reports when exceeded.
- **Anti-caricature** — warnings when banned phrases or heavy phonetic spelling are detected.
- **Clarity** — optional warnings for very long sentences or complex word choice (heuristic, warning-only).

## Repo structure

| Path | Description |
|------|-------------|
| `packages/clawspeak` | Core library: `listVoices`, `applyVoice`, `previewVoice`, OpenAI-compat adapter, voices, guardrails |
| `packages/openclaw` | OpenClaw plugin and ClawSpeak Skill |
| `examples/node-basic` | Minimal Node example using `.env` and `clawspeak` |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
