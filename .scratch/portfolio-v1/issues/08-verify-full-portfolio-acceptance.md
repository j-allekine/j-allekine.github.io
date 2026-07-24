# 08 — Verify full portfolio acceptance

**What to build:** Validate the complete Portfolio v1 experience at the user-visible boundary and correct any integration gaps. The finished static site must satisfy the approved structure, navigation, responsive behavior, accessibility, motion, metadata, content-honesty, and presentation decisions as one coherent release candidate.

**Blocked by:** 06 — Apply the typography and motion system; 07 — Add metadata and stable media.

**Status:** ready-for-agent

- [x] The production Astro build succeeds before the Playwright acceptance suite runs.
- [x] The acceptance suite verifies the homepage section order, exactly three featured-work cards, all three generated case-study routes, and the required seven-section case-study order.
- [x] The suite verifies Overview fields, Problem limits and meaning, ordered Solution workflow and primary visual, distinct contribution list, honest Results presentation, two or three Key Decisions, and captioned gallery hierarchy.
- [x] The suite verifies non-circular project navigation, shared contact and footer behavior, back-to-top access, internal-link integrity, and honest configured versus unconfigured external actions.
- [x] The suite verifies the skip link, keyboard focus, semantic landmarks, ordered headings, figures, captions, accessible names, mobile-menu state and Escape behavior, and the static header.
- [x] Automated responsive checks cover the agreed card and gallery arrangements at representative 1280px, 768px, and 375px viewports.
- [x] Reduced-motion emulation verifies automatic scroll behavior and the required near-zero transition and animation durations for elements and pseudo-elements.
- [x] Human visual-review screenshots are produced at representative desktop, tablet, and mobile widths without adding brittle pixel-perfect screenshot assertions.
- [x] Visual review confirms the site feels black-and-white, minimal, technical, calm, and credible; the work remains primary and the faith signal remains restrained.
- [x] The final site contains no invented personal copy, project facts, metrics, tools, timelines, industries, contact information, or external destinations.
- [x] No out-of-scope page, service, content system, tracking, theme, animation, deployment configuration, or publishing work is introduced.
- [x] All integration defects found by the production build, acceptance suite, responsive review, accessibility review, or visual review are corrected within the approved specification.
- [x] The final production build, complete browser acceptance suite, and repository diff hygiene check pass.
