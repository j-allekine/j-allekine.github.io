# 05 — Navigate the portfolio accessibly

**What to build:** Provide a consistent, restrained identity and navigation experience across every page. Desktop, mobile, keyboard, and screen-reader visitors can reach work, capabilities, resume, GitHub, and contact information without sticky-header behavior, spatial surprises, or inaccessible controls.

**Blocked by:** 01 — Open one featured case study.

**Status:** ready-for-agent

- [ ] A shared static header appears on every page with direct, familiar navigation labels and remains in normal document flow at every viewport.
- [ ] Desktop navigation remains visible, while mobile navigation expands directly below the header in normal document flow.
- [ ] The mobile-menu control is a native keyboard-operable control, exposes its open state and controlled region, and closes through the same control or the Escape key.
- [ ] Client-side JavaScript is limited to the mobile-navigation interaction; static presentation components are not hydrated.
- [ ] A skip link is the first focusable control, becomes visibly apparent on focus, and moves navigation or focus to the main-content target.
- [ ] Interactive elements have visible focus treatment, adequate target sizes, understandable accessible names, and states that are not communicated by color alone.
- [ ] Pages use semantic header, navigation, main, and footer landmarks, ordered headings, lists for repeated structured content, and figures with captions for project media.
- [ ] One reusable Latin-cross faith signal uses the agreed proportions, `currentColor`, and restrained divider-like stroke weight in the identity system.
- [ ] The full faith signal appears in the header, a simplified readable form replaces the existing favicon artwork while preserving current formats, and any optional footer use occurs only when needed for visual balance.
- [ ] Decorative faith signals are hidden from the accessibility tree when adjacent identity text already provides the identity, and the mark is not animated or used as repeated decoration.
- [ ] Browser acceptance coverage verifies skip-link behavior, focus visibility, landmarks, accessible names, desktop and mobile navigation, Escape handling, controlled state, and the header’s non-sticky position while scrolling.
- [ ] The production build, browser acceptance suite, and repository diff hygiene check pass.
