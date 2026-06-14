import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../files/workflow-arcade.html', import.meta.url), 'utf8');
const handoff = await readFile(new URL('../files/workflow-arcade-handoff.md', import.meta.url), 'utf8');

const requiredHtml = [
  // seven quest titles (curriculum content)
  /Start Your First Claude Code Project/,
  /Teach Claude How to Work With You/,
  /Add ESF Companion/,
  /Complete Your First Small Project/,
  /Steer the Session/,
  /Put the Project Under Version Control/,
  /Recover When It Goes Wrong/,
  // home screens and bands
  /OVERWORLD MAP/,
  /THREE THREADS/,
  /STEWARD INTEGRITY/,
  /BLIND APPROVAL/,
  /HUMAN ACCOUNTABILITY/,
  /BADGE CASE/,
  /FIELD GUIDE/,
  /ALL SYSTEMS ONLINE/,
  /NOW PLAYING/,
  // quest walkthrough mechanics
  /CORE ESF PRINCIPLE/,
  /BOSS CHECK/,
  /FROM MEMORY/,
  /PEEK EXAMPLE/,
  /CHECK ANSWER/,
  /WHY THIS WORKS/,
  /SCORE YOURSELF/,
  /git restore/,
  /Shift\+Tab/,
  // certificate + off-ramp + defense pack
  /CERTIFICATE OF COMPLETION/,
  /ARCADE CHAMPION/,
  /OFF-RAMP A/,
  /DEFENSE PACK/,
  // music + chrome + a11y
  /MUSIC:/,
  /toggleMusic/,
  /Music volume/,
  /REPORT AN ISSUE/,
  /Skip to quest content/,
  /RESET PROGRESS/,
  /aria-live="polite"/,
  /og:title/,
  /rel="icon"/,
  /VT323/,
  // disclosure line
  /AI-assisted collaboration/,
  /copyTerm/,
  /title="Badge case"/,
];

for (const pattern of requiredHtml) {
  assert.match(html, pattern, `expected to find ${pattern}`);
}

const removedHtml = [
  /api\.anthropic\.com/,
  /—/, // em dash: forbidden by the project voice rules
];

for (const pattern of removedHtml) {
  assert.doesNotMatch(html, pattern, `expected NOT to find ${pattern}`);
}

assert.match(handoff, /Claude Code/);
assert.match(handoff, /AI-assisted collaboration/);

console.log('Workflow Arcade completion contract passed.');
