# @clawspeak/openclaw

ClawSpeak OpenClaw plugin: exposes tools to rewrite text into a selected voice/persona (tone-only).

## Tools
- `clawspeak_list` — list available voices
- `clawspeak_apply` — rewrite text into a voice
- `clawspeak_preview` — preview a voice on sample text

## Plugin config

This plugin requires an API key + model.

Suggested config values:

- OpenAI
  - `baseUrl`: `https://api.openai.com/v1`
  - `model`: `gpt-4.1-mini` (or your preferred)
- Grok (xAI)
  - `baseUrl`: `https://api.x.ai/v1`
  - `model`: `grok-2-latest` (or your preferred)

Config fields:
- `apiKey` (required)
- `model` (required)
- `baseUrl` (optional; defaults to OpenAI base)
- `defaultVoiceId` (optional; defaults to `east_end_londoner`)

## Local development

1) Build the monorepo:
```bash
pnpm install
pnpm -r build
```
