# Workflow Arcade

A public, pixel-art learning app that teaches first-time macOS users a seven-quest Claude Code onboarding path (start a project and run `/init`, write a `CLAUDE.md` work profile, add the ESF Companion, complete and disclose a small project, steer live sessions, put the project under git, recover from mistakes). The whole app is one self-contained HTML file with no build step.

## Commands

- **Serve:** `python3 -m http.server 4173`, then open `http://localhost:4173/files/workflow-arcade.html`
- **Contract test:** `node tests/verify-workflow-arcade.mjs` (Node standard library only; nothing to install)

There is no package.json, bundler, linter, or build step. Editing is direct file editing.

## Architecture

Everything renders from `files/workflow-arcade.html` (~944 lines). Google Fonts is the only external runtime dependency. The `<script>` block has four sections, each marked by a banner comment:

- **PIX**: canvas pixel-avatar engine. PIXEL is drawn cell-by-cell on a 16x16 grid; animation is state-driven (`idle`, `bored`, happy burst, etc.).
- **CONTENT**: the `MODULES` array. All quests live here **as data**. Add or change a lesson by editing a module, not the rendering logic. A `WORLDS` array groups quest ids into collapsible quest-log drawers; a new quest must be added to a world or it will not appear in the log. A `BADGES` array defines the eight achievement badges, each tied to a target behavior; `award(id)` grants one once and is wired at specific quest-complete, CHECK ANSWER, sim, and field-guide export points. Once all seven quests are cleared the home hero and finish card offer a completion certificate (`openCert`/`drawCert`/`downloadCert`) rendered to a canvas and downloaded as a PNG; the learner name on it is never persisted. The home screen also renders an overworld quest map (`questMapHtml`/`mapNode`/`drawMap`): a decorative `#mapcv` canvas paints the zone bands and the dotted trail, and accessible `.mapnode` buttons overlay it as the functional, focusable, aria-labeled quest nodes.
- **PIXEL GUIDANCE**: `fallbackReply`, the offline scripted tutor responses.
- **APP**: navigation, rendering, branching, XP, persistence, and chat flow.

The app is content-driven: `MODULES` is the source, and the APP section walks it to render walkthroughs, simulated terminals, and practice pads.

## Data model

```
module: { id, ready, xp, title, sub, why, steps[], tryit, checkpoint }
step:   { h, b, code?, see?, sim?, pad?, path?, where?, hint?, eg?, check?, file? }
```

- `sim`: simulated-terminal rules: an array of `{ req:[tokens], key?, out, name? }`. The terminals **never execute commands**; they pattern-match the typed input against `req` tokens and print `out`. `key:true` marks the step's required command.
- `scene`: optional state panel for `sim` steps, an array of strings rendered above the terminal. Step-level `scene` is the initial state panel; a rule-level `scene` replaces the panel when that rule matches. Lines starting with `*` render amber as changed state.
- `pad`: a practice-pad prompt. Pad text persists per device.
- `path`: a branch key. Quest 3 ("Add ESF Companion") defines `branch: { cowork, manual }`; steps with `path:'cowork'` or `path:'manual'` show only on that branch, and steps without `path` are shared.
- `where`: optional surface key (`terminal`, `claude`, `cowork`, `desktop`, `browser`) rendered as a chip via `WHERE_LABELS`; `where:'claude'` also switches the sim prompt glyph to `>`.
- `hint`: step-specific guidance PIXEL delivers when the learner presses HINT. Without it, HINT falls back to keyword matching in `fallbackReply`, which is usually generic; every step should define one.
- `eg`: an optional worked example revealed by a SHOW EXAMPLE button under the practice pad. Keep examples short and concrete so they model the answer without replacing the learner's work.
- `check`: optional structural criteria for CHECK ANSWER, an array of `{ any:[terms], label }`. The check is keyword matching, never understanding; feedback copy must stay honest about that, and pads bank XP only through CHECK ANSWER.
- `file`: optional ON YOUR MACHINE panel, `{ path, head?, name?, note?, paths?, mark? }`. Renders a project file tree marking where the artifact lives; with `head`, a DOWNLOAD button builds a real file from `head` plus the learner's pad text. The app never writes into the project folder; the learner places the file. `paths` plus `mark` draws a multi-file overview with no download.

## Persistence

All progress lives under the `wa-progress` localStorage key: `{ xp, done, practiced, stepAt, pads, branchChoice, openWorlds, guide, badges, soundOn, oriented, musicOn, musicVol }`. Every storage call is wrapped in try/catch and **fails silently**; when localStorage is unavailable the app keeps running in memory, so never assume a write succeeded. The certificate name is deliberately excluded: it never enters localStorage.

## Hard constraints

- **PIXEL stays offline.** No hosted-model calls. The contract test asserts `api.anthropic.com` is absent. PIXEL is scripted guidance, not live inference.
- **One self-contained HTML file.** No added runtime dependencies, no build step.
- **The contract test pins content.** `tests/verify-workflow-arcade.mjs` requires specific strings present (the quest titles, `/esf-start`, `/esf-status`, `branchChoice`, `aria-live="polite"`, the AI-assisted disclosure) and absent (`api.anthropic.com`, the old local-model curriculum titles). Run it after any content edit.
- **macOS only.** The curriculum teaches the macOS flow only.
- **Don't invent unstable UI labels** for install flows that may change (e.g. Cowork plugin). Teach the verified action and outcome instead.

## Voice for instructional copy

Global voice rules apply (direct, active voice, serial commas, no em dashes). Project-specific: keep tool descriptions **non-anthropomorphizing**: PIXEL is a playful mascot, but do not describe tools as thinking or deciding. Define each term at first use.

## Design source of truth

- Status, file map, and source boundaries: `files/workflow-arcade-handoff.md` (curriculum is grounded in Anthropic's Claude Code docs and the ESF Companion docs/templates)
- The approved design spec, implementation plan, and development log are kept locally under `docs/` and are not part of the public repository.
