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

## Development

When starting the dev server, use background mode:

```sh
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
