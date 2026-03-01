import type { VoiceConfig } from '../index.js';

import eastEnd from './builtins/east_end_londoner.json' assert { type: 'json' };
import newYorker from './builtins/new_yorker.json' assert { type: 'json' };
import texan from './builtins/texan.json' assert { type: 'json' };

export const builtInVoices: VoiceConfig[] = [eastEnd, newYorker, texan];
