export type VoiceId = string;

export type VoiceSliders = {
  formality: number; // 0..1
  warmth: number; // 0..1
  humor: number; // 0..1
  bluntness: number; // 0..1
  verbosity: number; // 0..1
};

export type VoiceConfig = {
  id: VoiceId;
  label: string;
  description: string;
  sliders: VoiceSliders;
  lexicon: { allow: string[]; avoid: string[] };
  rules: { dos: string[]; donts: string[] };
  guardrails: { slangCapPer100Words: number };
};

export type PersonaMeta = {
  slangCount: number;
  slangPer100Words: number;
  warnings: string[];
  strengthScore: number;
};

export interface ModelAdapter {
  rewrite(args: {
    system: string;
    developer: string;
    user: string;
    temperature?: number;
  }): Promise<string>;
}

export type ApplyOptions = {
  strength?: number; // 0..1
  returnMetadata?: boolean;
  maxChars?: number;
};

export type ApplyResult = { text: string; meta?: PersonaMeta };

import { detectPhoneticDialect, estimateClarityWarnings } from './guardrails/checks.js';
import { builtInVoices } from './voices/index.js';

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function buildRewritePrompt(args: { text: string; voice: VoiceConfig; strength: number }) {
  const { text, voice, strength } = args;

  const system =
    'You are a deterministic post-processor that rewrites text into a specified voice. ' +
    'Preserve meaning exactly. Change only tone/style. Do not add facts or remove facts. ' +
    'Keep it respectful and broadly understandable. Avoid stereotypes and caricature.';

  const developer = [
    `VOICE: ${voice.label} (${voice.id})`,
    `DESCRIPTION: ${voice.description}`,
    `STRENGTH: ${strength} (0=very subtle, 1=strong but still intelligible)`,
    `SLIDERS: ${JSON.stringify(voice.sliders)}`,
    `LEXICON_ALLOW: ${voice.lexicon.allow.join(', ') || '(none)'}`,
    `LEXICON_AVOID: ${voice.lexicon.avoid.join(', ') || '(none)'}`,
    `RULES_DO: ${voice.rules.dos.join(' | ')}`,
    `RULES_DONT: ${voice.rules.donts.join(' | ')}`,
    `GUARDRAIL_SLANG_CAP_PER_100_WORDS: ${voice.guardrails.slangCapPer100Words}`,
    'OUTPUT: Return ONLY the rewritten text. No quotes. No explanations.'
  ].join('\n');

  const user = `INPUT TEXT:\n${text}`;

  return { system, developer, user };
}

function wordsCount(s: string) {
  const m = s.trim().match(/\S+/g);
  return m ? m.length : 0;
}

function countAllowedSlang(output: string, allow: string[]) {
  const lower = output.toLowerCase();
  let count = 0;
  for (const phrase of allow) {
    const p = phrase.trim().toLowerCase();
    if (!p) continue;
    const parts = lower.split(p);
    if (parts.length > 1) count += parts.length - 1;
  }
  return count;
}

export function listVoices(): Array<Pick<VoiceConfig, 'id' | 'label' | 'description'>> {
  return builtInVoices.map(({ id, label, description }) => ({ id, label, description }));
}

export async function applyVoice(args: {
  text: string;
  voiceId: VoiceId;
  model: ModelAdapter;
  options?: ApplyOptions;
}): Promise<ApplyResult> {
  const { text, voiceId, model, options } = args;

  const voice = builtInVoices.find((v) => v.id === voiceId);
  if (!voice) throw new Error(`Unknown voiceId: ${voiceId}`);

  const strength = clamp01(options?.strength ?? 0.55);
  const maxChars = options?.maxChars ?? 8000;
  const input = text.length > maxChars ? text.slice(0, maxChars) : text;

  const prompt = buildRewritePrompt({ text: input, voice, strength });
  const rewritten = await model.rewrite({ ...prompt, temperature: 0.2 });

  const totalWords = wordsCount(rewritten);
  const slangCount = countAllowedSlang(rewritten, voice.lexicon.allow);
  const slangPer100Words = totalWords > 0 ? (slangCount / totalWords) * 100 : 0;

  const warnings: string[] = [];
  if (slangPer100Words > voice.guardrails.slangCapPer100Words) warnings.push('slang_cap_exceeded');

  for (const avoid of voice.lexicon.avoid) {
    if (avoid && rewritten.toLowerCase().includes(avoid.toLowerCase())) {
      warnings.push('avoid_phrase_used');
      break;
    }
  }

  warnings.push(...detectPhoneticDialect(rewritten));
  warnings.push(...estimateClarityWarnings(rewritten));

  const meta: PersonaMeta = {
    slangCount,
    slangPer100Words,
    warnings,
    strengthScore: strength
  };

  return options?.returnMetadata ? { text: rewritten, meta } : { text: rewritten };
}

export async function previewVoice(args: {
  voiceId: VoiceId;
  sampleText?: string;
  model: ModelAdapter;
  options?: ApplyOptions;
}): Promise<ApplyResult> {
  return applyVoice({
    text: args.sampleText ?? 'Quick test: explain what this tool does in 2-3 sentences.',
    voiceId: args.voiceId,
    model: args.model,
    options: args.options
  });
}

export type BaseAgent<I = unknown> = (input: I) => Promise<string>;

export type CreateVoicedAgentOptions<I = unknown> = {
  agent: BaseAgent<I>;
  voiceId: VoiceId;
  model: ModelAdapter;

  strength?: number; // 0..1
  onMeta?: (meta: PersonaMeta) => void; // optional hook for warnings/telemetry
};

/**
 * Wrap any existing agent function so every response gets rewritten into a selected voice.
 * Always returns { text, meta }. This is tone-only post-processing: meaning/capability/safety are unchanged.
 */
export function createVoicedAgent<I = unknown>(opts: CreateVoicedAgentOptions<I>) {
  return async (input: I): Promise<ApplyResult> => {
    const draft = await opts.agent(input);

    const res = await applyVoice({
      text: draft,
      voiceId: opts.voiceId,
      model: opts.model,
      options: {
        strength: opts.strength ?? 0.55,
        returnMetadata: true
      }
    });

    if (res.meta && opts.onMeta) opts.onMeta(res.meta);

    return res;
  };
}

/**
 * Like createVoicedAgent but returns only the rewritten text (Promise<string>).
 */
export function createVoicedTextAgent<I = unknown>(opts: CreateVoicedAgentOptions<I>) {
  const voiced = createVoicedAgent(opts);
  return async (input: I): Promise<string> => {
    const res = await voiced(input);
    return res.text;
  };
}

export { openAICompatAdapter } from './adapters/openaiCompat.js';
export type { OpenAICompatAdapterConfig } from './adapters/openaiCompat.js';
