# ClawSpeak 🦞

![CI](https://github.com/bigbadman-lab/clawspeak/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/github/license/bigbadman-lab/clawspeak)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)

**Tone-only voice overlays for agent outputs. Draft → ClawSpeak → final.**

## Introduction

ClawSpeak rewrites text into a selected local voice or persona. Meaning, safety, and capabilities stay unchanged—only tone and style change. It works with OpenAI, Grok (xAI), and any OpenAI-compatible provider. Ship it as an NPM package or as an OpenClaw plugin.

## 20-Second Demo

```ts
import { createVoicedTextAgent, openAICompatAdapter } from "clawspeak";

const adapter = openAICompatAdapter({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4.1-mini"
});

const baseAgent = async (input) => {
  return "Explain what staking is in simple terms.";
};

const glasgowAgent = createVoicedTextAgent({
  agent: baseAgent,
  voiceId: "glaswegian",
  model: adapter
});

console.log(await glasgowAgent(""));
```

## What It Does

- **Deterministic tone rewrite** — Same input and voice yield consistent style.
- **Preserves meaning** — No new facts, no dropped content.
- **Slang cap enforcement** — Per-voice limits; metadata reports overuse.
- **Anti-caricature guardrails** — Flags heavy phonetic spelling and banned phrases.
- **Clarity heuristics** — Optional warnings for long sentences or complex wording.
- **Provider-agnostic** — OpenAI, Grok (xAI), and any OpenAI-compatible API.
- **Multiple regional and stylistic voices** — Including blunt and ultra-polite modes.

## Voices

- east_end_londoner
- scouse
- glaswegian
- geordie
- dublin
- new_yorker
- texan
- southern_us
- californian
- overly_polite
- very_rude
- raig_bait_chef

Voices are designed to remain broadly understandable, avoid stereotypes, and preserve meaning exactly.

Use `listVoices()` for labels and descriptions.

## Install

```bash
npm i clawspeak
```

## Usage (OpenAI)

```ts
import { listVoices, applyVoice, openAICompatAdapter } from "clawspeak";

const adapter = openAICompatAdapter({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4.1-mini",
  baseUrl: "https://api.openai.com/v1"
});

const res = await applyVoice({
  text: "Explain this in 3 bullet points.",
  voiceId: "glaswegian",
  model: adapter,
  options: { strength: 0.55, returnMetadata: true }
});

console.log(res.text);
console.log(res.meta);
```

## Usage (Grok / xAI)

Same API; swap base URL and model:

```ts
const adapter = openAICompatAdapter({
  apiKey: process.env.XAI_API_KEY,
  model: "grok-2-latest",
  baseUrl: "https://api.x.ai/v1"
});

const res = await applyVoice({ text: "...", voiceId: "dublin", model: adapter });
console.log(res.text);
```

## Local voice testing (no OpenClaw required)

`applyVoice` requires a **ModelAdapter** and calls an LLM to perform the rewrite, so an API key is required. You can test voices locally without OpenClaw using the repo script.

**Steps:**

```bash
pnpm install
pnpm --filter clawspeak build
export LLM_API_KEY="sk-..."
node scripts/test-raig.mjs
```

**Optional env vars:**

- **LLM_MODEL** — Model id (default example: `gpt-4o-mini`).
- **LLM_BASE_URL** — For OpenAI-compatible providers (e.g. Grok/xAI); omit for OpenAI.

The script uses `LLM_API_KEY` or `OPENAI_API_KEY` and runs the `raig_bait_chef` voice on a sample draft. Minimal usage in code:

```ts
import { applyVoice, openAICompatAdapter } from "clawspeak";

const model = openAICompatAdapter({
  apiKey: process.env.LLM_API_KEY,
  model: process.env.LLM_MODEL || "gpt-4o-mini",
  baseUrl: process.env.LLM_BASE_URL,
});

const res = await applyVoice({ text: "Your draft.", voiceId: "raig_bait_chef", model });
console.log(res.text);
```

## OpenClaw Plugin

The **@clawspeak/openclaw** plugin exposes ClawSpeak as tools for OpenClaw-compatible agents:

- **clawspeak_list** — List available voices.
- **clawspeak_apply** — Rewrite text into a voice.
- **clawspeak_preview** — Preview a voice on sample text.

The plugin ships with a **SKILL.md** so agents know when and how to use the overlay. See `packages/openclaw` and [packages/openclaw/README.md](packages/openclaw/README.md).

## Repo Structure

```
packages/clawspeak   — Core library (voices, adapter, guardrails, createVoicedAgent)
packages/openclaw    — OpenClaw plugin + Skill
examples/node-basic  — Minimal Node example with .env
```

## License

MIT
