import type { VoiceConfig } from '../index.js';

import eastEnd from './builtins/east_end_londoner.json' assert { type: 'json' };
import newYorker from './builtins/new_yorker.json' assert { type: 'json' };
import texan from './builtins/texan.json' assert { type: 'json' };
import scouse from './builtins/scouse.json' assert { type: 'json' };
import glaswegian from './builtins/glaswegian.json' assert { type: 'json' };
import geordie from './builtins/geordie.json' assert { type: 'json' };
import dublin from './builtins/dublin.json' assert { type: 'json' };

export const builtInVoices: VoiceConfig[] = [eastEnd, scouse, glaswegian, geordie, dublin, newYorker, texan];
