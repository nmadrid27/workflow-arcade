# Workflow Arcade: Build Handoff

## What This Is

Workflow Arcade is a public, pixel-art learning experience for first-time macOS users. It teaches a seven-quest progression:

1. Create a project folder, install Claude Code, open the folder, and run `/init` to generate `CLAUDE.md`.
2. Write and test a concise "How to Work With Me" profile in `CLAUDE.md`.
3. Add ESF Companion through the Cowork plugin or manual templates.
4. Complete a learner-chosen small project, verify it, and disclose AI use.
5. Steer live sessions: read permission prompts, interrupt with Esc, use plan mode, run `/clear`, and promote repeated corrections into `CLAUDE.md`.
6. Put the project under version control: `git init`, Claude-driven commits, and reading every diff before approving.
7. Recover from mistakes: stop, inspect with `git status` and `git diff`, revert with `git restore`, and promote the lesson into `CLAUDE.md`.

The application is one self-contained HTML file. It has no build step or JavaScript dependencies. Google Fonts is the only external runtime dependency.

## Current Status

The seven quests are complete and playable. The app includes:

- A one-step-at-a-time walkthrough for every quest.
- Simulated terminals that never execute commands.
- Practice pads that persist on the device.
- Soft-gated XP and quest completion.
- A persistent Cowork plugin or manual-template choice in quest three.
- Keyboard-accessible quest navigation and visible focus states.
- An offline PIXEL guide with scripted Claude Code and ESF guidance.
- Responsive desktop and mobile layouts.
- Copy buttons on reference code blocks.
- A footer control that resets device progress after confirmation.
- Step chips that name the surface each action runs on.
- A home-screen button that resumes the next uncleared quest.
- A quest log grouped into three collapsible worlds, with the active world open by default.
- A CHECK ANSWER button on practice pads that runs an honest structural check and banks XP.
- A field guide where learners save steps with their notes and export them as Markdown.
- ON YOUR MACHINE panels on artifact steps: a file tree showing where the artifact lives, with a download built from the learner's pad text. The app never writes to the project folder.
- Achievement badges tied to target behaviors, not grind. Eight badges fire from specific quest-complete, CHECK ANSWER, recovery-sim, and field-guide export points, and a badge case on the home screen shows earned and unearned badges.
- A completion certificate rendered on a canvas and downloaded as a PNG once all seven quests are cleared. The learner adds a name for the certificate, and that name is never persisted to the device.
- An overworld quest map on the home screen with accessible node buttons over a decorative canvas path. The canvas paints three zone bands and a dotted trail between quests; seven keyboard-focusable, aria-labeled node buttons overlay it and open each quest, with cleared, current, and future states.
- A first-run orientation card on the home screen explaining the arcade mechanics, dismissed once per device.
- Social and search meta tags, an inline SVG favicon, a skip-to-content link, and a footer link to the GitHub issue tracker.

PIXEL does not call a hosted model. Its status explicitly identifies it as an offline guide.

## Project Files

- `files/workflow-arcade.html`: the complete application.
- `files/workflow-arcade-handoff.md`: this continuation guide.
- `tests/verify-workflow-arcade.mjs`: the static completion contract.

The approved design spec, implementation plan, and development log are kept locally under `docs/` and are not committed to the public repository.

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

The browser verification pass should cover all seven quests, both quest-three branches, XP, refresh persistence, keyboard navigation, PIXEL replies, and a 390-pixel mobile viewport.

## File Organization

The HTML contains four main code sections:

- `PIX`: canvas avatar engine and animation states.
- `CONTENT`: the `MODULES` array with all seven quests.
- `PIXEL GUIDANCE`: offline scripted responses.
- `APP`: rendering, branching, persistence, XP, and chat flow.

## Lesson Data Model

Each module contains:

```js
{
  id,
  ready,
  xp,
  title,
  sub,
  why,
  steps,
  tryit,
  checkpoint
}
```

A step supports:

```js
{ h, b, code, see, sim, pad, path, where, hint, eg }
```

- `h`: action heading.
- `b`: explanation.
- `code`: optional reference block.
- `see`: optional success cue.
- `sim`: simulated-terminal rules.
- `scene`: optional state panel for `sim` steps. Step-level `scene` is the initial state panel above a simulated terminal; a rule-level `scene` replaces the panel when that rule matches. Lines starting with `*` render amber as changed state.
- `pad`: saved practice-pad prompt.
- `path`: optional branch key. Quest three uses `cowork` and `manual`.
- `where`: optional surface key (`terminal`, `claude`, `cowork`, `desktop`, `browser`). Rendered as a step chip through `WHERE_LABELS`. The `claude` value switches the simulated prompt glyph to `>`.
- `hint`: step-specific guidance that PIXEL delivers when the learner presses HINT. Steps without one fall back to keyword matching, which is usually generic.
- `eg`: an optional worked example revealed by a SHOW EXAMPLE button under the practice pad.
- `check`: optional structural criteria for the CHECK ANSWER button, an array of `{ any, label }` keyword groups. The feedback copy states that the check reads structure, not understanding.
- `file`: optional ON YOUR MACHINE panel, `{ path, head, name, note, paths, mark }`. Shows where the artifact lives in the project; with `head`, offers a download built from the learner's pad text. The browser cannot write into the project folder, so the learner places the file deliberately.

Branching modules define:

```js
branch: {
  cowork: 'Cowork plugin',
  manual: 'Manual templates'
}
```

Both branches retain shared steps that do not define `path`.

## Persistence

Progress saves under the `wa-progress` local-storage key:

- XP.
- Completed quests.
- Practiced steps.
- Last viewed walkthrough position.
- Practice-pad text.
- Selected ESF installation branch.
- Open or collapsed state of each quest-log world.
- Saved field-guide entries.
- Earned badges.
- Sound preference and whether the orientation card was dismissed.

The certificate name is deliberately excluded from persistence; it lives only in the input and on the canvas. Storage calls fail silently when local storage is unavailable, so the application continues in memory.

## Source Boundaries

Curriculum guidance is grounded in:

- Anthropic's official Claude Code documentation for macOS setup, project startup, `/init`, and `CLAUDE.md`.
- The ESF Companion Cowork plugin documentation for `/esf-start`, `/esf-status`, plan requirements, and workspace state.
- The ESF Companion repository templates for the manual path.

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
- PIXEL uses scripted guidance, not live inference.
- The app teaches macOS only.
- Cowork plugin access requires Claude Desktop Pro, Max, Team, or Enterprise.

## Disclosure

This project was completed through AI-assisted collaboration. Nathan Madrid set the audience, curriculum direction, macOS scope, learner-chosen final project, dual ESF installation paths, Cowork plugin preference, and final design approvals. Codex reviewed the original files, tested the existing interface, verified source documentation, structured the specification and implementation plan, implemented the approved changes, and ran static and browser verification. Nathan remained responsible for the project direction and approval decisions.
