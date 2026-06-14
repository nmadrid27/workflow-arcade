# Workflow Arcade

A public, pixel-art learning app that teaches first-time macOS users a seven-quest Claude Code onboarding path (start a project and run `/init`, write a `CLAUDE.md` work profile, add the ESF Companion, complete and disclose a small project, steer live sessions, put the project under git, recover from mistakes). The whole app is one self-contained HTML file with no build step.

The current app is a vanilla-JS port of the "Neon Grid" v3 design build. The seven quests are Stage A of the AI-workflow skill ladder.

A second public file, `files/workflow-arcade-live.html`, is the Real-Machine Companion: a separate self-contained offline page that takes the learner's project name and folder, then guides them through doing the same seven quests for real on their own macOS machine. It is guided only (it never runs commands or writes files), personalizes every command through a `fill()` token substituter, writes its own `wa-arcade-live-v1` localStorage key, and reads (never mutates) the arcade's `wa-arcade-proto-v1` key to flag quests already played in the sim. Its content lives in a `STAGES` data table the shell renders generically, so Stage B and Stage C can be added later as data. The arcade links to it from the home hero ("DO IT FOR REAL").

## Commands

- **Serve:** `python3 -m http.server 4173`, then open `http://localhost:4173/files/workflow-arcade.html`
- **Contract test:** `node tests/verify-workflow-arcade.mjs` (Node standard library only; nothing to install)
- **Serve the companion:** same server, open `http://localhost:4173/files/workflow-arcade-live.html`
- **Companion contract test:** `node tests/verify-workflow-arcade-live.mjs`

There is no package.json, bundler, linter, or build step. Editing is direct file editing.

## Architecture

Everything renders from `files/workflow-arcade.html` (~1158 lines), a single self-contained vanilla-JS file ported from the v3 Neon Grid design build. Google Fonts (`Press Start 2P` and `VT323`) is the only external runtime dependency.

The app is a plain state object plus a `render()` that rebuilds the whole view; there is no MODULES-render-into-stage model and no component framework. The `<script>` is one IIFE organized by banner comments: DATA, STATE, HELPERS, AUDIO, NAVIGATION + ACTIONS, the style-object-to-CSS helper, and RENDER.

- **State.** A single `state` object holds everything: `view`, `questId`, `step`, `cleared`, `stepAt`, `xp`, `pads`, `passed`, `checks`, `badges`, `branch`, `openWorlds`, `showHint`, `showExample`, `askPixel`, `certName`, `thresholdRung`, `reflections`, `guide`, `recallDone`, `recall`, `copiedKey`, `vol`, `muted`, `musicOn`. Action functions mutate `state`, call `persist()`, and call `render()`.
- **Render and view routing.** `render()` writes `document.getElementById('wa-root').innerHTML` from a template built by `viewBody()`, then restores caret focus to the logically matching field. `viewBody()` switches on `state.view` across `home`, `quest`, `log`, `badges`, `cert`, `guide`, and `threshold` views, each produced by its own `view*()` function. The whole shell (top bar, main, footer) is rebuilt on every render; there is no incremental DOM diffing.
- **Inline handlers.** A single global `window.WA` dispatcher exposes every action so inline `onclick`/`oninput` handlers stay simple. A `css()` helper turns style objects into CSS strings (`sa()` wraps them as escaped `style="..."` attributes).

## Data structures

All content lives in `const` data tables at the top of the script, ported verbatim from the design-tool source. Confirm names by reading the file; the actual structures are:

- `C`: the accent palette object (`muted`, `ink`, `mint`, `violet`, `amber`, `rose`, `cyan`, `dim`). `colorOf(k)` resolves a key or passes a literal color through.
- `WORLDS`: the three worlds (`1` SETUP / amber, `2` STEWARDSHIP / mint, `3` CONTROL / rose), each with a `name` and `accent`.
- `POS`: seven `[left%, top%]` pairs that place the quest nodes on the horizontal overworld board.
- `RUNGS`: the four ladder rungs (`CONFIGURE`, `JUDGMENT`, `THROTTLE`, `RECOVERY`), each mapping quest ids to a `threshold` line and a `shift` line shown on the threshold-crossed view.
- `THREADS`: the three spiral threads (`INTENT`, `VERIFY`, `CONTROL`), each with a `tag` and `levels` keyed by `rung` (Stage A) or `stage` (B/C); the home board lights Stage A pips as rungs complete.
- `QUESTS`: the seven quests, the source of truth for the curriculum. Each quest is `{ id, n, world, xp, min, title, short, sub, principle, steps[] }`. A step uses `h` (heading), `b` (body), optional `code` (reference block), `term` (scripted terminal lines as `[text, colorKey]` pairs), `scene` (PROJECT STATE tree lines, `*` marks a changed line), `where` (surface chip key), `why` (flags a reflection prompt), `hint` (the per-step PIXEL hint text, present on nearly every step), `action` (a badge id awarded on advance), and optional `pad`. A `pad` is `{ ph, ex, badge, awardXp, check[] }`, where each `check` entry is `{ any:[terms], label }` for the structure check, plus an optional `file` `{ name, tree[] }` for the ON YOUR MACHINE panel.
- `RECALL`: per-quest BOSS CHECK answers (`{ prompt, items[] }`) revealed for self-scoring on the last step of each quest.
- `DOCS`: per-quest external documentation links shown as a DOCS chip.
- `BADGES`: the eight achievement badges (`{ id, title, desc, accent, symbol }`), each tied to a specific behavior.
- `KEY`: the localStorage key, `'wa-arcade-proto-v1'`.

Helpers walk these tables: `idxOf`, `unlocked` (sequential gating; a quest unlocks only when the prior quest is cleared), `clearedCount`, `currentIdx`, `rungOf`, `rungDone`, `curQuest`, `curStep`, and `padKey`.

## Neon Grid visual language

The look is the locked v3 "Neon Grid" direction (full spec in `docs/design/neon-grid-direction.md`):

- **Dark arcade cabinet.** Page background `#07070d`; the whole app is a centered fixed-width (1120px) bordered cabinet panel with a deep ring shadow (`box-shadow: 0 0 0 6px #07060d, 0 22px 60px rgba(0,0,0,.7)`) over two page-level radial washes. A CRT scanline overlay sits above every screen; a perspective grid floor strip sits under the hero.
- **Palette.** Rose `#ff2d78` (primary), cyan `#22d3ee`, mint `#34d399`, amber `#fbbf24`, violet `#6d6df2`, plus ink/muted/dim grays. Worlds map to amber (SETUP), mint (STEWARDSHIP), and rose (CONTROL).
- **Fonts.** `Press Start 2P` for headings, labels, buttons, numbers, and chrome; `VT323` for all body copy, terminal text, trees, and textareas. Base body font is unsmoothed (`-webkit-font-smoothing:none`) for the pixel look.
- **Animations.** Four named CSS keyframes: `wa-blink` (PIXEL's eyes), `wa-pulse` (the current quest node beacon), `wa-float` (the hero PIXEL sprite bob), and `wa-pop` (entrance for the ASK PIXEL tip and HINT panel). All are disabled under `prefers-reduced-motion`.
- **Sharp corners.** Corner radius is 0 everywhere; thick pixel-blocky borders and hard offset "arcade key" button bevels are load-bearing.

## Feature set

- **Cabinet shell** with the scanline overlay and the top bar.
- **Top bar** with the logo, an XP readout, and the INTEGRITY meter (a `N / 7` cleared progress bar), plus the music toggle, volume slider, and home/log/guide/badges nav buttons.
- **Horizontal overworld board** on the home hub: three colored zone bands, an SVG dotted zig-zag trail, and seven absolutely-positioned, aria-labeled quest nodes with cleared, current (pulsing beacon), unlocked, and locked states under **sequential unlock gating**.
- **Quest walkthrough** (`viewQuest`): one step at a time with the CORE ESF PRINCIPLE callout, meta chips, a segmented progress bar, a **scripted terminal** (labeled SIMULATED, NEVER EXECUTES; it renders fixed lines and never accepts or runs input), the **PROJECT STATE** tree, and a copyable REFERENCE code block.
- **Practice pad** with a **PEEK EXAMPLE** worked example that auto-shows on early quests and fades to peek-only later, a per-step WHY THIS WORKS reflection field, and an ON YOUR MACHINE file panel on artifact steps (the app never writes to the learner's folder).
- **Structure check** (CHECK ANSWER): an honest keyword-presence check that banks XP and fires a badge; the copy states it reads structure, not understanding.
- **BOSS CHECK recall** on each quest's last step: a from-memory prompt, a confidence selector, a reveal, and an honest self-score (`solid`, `partial`, `missed`).
- **Hint-only PIXEL rail** in the walkthrough: PIXEL points at the action and never hands over the answer; there is no free-text chat.
- **Quest log** (`viewLog`) grouped into three collapsible worlds with per-quest status and resume.
- **Badge case** (`viewBadges`): the eight behavior-tied badges, earned and locked.
- **Field guide** (`viewGuide`): learners save steps with notes and reflections, then export them as Markdown.
- **Certificate** (`viewCert`/`downloadCert`): rendered to a canvas and downloaded as a PNG once all seven quests are cleared; the name on it is never persisted.
- **OFF-RAMP A**, **DEFENSE PACK STARTER**, and the Stage B/C off-ramp stages, all on the certificate view: Stage A is framed as a complete, real finish, with the field-guide export feeding a real `/esf-defense-pack`.
- **THREE THREADS** panel on the home hub: the intent/verify/control spiral, lighting Stage A pips as rungs complete.
- **Kept ambient music**: a synthesized Web Audio chord loop (not licensed tracks), default off, with a persisted toggle and volume.

## Persistence

All progress saves under the `wa-arcade-proto-v1` localStorage key: `cleared`, `stepAt`, `xp`, `pads`, `passed`, `checks`, `badges`, `branch`, `openWorlds`, `reflections`, `guide`, `recallDone`, `vol`, `muted`, and `musicOn`. Every storage call is wrapped in try/catch and **fails silently**; when localStorage is unavailable the app keeps running in memory, so never assume a write succeeded. The certificate name is deliberately excluded: it never enters localStorage.

## Hard constraints

- **One self-contained HTML file.** No added runtime dependencies beyond Google Fonts, no build step, no backend.
- **Offline.** PIXEL is scripted, hint-only guidance, not live inference; there are no hosted-model calls. The contract test asserts `api.anthropic.com` is absent.
- **No em dashes.** The contract test asserts no em dash is present in the HTML; the same applies to docs.
- **Accessibility.** Keyboard-focusable controls, visible focus rings, a skip link, an `aria-live="polite"` status region, aria labels on nodes and chrome, and full `prefers-reduced-motion` support (the four named animations are disabled).
- **The contract test pins content.** `tests/verify-workflow-arcade.mjs` requires specific strings present (the seven quest titles, `OVERWORLD MAP`, `THREE THREADS`, `BOSS CHECK`, `PEEK EXAMPLE`, `OFF-RAMP A`, `DEFENSE PACK`, `MUSIC:`, the AI-assisted disclosure) and absent (`api.anthropic.com`, any em dash). Run it after any content edit.
- **macOS only.** The curriculum teaches the macOS flow only.
- **Don't invent unstable UI labels** for install flows that may change. Teach the verified action and outcome instead.

## What changed from the prior version

Deliberately dropped in the v3 port:

- The interactive typed terminal (learners typed commands that pattern-matched against rules); it is now a **scripted** terminal that only renders fixed lines and never executes.
- The free-text PIXEL chat (`say`/`toggleChat`); PIXEL is now a **hint-only** rail.
- Sound effects.
- The old `MODULES` data model and its step fields (`hint`/`eg`/`where`/`scene`/`file`/`check`/`path` on MODULES, simulated-terminal `sim` rules, branching `path` steps). The current content lives in `QUESTS` with the step shape described above.

Kept from the prior version:

- The **ambient music** (the synthesized Web Audio chord loop, default off).

## Voice for instructional copy

Global voice rules apply (direct, active voice, serial commas, no em dashes). Project-specific: keep tool descriptions **non-anthropomorphizing**: PIXEL is a playful mascot, but do not describe tools as thinking or deciding. Define each term at first use.

## Locked direction

**Neon Grid v3 is the committed visual and curriculum direction.** Both are locked; do not re-explore them without a deliberate brainstorming cycle.

- Visual: `docs/design/neon-grid-direction.md` is the implementation contract for layout, palette, fonts, corners, borders, glow, animations, and per-screen specs.
- Curriculum: `docs/design/ai-workflow-skill-ladder.md` is the content layer. The seven quests are **Stage A** of the skill ladder, a complete, real off-ramp; Off-ramp A is a designed destination, not a midpoint. Stages B and C are documented but not built into the app.

## Design source of truth

- Status, file map, and source boundaries: `files/workflow-arcade-handoff.md` (curriculum is grounded in Anthropic's Claude Code docs and the ESF Companion docs/templates).
- The locked design spec and curriculum strategy live under `docs/design/`; other implementation plans and development logs are kept locally under `docs/` and are not part of the public repository.
