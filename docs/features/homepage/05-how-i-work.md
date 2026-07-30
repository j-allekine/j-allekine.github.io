# Homepage How I Work

**Status:** ready for tickets

## Goal

Retain the existing four-step interaction and integrate it cleanly into the new editorial shell.

## Root spec coverage

- Section 20: preserved interaction and refinement
- Sections 29 and 31–35: typography, surfaces, and motion
- Sections 36–39: responsive placement

## Planned scope

- Preserve Discovery, Plan, Build, and Launch.
- Preserve the current descriptions, audience voice, and icons as approved content.
- Preserve one selected step and one shared description panel.
- Preserve accessible tab semantics and keyboard selection.
- Refine the description panel into a centered reading-width surface on wider screens.
- Let the description panel use the available width on narrow screens.
- Let the panel height adapt to the selected description.
- Preserve a usable reduced-motion state.
- Avoid redesigning the component beyond the root spec's spacing-focused refinement.

## Approved behavior

- Keep the existing copy, client-facing `you` voice, icons, step labels, and visual progression.
- Keep all four step labels visible at once on narrow screens.
- Keep pointer and touch selection.
- Keep immediate selection when arrow, Home, or End keys move focus.
- Keep one keyboard-focusable shared panel associated with the selected tab.
- Center the panel at a maximum width of approximately `640px` on wider screens.
- Use the full available width on narrow screens.
- Size the panel naturally for each description instead of reserving the height of the longest description.
- Use a subtle height transition when the selected description changes.
- Change height immediately when the visitor prefers reduced motion.

## Acceptance criteria

- Discovery, Plan, Build, and Launch retain their existing copy and icons.
- Exactly one step is selected and exactly one shared description panel is visible.
- Pointer, touch, arrow, Home, and End interactions select the expected step.
- Focus remains visible and follows keyboard selection.
- The selected tab and shared panel retain correct tab and tabpanel relationships.
- The panel is centered and no wider than approximately `640px` on wider screens.
- The panel uses the available section width without horizontal overflow on narrow screens.
- The panel grows or shrinks to fit each description without clipping.
- The height change is subtle and does not delay access to the selected content.
- Reduced motion removes the height transition without removing the interaction.
- All four step labels remain visible at supported narrow widths.
- Existing How I Work tests are updated to validate the production Astro route instead of the standalone HTML reference.
