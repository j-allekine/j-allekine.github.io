# 06 — Apply the typography and motion system

**What to build:** Finish the portfolio’s calm technical reading experience with self-hosted typography and restrained interaction feedback. Text remains highly readable, metadata stays secondary, and visitors who request reduced motion encounter no nonessential movement.

**Blocked by:** 03 — Browse all three case studies; 04 — Understand capabilities and make contact; 05 — Navigate the portfolio accessibly.

**Status:** ready-for-agent

- [ ] Geist Sans is self-hosted as the primary font with sensible system fallbacks, and Geist Mono is self-hosted for restrained metadata use.
- [ ] Body copy uses the agreed fluid 17–18px sizing, 1.6 line height, and regular weight; reading paragraphs target 60–68 characters when space permits and never exceed 68 characters.
- [ ] Headings use Geist Sans at medium or semibold weight without thin weights or aggressive negative letter spacing.
- [ ] Geist Mono is limited to project numbering, categories, tools, workflow notation, and similar metadata, and is never used for paragraph copy.
- [ ] The predominantly white canvas, near-black text, thin rules, restrained gray hierarchy, square cards, and black contact section remain legible with strong contrast and without decorative color, gradients, shadows, pills, glass effects, or terminal styling.
- [ ] The wide layout respects the agreed maximum width, fluid horizontal gutters, twelve-column desktop grid, separate reading width, and fluid section spacing.
- [ ] Interaction feedback is limited to the agreed link, button, card, and mobile-menu states, using 160–200ms ease-out timing and no more than the allowed arrow or card movement.
- [ ] The experience contains no scroll reveals, page-load animation, parallax, cursor effects, dramatic lifting, delayed reading, or decorative faith-signal animation.
- [ ] Under reduced-motion preference, scroll behavior becomes automatic and every element and both pseudo-elements receive the required near-zero transition and animation duration override.
- [ ] Browser acceptance coverage verifies font roles, reading-width limits, permitted motion values, and computed reduced-motion behavior for elements and pseudo-elements.
- [ ] The production build, browser acceptance suite, and repository diff hygiene check pass.
