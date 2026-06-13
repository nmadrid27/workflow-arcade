# Workflow Arcade: Build Handoff

## What This Is

Workflow Arcade is a public, pixel-art learning experience for first-time macOS users. It teaches a seven-quest progression:

1. Create a project folder, install Claude Code, open the folder, and run `/init` to generate `CLAUDE.md`.
2. Write and test a concise "How to Work With Me" profile in `CLAUDE.md`.
3. Add ESF Companion, run onboarding, and write the Position Statement that anchors the work.
4. Complete a learner-chosen small project, direct it against your position, verify it, and disclose AI use.
5. Steer live sessions: read permission prompts, interrupt with Esc, use plan mode, and promote repeated corrections into `CLAUDE.md`.
6. Put the project under version control: `git init`, Claude-driven commits, and reading every diff before approving.
7. Recover from mistakes: stop, inspect with `git status` and `git diff`, revert with `git restore`, and promote the lesson into `CLAUDE.md`.

The application is one self-contained HTML file, a vanilla-JS port of the "Neon Grid" v3 design build. It has no build step or JavaScript dependencies. Google Fonts (`Press Start 2P` and `VT323`) is the only external runtime dependency. The seven quests are Stage A of the AI-workflow skill ladder.

## Current Status

The seven quests are complete and playable. The current build is the v3 Neon Grid port. The app includes:

- A one-step-at-a-time walkthrough for every quest.
- Scripted terminals that never execute commands; they render fixed lines and are labeled SIMULATED, NEVER EXECUTES.
- Practice pads that persist on the device.
- Soft-gated XP and quest completion, with sequential unlock gating on the overworld board.
- Keyboard-accessible quest navigation and visible focus states.
- A hint-only PIXEL guide that points at the action and never hands over the answer.
- Responsive desktop and mobile layouts.
- Copy buttons on reference code blocks.
- A footer control that resets device progress after confirmation.
- Step chips that name the surface each action runs on.
- A home-screen button that resumes the next uncleared quest.
- A quest log grouped into three collapsible worlds, with the active world open by default.
- A CHECK ANSWER button on practice pads that runs an honest structural (keyword-presence) check and banks XP.
- A PEEK EXAMPLE worked example under the practice pad: it auto-shows on the early quests and fades to peek-only on later ones.
- A WHY THIS WORKS reflection field on practice-pad and explanation steps.
- A BOSS CHECK recall on each quest's last step: a from-memory prompt, a confidence selector, a reveal, and an honest self-score (solid, partial, or missed).
- A field guide where learners save steps with their notes and reflections and export them as Markdown.
- ON YOUR MACHINE panels on artifact steps: a file tree showing where the artifact lives. The app never writes to the project folder; the learner places the file.
- Achievement badges tied to target behaviors, not grind. Eight badges fire from specific quest-complete, CHECK ANSWER, recovery, and field-guide export points, and a badge case shows earned and unearned badges.
- A completion certificate rendered on a canvas and downloaded as a PNG once all seven quests are cleared. The learner adds a name for the certificate, and that name is never persisted to the device.
- An OFF-RAMP A panel and Stage B/C off-ramp stages on the certificate view: Stage A is framed as a complete, real finish, not a teaser.
- A DEFENSE PACK STARTER panel that points the field-guide export at a real `/esf-defense-pack`.
- A horizontal overworld board on the home hub: three colored zone bands, an SVG dotted zig-zag trail, and seven keyboard-focusable, aria-labeled node buttons with cleared, current, unlocked, and locked states.
- A THREE THREADS panel on the home hub showing the intent, verify, and control spiral, lighting Stage A pips as rungs complete.
- A Steward Integrity framing: the top bar progress bar is labeled INTEGRITY, and the home hub shows a STEWARD INTEGRITY meter framed as progress from blind approval toward human accountability (driven by quests cleared).
- A CORE ESF PRINCIPLE callout on each quest from the quest's `principle` field.
- Optional synthesized ambient music (a generative Web Audio chord loop, not licensed tracks), default off, with a top-bar toggle and volume slider, both persisted.
- Social and search meta tags, an inline SVG favicon, a skip-to-content link, an `aria-live="polite"` status region, and a footer link to the GitHub issue tracker.

PIXEL does not call a hosted model. Its status explicitly identifies it as an offline guide.

## Project Files

- `files/workflow-arcade.html`: the complete application (a single self-contained vanilla-JS file, ~1158 lines).
- `files/workflow-arcade-handoff.md`: this continuation guide.
- `tests/verify-workflow-arcade.mjs`: the static completion contract.

The locked design spec (`docs/design/neon-grid-direction.md`) and curriculum strategy (`docs/design/ai-workflow-skill-ladder.md`) live under `docs/`. Other implementation plans and development logs are also kept locally under `docs/` and are not committed to the public repository.

## Run And Verify

Start a local server from the project root:

```bash
python3 -m http.server 4173
```

Open:

```text
http://localhost:4173/files/workflow-arcade.html
```

Run the static contract:

```bash
node tests/verify-workflow-arcade.mjs
```

The browser verification pass should cover all seven quests, XP, refresh persistence, keyboard navigation, the BOSS CHECK recall, hint delivery, reduced-motion behavior, and a 390-pixel mobile viewport.

## Architecture

The app is a plain `state` object plus a `render()` that rebuilds the whole view; there is no MODULES-render-into-stage model and no component framework. The `<script>` is one IIFE organized by banner comments:

- `DATA`: the content and configuration tables (`C`, `WORLDS`, `POS`, `RUNGS`, `THREADS`, `QUESTS`, `RECALL`, `DOCS`, `BADGES`, `KEY`).
- `STATE`: the single `state` object.
- `HELPERS`: escaping, color resolution, quest indexing, unlock gating, and rung lookups.
- `AUDIO`: the synthesized ambient-music chord loop (music only, default off).
- `NAVIGATION + ACTIONS`: view changes, step navigation, XP, structure checks, recall scoring, guide and certificate export, and persistence.
- `RENDER`: the style-object-to-CSS helper, the `window.WA` dispatcher, the per-view render functions, and `render()`.

`render()` writes `document.getElementById('wa-root').innerHTML` from a template built by `viewBody()`, then restores caret focus to the logically matching field. `viewBody()` switches on `state.view` across `home`, `quest`, `log`, `badges`, `cert`, `guide`, and `threshold`, each produced by its own `view*()` function. Action functions mutate `state`, call `persist()`, and call `render()`. Inline `onclick`/`oninput` handlers route through a single global `window.WA` dispatcher.

## Content And Data Model

All content lives in `const` data tables at the top of the script, ported verbatim from the design-tool source. The curriculum source of truth is `QUESTS` (seven quests). Each quest:

```js
{ id, n, world, xp, min, title, short, sub, principle, steps[] }
```

A step supports:

```js
{ h, b, code, term, scene, where, why, action, pad }
```

- `h`: action heading.
- `b`: explanation.
- `code`: optional reference block (copyable in the walkthrough).
- `term`: scripted terminal lines, an array of `[text, colorKey]` pairs. The terminal renders these fixed lines and never accepts or executes input.
- `scene`: optional PROJECT STATE tree, an array of strings rendered above the terminal. Lines starting with `*` render amber as changed state.
- `where`: optional surface key (`terminal`, `claude`, `cowork`, `desktop`, `browser`) rendered as a step chip.
- `why`: optional flag that adds the WHY THIS WORKS reflection field on the step.
- `action`: optional badge id awarded when the learner advances past the step.
- `pad`: optional practice-pad config, `{ ph, ex, badge, awardXp, check[], file? }`, where each `check` entry is `{ any:[terms], label }` for the keyword-presence structure check, and `file` is `{ name, tree[] }` for the ON YOUR MACHINE panel.

Supporting tables:

- `C`: the accent palette (`muted`, `ink`, `mint`, `violet`, `amber`, `rose`, `cyan`, `dim`).
- `WORLDS`: the three worlds (SETUP / amber, STEWARDSHIP / mint, CONTROL / rose).
- `POS`: seven `[left%, top%]` node positions on the overworld board.
- `RUNGS`: the four ladder rungs, each mapping quest ids to a threshold line and a shift line for the threshold-crossed view.
- `THREADS`: the three spiral threads (INTENT, VERIFY, CONTROL), with levels keyed by `rung` (Stage A) or `stage` (B/C).
- `RECALL`: per-quest BOSS CHECK answers, `{ prompt, items[] }`, revealed for self-scoring.
- `DOCS`: per-quest external documentation links.
- `BADGES`: the eight achievement badges, `{ id, title, desc, accent, symbol }`, each tied to a behavior.
- `KEY`: the localStorage key, `'wa-arcade-proto-v1'`.

Helpers walk these tables: `idxOf`, `unlocked` (a quest unlocks only when the prior quest is cleared), `clearedCount`, `currentIdx`, `rungOf`, `rungDone`, `curQuest`, `curStep`, and `padKey`.

## Persistence

Progress saves under the `wa-arcade-proto-v1` localStorage key:

- `cleared`: completed quests.
- `stepAt`: the last viewed step per quest.
- `xp`: total XP.
- `pads`: practice-pad text.
- `passed`: which structure checks passed.
- `checks`: the per-check results.
- `badges`: earned badges.
- `branch`: any branch selection.
- `openWorlds`: the open or collapsed state of each quest-log world.
- `reflections`: WHY THIS WORKS text per step.
- `guide`: saved field-guide entries.
- `recallDone`: BOSS CHECK self-scores.
- `vol`, `muted`, `musicOn`: the music preferences.

The certificate name is deliberately excluded from persistence; it lives only in the input and on the canvas. Storage calls fail silently when localStorage is unavailable, so the application continues in memory.

## Source Boundaries

Curriculum guidance is grounded in:

- Anthropic's official Claude Code documentation for macOS setup, project startup, `/init`, and `CLAUDE.md`.
- The ESF Companion documentation for onboarding, the Position Statement, the Record of Resistance, and the disclosure flow.
- The ESF Companion repository templates and walkthrough.

Do not invent unstable interface labels. Teach the verified action and outcome when an installation interface may change.

## Voice And Style

- Use direct, concise language.
- Do not use em dashes.
- Use active voice and serial commas.
- Define terms at first use.
- Keep instructional copy non-anthropomorphizing.
- Preserve PIXEL as the playful mascot, but do not describe tools as thinking or deciding.

## Known Limitations

- Fonts load from Google Fonts.
- Progress is device-local.
- PIXEL uses scripted, hint-only guidance, not live inference.
- The terminal is scripted; it renders fixed lines and never executes commands.
- The app teaches macOS only.
- The app covers Stage A of the skill ladder; Stages B and C are documented in `docs/design/ai-workflow-skill-ladder.md` but not built into the app.

## Disclosure

This project was built through AI-assisted collaboration. Nathan Madrid set the audience, curriculum direction, macOS scope, learner-chosen final project, the locked Neon Grid v3 direction, and every design approval. Codex and Claude Code supported implementation and verification across the build and the v3 rewrite, and verified each change. Nathan remained responsible for the project direction and all approval decisions.
