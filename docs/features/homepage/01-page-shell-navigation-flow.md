# Homepage Page Shell, Navigation, and Section Flow

**Status:** completed

## Goal

Create the responsive structure that every homepage section will use.

## Root spec coverage

- Sections 3–6: page structure, sidebar, responsive navigation, and width system
- Sections 24–27: continuous page flow, responsive social links, and faith treatment
- Sections 29 and 31–35: shared typography and visual language
- Sections 36–39: responsive composition and approved shell decisions

## Planned scope

- This phase edits and validates `homepage-updated.html` only. Migration into the Astro `src/` tree is deferred until the standalone homepage is complete.
- Use a persistent `224–240px` left navigation at `1280px` and wider, with the Bryl reference treated as frozen for the desktop navigation structure and visual relationship.
- Below `1280px`, replace the persistent navigation with a compact sticky top bar and a temporary full-height left-side navigation panel, layered over the homepage like ChatGPT's responsive sidebar behavior.
- Give the main content the correct offset beside the desktop sidebar.
- Establish the reading, Hero, and Featured Work width categories.
- Use the page order: Hero, Featured Work, Stack, How I Work, About, Contact, Footer.
- Remove the homepage Services section and its obsolete styles, scripts, navigation entries, and tests.
- Place GitHub, LinkedIn, Email, and `Colossians 3:23` in the desktop navigation and responsive panel.
- Keep the homepage visible in continuous document flow beneath the responsive panel. Do not add accordions or collapsed homepage sections.
- Use the `J. ALLEKINE` brand as the sole Home control.
- When a visitor selects `Work`, `Stack`, or `Contact` from the responsive panel, close the panel and navigate to `/work`, `/stack`, or `/contact`.
- Do not change navigation state in response to scrolling through homepage sections.
- Make the responsive navigation panel keyboard accessible, closeable, and safe across resize.
- When the panel opens, move focus to its close control and keep keyboard focus within the panel. `Tab` from the last focusable item wraps to the first; `Shift+Tab` from the first wraps to the last.
- Close the panel with its close control, a backdrop click, Escape, or a selected navigation link. Restore focus to the menu control when it remains available.
- Lock background scrolling and make the homepage content inert while the panel is open. Restore the visitor's scroll position when it closes.
- If the viewport crosses to `1280px` or wider while the panel is open, close it and clear its temporary state without moving focus to a hidden mobile control.

## Needs Info

None. Primary navigation uses the page routes Work (`/work`), Stack (`/stack`), and Contact (`/contact`). The `J. ALLEKINE` brand is the Home control and returns to `/`. Shell screenshot review uses `320`, `768`, `1279`, `1280`, and `1440` px widths.

## GitHub tickets

- [#8 — remove obsolete Services implementation](https://github.com/j-allekine/j-allekine.github.io/issues/8)
- [#9 — establish responsive page composition and section flow](https://github.com/j-allekine/j-allekine.github.io/issues/9)
- [#10 — add active state and accessible panel behavior](https://github.com/j-allekine/j-allekine.github.io/issues/10)

All three tickets are implemented, validated, and closed. The final integrated review is tracked separately in [#11](https://github.com/j-allekine/j-allekine.github.io/issues/11).

## Ready for tickets when

- Responsive navigation presentation, page-route behavior, and destinations are decided.
- Responsive navigation keyboard, focus containment and return, scroll lock, backdrop, Escape, and resize behavior are explicit.
- The current implementation phase is scoped to `homepage-updated.html`; Astro migration is deferred.
- The Services removal boundary includes its obsolete CSS, JavaScript, and tests.
