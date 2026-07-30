# Shared Homepage Redesign Decisions

**Status:** completed

These decisions affect multiple homepage chunks and are the shared baseline for dependent tickets.

## Resolved decisions

- **Professional identity:** Keep `operational problem-solver` as the durable identity. Use “I am an automation specialist.” as the supporting Hero statement. `Automation` remains a method, not the portfolio's identity.
- **Glossary update:** [`CONTEXT.md`](../../../CONTEXT.md) records the relationship between operational problem-solving, automation, automation specialist, and Stack.
- **Content authority:** Use the PRD-approved Hero supporting paragraph, faith paragraph, and Hero actions. Reuse the current Featured Work titles, descriptions, and tags from `homepage-updated.html`. The old Hero eyebrow and booking CTA remain removed by the PRD. Contact copy and deferred résumé/case-study content are not approved by this decision set.
- **Homepage navigation:** Use homepage section anchors in the persistent desktop navigation and the tablet/mobile responsive navigation panel. Show Home, Work, Stack, and Contact. Do not include Process or About in navigation; the sections remain in the homepage flow. The Services section remains removed.
- **Destinations:** Use `https://github.com/j-allekine`, `https://www.linkedin.com/in/j-allekine/`, `mailto:ajihmallekine@gmail.com`, `/work`, `/stack`, and `/contact` where applicable. Defer the résumé and individual case-study destinations and omit those actions for now.
- **Stack terminology:** `Stack` is the sole canonical label across the homepage planning language. The existing `/stack` route and `#stack` anchor remain.
- **Typography:** Retain the current typography character and Geist / Geist Mono roles defined by the PRD.
- **Mockup use:** Treat `mockup.png` as a composition reference only. The written root specification overrides it when they differ.
- **Visual approval:** J. Allekine approves the visual checkpoints. Review `320`, `768`, `1279`, `1280`, and `1440` px widths.
- **Supported width:** The minimum supported viewport width is `320px`.

## Completion

Shared homepage decisions are implemented in `homepage-updated.html`. The shared homepage decision checks and the full acceptance suite pass.
