# Workflow Arcade

A pixel-art learning game that teaches first-time macOS users how to work with [Claude Code](https://code.claude.com/docs) and the Epistemic Stewardship Framework (ESF). Seven quests take a complete stranger from an empty Terminal to a finished, verified, honestly disclosed first project, with the judgment staying human the whole way.

The entire app is one self-contained HTML file. No build step, no accounts, no backend, no telemetry. PIXEL, the in-game tutor, is fully offline scripted guidance; nothing the app does calls a hosted model or touches your files.

## Play

**Live: [nmadrid27.github.io/workflow-arcade](https://nmadrid27.github.io/workflow-arcade/)**

Or run it locally:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/files/workflow-arcade.html`. Opening `files/workflow-arcade.html` directly in a browser also works.

## The quests

1. **Start Your First Claude Code Project**: folder, install, `/init`, `CLAUDE.md`.
2. **Teach Claude How to Work With You**: a concise, testable collaboration profile.
3. **Add ESF Companion**: the Cowork plugin or manual templates, your choice.
4. **Complete Your First Small Project**: position, exploration, verification, disclosure.
5. **Steer the Session**: permission prompts, Esc, plan mode, `/clear`.
6. **Put the Project Under Version Control**: git basics, reading every diff before approving.
7. **Recover When It Goes Wrong**: stop, inspect, revert, and keep the lesson.

Along the way: simulated terminals that show state changing and never execute anything, practice pads with worked examples and honest structural answer checking, an exportable field guide, real artifact downloads built from your own writing, badges, and a completion certificate.

## Development

```bash
node tests/verify-workflow-arcade.mjs
```

The contract test (Node standard library only) is the completion gate: it pins required and forbidden strings, including the rule that no hosted-model endpoint ever appears in the app. Project conventions live in `AGENTS.md`.

## License

[MIT](LICENSE).

## Disclosure

This project was built through AI-assisted collaboration. Nathan Madrid set the audience, curriculum direction, scope, and every design decision, and reviewed each change. Claude Code and Codex implemented, reviewed, and verified the work under that direction. The division of labor is summarized in `files/workflow-arcade-handoff.md`.
