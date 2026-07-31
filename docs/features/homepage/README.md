# Homepage Redesign Implementation Plan

**Status:** needs more info

This folder splits the homepage redesign plan into independently reviewable implementation chunks. Each file has its own status and `Needs Info` section.

The root design direction remains authoritative. The expected source file is `portfolio-homepage-updated.html-redesign-spec.md` at the repository root; it is currently not present in the workspace.

The implementation target is:

- [`homepage-updated.html`](../../../homepage-updated.html)

This folder is a planning map, not a replacement design specification. Link existing GitHub Issues from the relevant chunk; do not create additional issues until a chunk reaches `ready for tickets`.

## Status values

- `needs more info` — a product, content, destination, or testing decision is still required
- `ready for tickets` — the chunk is sufficiently decided and can be split into actionable GitHub Issues
- `tickets created` — the required GitHub Issues exist and are linked from the chunk
- `completed` — the chunk has been implemented and passed the required validation

## Status summary

| Plan file | Status |
| --- | --- |
| [00-shared-decisions.md](00-shared-decisions.md) | `completed` |
| [01-page-shell-navigation-flow.md](01-page-shell-navigation-flow.md) | `completed` |
| [02-hero.md](02-hero.md) | `tickets created` |
| [03-featured-work.md](03-featured-work.md) | `needs more info` |
| [04-stack.md](04-stack.md) | `ready for tickets` |
| [05-how-i-work.md](05-how-i-work.md) | `needs more info` |
| [06-about.md](06-about.md) | `needs more info` |
| [07-contact-footer.md](07-contact-footer.md) | `needs more info` |
| [08-integrated-review.md](08-integrated-review.md) | `completed` |

## Current baseline

`homepage-updated.html` contains a responsive header and mobile sidebar, a Hero with a portrait placeholder, a Featured Work spotlight deck, a Stack marquee, a four-step How I Work interaction, About, Contact, and a footer. Services markup, styling, behavior, and obsolete tests are removed. It also has responsive, interaction, reduced-motion, accessibility-oriented, and visual-regression tests tied to the current design.

The redesign changes the shell, breakpoint, page flow, Hero hierarchy, Featured Work behavior, and end-of-page content. Existing CSS, JavaScript, and tests must be updated deliberately.

## Needs Info

- Restore or provide the expected root redesign spec before finalizing any chunk against its detailed design direction.
- Restore or provide `mockup.png` if visual comparison against the composition reference is required.
- The shared decisions in [00-shared-decisions.md](00-shared-decisions.md) are resolved; dependent chunks still need their own decisions before moving to `ready for tickets`.

## Dependency map

```text
00 Shared decisions
          |
          v
01 Page shell, navigation, and section flow
          |
   +------+------+------+------+------+------+
   |      |      |      |      |      |      |
   v      v      v      v      v      v      v
 02     03     04     05     06     07   (section chunks)
 Hero  Work  Stack Process About Contact
   \      |      |      |      |      /
    +-----+------+------+------+-----+
                    |
                    v
             08 Integrated review
```

Chunks 2–7 may be prepared in parallel after the shared decisions and shell decisions are stable. Chunk 8 depends on all implementation chunks.

## Blocker map

This is the readiness tracker for the homepage feature. A chunk can be drafted in parallel with another chunk, but it cannot move to `ready for tickets` while one of its listed blockers remains unresolved.

| Plan | Current status | Can be prepared in parallel with | Must be resolved before `ready for tickets` |
| --- | --- | --- | --- |
| [00 Shared decisions](00-shared-decisions.md) | `completed` | None; this is the shared decision gate | Keep the decisions synchronized with `CONTEXT.md`, the root PRD, and dependent chunks |
| [01 Page shell, navigation, and section flow](01-page-shell-navigation-flow.md) | `completed` | None; it was the implementation gate | Implement and validate `homepage-updated.html`; defer Astro migration |
| [02 Hero](02-hero.md) | `tickets created` | 03–07 after 01 is ready | Implement [#13](https://github.com/j-allekine/j-allekine.github.io/issues/13), then [#14](https://github.com/j-allekine/j-allekine.github.io/issues/14), under parent [#12](https://github.com/j-allekine/j-allekine.github.io/issues/12) |
| [03 Featured Work](03-featured-work.md) | `needs more info` | 02, 04–07 after 01 is ready | Approved projects, media, copy, case-study behavior, heading wording, and deck keyboard behavior |
| [04 Stack](04-stack.md) | `ready for tickets` | 02–03 and 05–07 after 01 is ready | Create focused implementation issues from the resolved decisions and ticket requirements |
| [05 How I Work](05-how-i-work.md) | `ready for tickets` | 02–04 and 06–07 after 01 is ready | Create focused implementation issues from the resolved decisions and acceptance criteria |
| [06 About](06-about.md) | `needs more info` | 02–05 and 07 after 01 is ready | Approved About copy/values, résumé decision, heading, and résumé action behavior |
| [07 Contact and Footer](07-contact-footer.md) | `needs more info` | 02–06 after 01 is ready | Contact copy/action, real destination, footer-year behavior, and focus behavior |
| [08 Integrated review](08-integrated-review.md) | `completed` | None; final integration gate for the current standalone shell | The current standalone shell, navigation, and review evidence are complete; later content chunks remain separately gated |

### Parallelization rule

The shared decisions and plan 01 are currently ready. Plans 02–07 can now be specified and ticketed in parallel, subject to their own `Needs Info` sections. Plan 08 remains last because it validates the integrated page rather than one isolated section.

### Blocker rule

Do not mark a plan `ready for tickets` merely because its code scope is clear. Its content, destinations, interaction behavior, and testing decisions must also be resolved. If a decision in `00-shared-decisions.md` changes, re-check every affected plan before creating tickets.

## Risk assessment

| Risk | Affected plans | Impact | Likelihood | Mitigation / exit condition |
| --- | --- | --- | --- | --- |
| Root PRD/spec is not present at the expected repository path | All plans | High | High | Restore the PRD or record the authoritative source/version before final ticket creation |
| Shared decisions and chunk files can drift | 00, 01–07 | High | High | Treat `00-shared-decisions.md` as the decision gate; reconcile each dependent `Needs Info` list before changing status |
| Terminology can drift after the shared decisions are resolved | 00, 02, 04 | Medium | Medium | Keep `CONTEXT.md` and `00-shared-decisions.md` synchronized when wording changes; re-check the Hero and Stack plans before ticket creation |
| The standalone HTML is a large legacy file with multiple old breakpoints and interaction layers | 01–08 | High | High | Establish the shell first, consolidate around the `1280px` breakpoint, and avoid stacking new overrides on obsolete rules |
| The test suite is in transition and may still encode behavior rejected by the redesign, including Services or swipe behavior | 03, 08 | High | Medium | Identify each test as retain, rewrite, replace, or remove before the related plan reaches `ready for tickets` |
| Approved copy, project media, résumé, and destinations are incomplete | 02, 03, 06, 07 | High | High | Use only approved content or explicitly approved neutral placeholders; do not invent claims, logos, metrics, or links |
| Responsive navigation panel, deck, and process accessibility behavior is underspecified | 01, 03, 05, 08 | High | Medium | Define focus, keyboard, live-region, resize, scroll-lock, and reduced-motion outcomes in each ticket |
| The redesign target and deployed production source may diverge | All plans | Medium | Medium | Keep the target file explicit and create a separate migration issue if the Astro site must eventually consume these changes |

## Ticket creation rules

- Keep one feature or independently actionable change per GitHub Issue.
- Use the issue body for the user scenario, scope, exclusions, implementation decisions, acceptance criteria, and testing decisions.
- Use canonical triage labels from [`docs/agents/triage-labels.md`](../../../docs/agents/triage-labels.md).
- Apply `ready-for-agent` only when the issue is fully specified.
- Link blocking and related issues explicitly.
- Record created issue links in the relevant chunk file, then change that file's status to `tickets created`.

## Completion rule

A chunk moves to `completed` only after its tickets are closed, the implementation is present in `homepage-updated.html`, relevant automated checks pass, required visual checkpoints are approved, and the applicable Shell, Function, and Usability criteria pass.
