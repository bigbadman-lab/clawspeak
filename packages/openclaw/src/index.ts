import { applyVoice, listVoices, previewVoice, openAICompatAdapter } from 'clawspeak';

type PluginConfig = {
  apiKey: string;
  model: string;
  baseUrl?: string;
  defaultVoiceId?: string;
};

function getConfig(api: any): PluginConfig {
  // OpenClaw provides plugin config via api.config() in many setups.
  // If your OpenClaw version uses a different accessor, we can tweak it.
  const cfg = (api?.config?.() ?? api?.config ?? {}) as Partial<PluginConfig>;

  if (!cfg.apiKey) throw new Error('ClawSpeak plugin missing config: apiKey');
  if (!cfg.model) throw new Error('ClawSpeak plugin missing config: model');

  return {
    apiKey: cfg.apiKey,
    model: cfg.model,
    baseUrl: cfg.baseUrl,
    defaultVoiceId: cfg.defaultVoiceId ?? 'east_end_londoner'
  };
}

function resolveStrength(args: any) {
  if (typeof args?.strength === 'number') return args.strength;

  const style = String(args?.style ?? '').toLowerCase();
  if (style === 'light') return 0.35;
  if (style === 'strong') return 0.75;
  if (style === 'medium') return 0.55;

  return 0.55;
}

export default function register(api: any) {
  const cfg = getConfig(api);
  const adapter = openAICompatAdapter({
    apiKey: cfg.apiKey,
    model: cfg.model,
    baseUrl: cfg.baseUrl
  });

  api.registerTool({
    name: 'clawspeak_list',
    description: 'List available ClawSpeak voices (personas).',
    parameters: { type: 'object', properties: {}, additionalProperties: false },
    async execute() {
      return { voices: listVoices() };
    }
  });

  api.registerTool({
    name: 'clawspeak_apply',
    description: 'Rewrite input text into a selected ClawSpeak voice (tone only).',
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        text: { type: 'string', description: 'Text to rewrite.' },
        voiceId: { type: 'string', description: 'Voice/persona id.' },
        strength: { type: 'number', minimum: 0, maximum: 1, description: '0..1 style strength.' },
        style: {
          type: 'string',
          enum: ['light', 'medium', 'strong'],
          description: 'Preset style strength (ignored if strength is provided).'
        },
        returnMetadata: { type: 'boolean', description: 'Include slang/warnings metadata.' }
      },
      required: ['text']
    },
    async execute(args: any) {
      const available = listVoices().map((v) => v.id);
let voiceId = (args?.voiceId as string) ?? cfg.defaultVoiceId ?? 'east_end_londoner';
if (!available.includes(voiceId)) voiceId = cfg.defaultVoiceId ?? available[0] ?? 'east_end_londoner';
      const res = await applyVoice({
        text: String(args.text ?? ''),
        voiceId,
        model: adapter,
        options: {
          strength: resolveStrength(args),
          returnMetadata: Boolean(args.returnMetadata)
        }
      });
      return res;
    }
  });

  api.registerTool({
    name: 'clawspeak_preview',
    description: 'Preview a voice by rewriting a short sample text.',
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        voiceId: { type: 'string' },
        sampleText: { type: 'string' },
        strength: { type: 'number', minimum: 0, maximum: 1 },
        style: {
          type: 'string',
          enum: ['light', 'medium', 'strong'],
          description: 'Preset style strength (ignored if strength is provided).'
        }
      },
      required: ['voiceId']
    },
    async execute(args: any) {
      const res = await previewVoice({
        voiceId: String(args.voiceId),
        sampleText: args.sampleText ? String(args.sampleText) : undefined,
        model: adapter,
        options: { strength: resolveStrength(args) }
      });
      return res;
    }
  });
}
