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

const builtInVoices: VoiceConfig[] = [
  {
    id: 'east_end_londoner',
    label: 'East End Londoner',
    description: 'Friendly, lightly blunt London tone with minimal slang. Clear and respectful.',
    sliders: { formality: 0.35, warmth: 0.6, humor: 0.35, bluntness: 0.55, verbosity: 0.45 },
    lexicon: { allow: ['mate', 'cheers', 'no worries'], avoid: ["guv'nor", 'cor blimey'] },
    rules: {
      dos: ['Preserve meaning exactly.', 'Keep it intelligible and respectful.'],
      donts: ['No caricature.', 'No stereotypes.']
    },
    guardrails: { slangCapPer100Words: 3 }
  },
  {
    id: 'new_yorker',
    label: 'New Yorker',
    description: 'Fast, direct, no-nonsense. Clear and helpful, minimal slang.',
    sliders: { formality: 0.45, warmth: 0.35, humor: 0.2, bluntness: 0.75, verbosity: 0.35 },
    lexicon: { allow: ['look', "here's the thing"], avoid: ['fuggedaboutit'] },
    rules: {
      dos: ['Be concise.', 'Be direct but not rude.'],
      donts: ['No caricature.', 'Avoid heavy dialect spelling.']
    },
    guardrails: { slangCapPer100Words: 2 }
  },
  {
    id: 'texan',
    label: 'Texan',
    description: 'Friendly, plainspoken, calm confidence. Subtle regional warmth.',
    sliders: { formality: 0.4, warmth: 0.75, humor: 0.25, bluntness: 0.45, verbosity: 0.45 },
    lexicon: { allow: ["y'all", 'howdy'], avoid: ["rootin' tootin'"] },
    rules: {
      dos: ['Sound welcoming.', 'Keep slang subtle.'],
      donts: ['No stereotypes.', 'No exaggerated cowboy talk.']
    },
    guardrails: { slangCapPer100Words: 3 }
  }
];

export function listVoices(): Array<Pick<VoiceConfig, 'id' | 'label' | 'description'>> {
  return builtInVoices.map(({ id, label, description }) => ({ id, label, description }));
}

export async function applyVoice(_args: {
  text: string;
  voiceId: VoiceId;
  model: ModelAdapter;
  options?: ApplyOptions;
}): Promise<ApplyResult> {
  // Next step we'll implement this properly.
  throw new Error('applyVoice not implemented yet (next step: wire model adapter + prompt builder)');
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
