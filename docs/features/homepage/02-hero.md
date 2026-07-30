# Homepage Hero

**Status:** tickets created

## GitHub Issues

- Parent: [#12 Homepage Hero: recompose identity, portrait, and actions](https://github.com/j-allekine/j-allekine.github.io/issues/12)
- [#13 Homepage Hero: deliver approved identity and action workflow](https://github.com/j-allekine/j-allekine.github.io/issues/13)
- [#14 Homepage Hero: deliver responsive portrait composition](https://github.com/j-allekine/j-allekine.github.io/issues/14) — blocked by #13

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
- Use the approved compact composition with the portrait on the left and text on the right at `1280px` and wider.
- Use a nearly square portrait treatment in the desktop composition; below `1280px`, the portrait-first treatment may be slightly taller.
- Place the portrait before the name below `1280px`.
- Remove Hero social links because navigation owns them.
- Link `View selected work` to the homepage Featured Work section.
- Link `Contact me` to `/contact`.
- Use `↓` for `View selected work` and retain `↗` for `Contact me`.
- Stack both actions as full-width buttons at the `320px` minimum supported width, with `View selected work` first.
- At wider widths, size both actions to their content and use restrained backgrounds so they remain subordinate to the Hero identity and portrait.
- Replace tests that enforce the old Hero structure or CTA order.

## Resolved decisions

- Retain the intentional portrait placeholder for this chunk.
- The placeholder conveys no information until a real portrait is supplied, so assistive technology should skip it.
- `View selected work` scrolls to the homepage Featured Work section.
- `Contact me` opens `/contact`.
- The action icons communicate destination behavior: `↓` indicates an in-page scroll and `↗` indicates navigation to `/contact`.
- At `320px`, both actions use stacked full-width buttons so their complete labels and comfortable touch targets are preserved.
- At wider widths, the actions sit side by side at content width. The primary action has a restrained filled background and the secondary action has a subtle background; neither should overpower the Hero text.
- At `1280px` and wider, use the compact portrait-left, text-right composition validated in the Hero prototype. This replaces the earlier portrait-right direction.
- The desktop portrait is nearly square. Below `1280px`, it may become slightly taller while preserving the portrait-first reading order.

## Deferred implementation checkpoints

- Treat the prototype C measurements—approximately a `760px` compact shell, `288px` desktop portrait, and `42px` desktop name—as starting targets rather than locked acceptance values.
- Decide whether to add a restrained halftone texture when an approved real portrait exists.

## Ready for tickets when

- Identity, Hero copy, and both action destinations are approved.
- Portrait state and alternative text are decided.
- Desktop, tablet, and mobile content order is testable.
