import type { VoiceConfig } from '../index.js';

import eastEnd from './builtins/east_end_londoner.json' with { type: 'json' };
import newYorker from './builtins/new_yorker.json' with { type: 'json' };
import texan from './builtins/texan.json' with { type: 'json' };
import scouse from './builtins/scouse.json' with { type: 'json' };
import glaswegian from './builtins/glaswegian.json' with { type: 'json' };
import geordie from './builtins/geordie.json' with { type: 'json' };
import dublin from './builtins/dublin.json' with { type: 'json' };
import southernUS from './builtins/southern_us.json' with { type: 'json' };
import californian from './builtins/californian.json' with { type: 'json' };
import overlyPolite from './builtins/overly_polite.json' with { type: 'json' };
import veryRude from './builtins/very_rude.json' with { type: 'json' };
import raigBaitChef from './builtins/raig_bait_chef.json' with { type: 'json' };

export const builtInVoices: VoiceConfig[] = [
  eastEnd,
  scouse,
  glaswegian,
  geordie,
  dublin,
  newYorker,
  texan,
  southernUS,
  californian,
  overlyPolite,
  veryRude,
  raigBaitChef
];
