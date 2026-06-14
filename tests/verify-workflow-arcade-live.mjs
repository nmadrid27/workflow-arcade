import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../files/workflow-arcade-live.html', import.meta.url), 'utf8');

const requiredHtml = [
  // identity
  /<title>Workflow Arcade · Live/,
  // setup + personalization tokens (literal templates live in the source data tables)
  /WHERE YOU KEEP PROJECTS/,
  /\{project\}/,
  /\{projectsDir\}/,
  /~\/projects/,
  // data model the shell renders generically
  /const STAGES/,
  // the seven Stage A track titles (1:1 with the arcade quests)
  /Start Your First Claude Code Project/,
  /Teach Claude How to Work With You/,
  /Add ESF Companion/,
  /Complete Your First Small Project/,
  /Steer the Session/,
  /Put the Project Under Version Control/,
  /Recover When It Goes Wrong/,
  // step card mechanics
  /RUN THIS YOURSELF/,
  /WHAT YOU SHOULD SEE/,
  /IT WORKED/,
  /SOMETHING LOOKS OFF/,
  /GOT IT/,
  /WHAT THIS MEANS/,
  /OFF-RAMP A/,
  // chrome, the link back to the arcade, a11y, disclosure
  /workflow-arcade\.html/,
  /Skip to the steps/,
  /aria-live="polite"/,
  /AI-assisted collaboration/,
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

console.log('Workflow Arcade Live contract passed.');
