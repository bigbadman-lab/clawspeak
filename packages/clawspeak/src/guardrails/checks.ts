export function estimateClarityWarnings(text: string): string[] {
  const warnings: string[] = [];

  const words = text.trim().match(/\S+/g) ?? [];
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);

  const avgWordLen =
    words.length === 0 ? 0 : words.reduce((sum, w) => sum + w.length, 0) / words.length;
  const avgSentenceLen = sentences.length === 0 ? 0 : words.length / sentences.length;

  // Conservative thresholds (warning-only)
  if (avgSentenceLen > 28) warnings.push('low_clarity_long_sentences');
  if (avgWordLen > 6.2) warnings.push('low_clarity_complex_words');

  return warnings;
}

/**
 * Flags "eye dialect" / heavy phonetic accent spelling.
 * This is a heuristic: warning-only.
 */
export function detectPhoneticDialect(text: string): string[] {
  const warnings: string[] = [];

  // Many apostrophe contractions are normal; we flag when it gets excessive.
  const apostrophes = (text.match(/'/g) ?? []).length;
  const words = (text.trim().match(/\S+/g) ?? []).length;
  const per100 = words > 0 ? (apostrophes / words) * 100 : 0;

  if (per100 > 6) warnings.push('possible_phonetic_dialect_spelling');

  // Common exaggerated tokens we explicitly discourage (MVP list)
  const bannedCaricature = [
    'cor blimey',
    "guv'nor",
    'fuggedaboutit',
    "top o' the morning",
    'wey aye man',
    'pure dead brilliant',
    "rootin' tootin'"
  ];

  const lower = text.toLowerCase();
  if (bannedCaricature.some((p) => lower.includes(p))) warnings.push('caricature_phrase_detected');

  return warnings;
}
