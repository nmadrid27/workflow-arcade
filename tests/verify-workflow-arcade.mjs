import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../files/workflow-arcade.html', import.meta.url), 'utf8');
const handoff = await readFile(new URL('../files/workflow-arcade-handoff.md', import.meta.url), 'utf8');

const requiredHtml = [
  /Start Your First Claude Code Project/,
  /Teach Claude How to Work With You/,
  /Add ESF Companion/,
  /Complete Your First Small Project/,
  /\/esf-start/,
  /\/esf-status/,
  /branchChoice/,
  /aria-live="polite"/,
  /<button class="quest/,
  /AI-assisted collaboration/,
  /RESUME QUEST/,
  /WHERE_LABELS/,
  /CLAUDE DESKTOP/,
  /aria-expanded/,
  /RESET PROGRESS/,
  /copyCode/,
  /ArrowUp/,
  /Steer the Session/,
  /\/clear/,
  /Shift\+Tab/,
  /Put the Project Under Version Control/,
  /Recover When It Goes Wrong/,
  /git restore/,
  /SHOW EXAMPLE/,
  /toggleEg/,
  /hint:'/,
  /WORLD 1/,
  /toggleWorld/,
  /CHECK ANSWER/,
  /FIELD GUIDE/,
  /checkPad/,
  /downloadGuide/,
  /ON YOUR MACHINE/,
  /downloadStepFile/,
  /MIN<\/span>/,
  /LEARN MORE/,
  /ArrowRight/,
  /NOTES WRITTEN/,
  /SOUND: /,
  /scene:/,
  /simviz/,
  /CERTIFICATE/,
  /ARCADE CHAMPION/,
  /BADGES/,
  /QUEST MAP/,
  /mapNode/,
  /og:title/,
  /rel="icon"/,
  /REPORT AN ISSUE/,
  /Skip to quest content/,
  /GOT IT/,
  /MUSIC: /,
  /toggleMusic/,
  /Music volume/,
];

for (const pattern of requiredHtml) {
  assert.match(html, pattern);
}

const removedHtml = [
  /api\.anthropic\.com/,
  /Local-First AI in Obsidian/,
  /Route Models Like a Pro/,
  /—/, // em dash: forbidden by the project voice rules
];

for (const pattern of removedHtml) {
  assert.doesNotMatch(html, pattern);
}

assert.match(handoff, /Claude Code/);
assert.match(handoff, /Cowork plugin/);
assert.match(handoff, /AI-assisted collaboration/);

console.log('Workflow Arcade completion contract passed.');
