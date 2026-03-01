import { request } from 'undici';
import type { ModelAdapter } from '../index.js';

export type OpenAICompatAdapterConfig = {
  apiKey: string;
  model: string;

  /**
   * OpenAI: https://api.openai.com/v1
   * Grok (xAI): https://api.x.ai/v1
   */
  baseUrl?: string;

  /**
   * Optional request timeout (ms).
   */
  timeoutMs?: number;
};

type ChatCompletionsResponse = {
  choices?: Array<{
    message?: { content?: string };
  }>;
  error?: { message?: string };
};

export function openAICompatAdapter(cfg: OpenAICompatAdapterConfig): ModelAdapter {
  const baseUrl = (cfg.baseUrl ?? 'https://api.openai.com/v1').replace(/\/$/, '');
  const timeoutMs = cfg.timeoutMs ?? 60_000;

  return {
    async rewrite({ system, developer, user, temperature }) {
      const url = `${baseUrl}/chat/completions`;

      const body = {
        model: cfg.model,
        temperature: temperature ?? 0.2,
        messages: [
          { role: 'system', content: system },
          { role: 'developer', content: developer },
          { role: 'user', content: user }
        ]
      };

      const res = await request(url, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${cfg.apiKey}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify(body),
        bodyTimeout: timeoutMs,
        headersTimeout: timeoutMs
      });

      const text = await res.body.text();

      let json: ChatCompletionsResponse;
      try {
        json = JSON.parse(text) as ChatCompletionsResponse;
      } catch {
        throw new Error(`Model adapter returned non-JSON response (status ${res.statusCode}): ${text}`);
      }

      if (res.statusCode >= 400) {
        const msg = json?.error?.message ?? text;
        throw new Error(`Model adapter error (status ${res.statusCode}): ${msg}`);
      }

      const content = json?.choices?.[0]?.message?.content;
      if (!content) throw new Error('Model adapter returned empty content');

      return content.trim();
    }
  };
}
