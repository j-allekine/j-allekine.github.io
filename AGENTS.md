# Agent instructions

## Project context

Read `CONTEXT.md` before making implementation decisions.

## Issue tracker

Issues and specifications are tracked as local Markdown under `.scratch/`.

See `docs/agents/issue-tracker.md`.

## Triage labels

Use the canonical triage-state names defined in:

`docs/agents/triage-labels.md`

## Domain documentation

This repository has one primary domain context.

Before working, read:

- `CONTEXT.md`
- relevant records under `docs/adr/`
- `docs/agents/domain.md`

Use the project glossary's canonical vocabulary and report conflicts with existing architecture decisions.

## Working rules

- Do not expand scope without approval.
- Inspect existing files before editing.
- Present an implementation plan before substantial changes.
- Run relevant validation commands after editing.
- Do not invent content, metrics, links, or project details.

## Testing
Three-pass definition of done.

- Shell: The structure, layout, states, and navigation are complete.

- Function: The workflows, logic, components, states, and navigation are complete.

- Usability: A real user can understand the system, complete the primary task, recover from mistakes, and receive clear feedback.

## Development

When starting the dev server, use background mode:

```sh
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

For Astro-specific implementation guidance, see docs/agents/astro.md when relevant.
