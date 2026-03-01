# Contributing

## Setup

```bash
pnpm install
pnpm -r build
```

## Adding a new voice

1. Add a JSON file under `packages/clawspeak/src/voices/builtins/` matching the existing shape: `id`, `label`, `description`, `sliders`, `lexicon`, `rules`, `guardrails`. Use a built-in like `glaswegian.json` as a template.
2. In `packages/clawspeak/src/voices/index.ts`, add an import and append the voice to the `builtInVoices` array:

   ```ts
   import myVoice from './builtins/my_voice.json' assert { type: 'json' };
   // ...
   export const builtInVoices: VoiceConfig[] = [..., myVoice];
   ```

3. Run `pnpm -r build` to confirm it compiles.

## Running the example

From repo root, set `examples/node-basic/.env` (copy from `.env.example`), then:

```bash
pnpm --filter clawspeak-node-basic start
```

Or from `examples/node-basic`: `pnpm start`.

## Pull requests

- Prefer small, focused PRs.
- Add or update tests when applicable; keep existing tests passing.
- Follow the project’s style (e.g. Prettier: `pnpm format`).
