// Only print in interactive terminals
if (!process.env.CLAWSPEAK_SILENT && process.stdout.isTTY) {
  console.log(`
┌─ ClawSpeak ───────────────────────────────────────────────┐
│ Tone-only voice overlays for agent outputs.               │
│ Draft → ClawSpeak → final.                                │
├───────────────────────────────────────────────────────────┤
│ Quickstart:                                               │
│   import { listVoices, applyVoice } from "clawspeak";     │
│   console.log(listVoices());                               │
│                                                           │
│ Featured voice:                                            │
│   raig_bait_chef — high-intensity kitchen mode             │
│   Rapid-fire commands. ALL CAPS bursts. Work-only critique.│
│                                                           │
│ API: listVoices() · applyVoice() · createVoicedAgent()     │
│ Docs: https://github.com/bigbadman-lab/clawspeak           │
│ Disable: CLAWSPEAK_SILENT=1                                │
└───────────────────────────────────────────────────────────┘
`);
}
