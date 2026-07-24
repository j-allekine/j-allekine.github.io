# Issue tracker: Local Markdown

Issues and specifications for this repository live as Markdown files under `.scratch/`.

## Conventions

- Keep one feature per `.scratch/<feature-slug>/` directory.
- Store the feature specification at `.scratch/<feature-slug>/spec.md`.
- Store implementation issues as individual files under `.scratch/<feature-slug>/issues/`.
- Number implementation issues from `01`, using `<NN>-<slug>.md`.
- Record triage state with a `Status:` line near the top of an issue or specification.
- Append discussion history under a `## Comments` heading when needed.

## Publishing

When a skill says to publish to the issue tracker, create or update the appropriate Markdown file under `.scratch/`.

When a skill says to fetch a ticket, read the referenced file from `.scratch/`.
