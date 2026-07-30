# Homepage Hero

**Status:** ready for tickets

## Goal

Recompose the Hero around Jihm's identity, evidence-first positioning, portrait, faith signal, and two clear actions.

## Root spec coverage

- Sections 7–9: desktop and responsive Hero
- Sections 27 and 29: faith and typography treatment
- Sections 36–39: responsive composition and approved Hero decisions

## Planned scope

- Remove the `Systems & Automation Developer` eyebrow.
- Use `JIHM ALLEKINE / ALMEDILLA` as the primary visual anchor.
- Add “I am an automation specialist.” below the name.
- Preserve the approved supporting and faith paragraphs.
- Use `View selected work` as the primary action and `Contact me` as the secondary action.
- Keep the intentional portrait placeholder until an approved real portrait exists.
- Treat the placeholder as decorative and hide it from assistive technology.
- Use text-left and portrait-right composition at `1280px` and wider.
- Place the portrait before the name below `1280px`.
- Remove Hero social links because navigation owns them.
- Link `View selected work` to the homepage Featured Work section.
- Link `Contact me` to `/contact`.
- Use `↓` for `View selected work` and retain `↗` for `Contact me`.
- Stack both actions as full-width buttons at the `320px` minimum supported width, with `View selected work` first.
- Replace tests that enforce the old Hero structure or CTA order.

## Resolved decisions

- Retain the intentional portrait placeholder for this chunk.
- The placeholder conveys no information until a real portrait is supplied, so assistive technology should skip it.
- `View selected work` scrolls to the homepage Featured Work section.
- `Contact me` opens `/contact`.
- The action icons communicate destination behavior: `↓` indicates an in-page scroll and `↗` indicates navigation to `/contact`.
- At `320px`, both actions use stacked full-width buttons so their complete labels and comfortable touch targets are preserved.

## Ready for tickets when

- Identity, Hero copy, and both action destinations are approved.
- Portrait state and alternative text are decided.
- Desktop, tablet, and mobile content order is testable.
