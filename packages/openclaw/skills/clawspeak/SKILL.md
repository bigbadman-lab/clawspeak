---
name: ClawSpeak Persona Overlay
description: Rewrite a draft response into a selected local voice/persona using ClawSpeak tools (tone-only).
tools:
  - clawspeak_list
  - clawspeak_apply
  - clawspeak_preview
---

# ClawSpeak Persona Overlay

Use ClawSpeak as a deterministic post-processing step to change *how* the text sounds (tone/voice), without changing meaning, safety boundaries, or advice quality.

## When to use
- The user asks for a regional/local voice (e.g., "make it sound Glaswegian").
- You want a consistent "house voice" across agents.
- You have a solid draft and want a voice overlay.

## Workflow (recommended)
1) Write the best neutral draft response you can.
2) Call `clawspeak_apply` on the draft text.
3) Return only the rewritten text to the user.

## Tools

### `clawspeak_list`
Lists available voices.
Use this if you need to present options or validate a requested voice.

### `clawspeak_preview`
Quickly preview a voice using a short sample.

### `clawspeak_apply`
Rewrite text into the chosen voice.

Parameters:
- `text` (required)
- `voiceId` (optional; defaults to plugin `defaultVoiceId`)
- `strength` (optional 0..1; default ~0.55)
- `returnMetadata` (optional boolean)

## Rules
- Preserve meaning exactly.
- Do not introduce new facts.
- Keep it respectful and broadly understandable.
- Avoid stereotypes and caricature.
- Keep slang subtle.

## Example pattern

1) Draft:
- Write a clear, neutral answer.

2) Apply voice:
- Call `clawspeak_apply` with the draft and a voiceId.

3) Final:
- Send ONLY the rewritten text to the user (ignore metadata unless debugging).
