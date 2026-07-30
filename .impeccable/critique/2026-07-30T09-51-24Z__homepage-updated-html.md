---
target: homepage Hero looks massive
total_score: 19
max_score: 24
na_heuristics: 5,7,9,10
p0_count: 0
p1_count: 2
timestamp: 2026-07-30T09-51-24Z
slug: homepage-updated-html
---
# Homepage Hero Critique

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 3 | Current page and destinations are clear. |
| 2 | Match system / real world | 3 | The in-page work CTA uses an outbound-style arrow. |
| 3 | User control and freedom | 4 | Brand, page routes, and responsive navigation exits are clear. |
| 4 | Consistency and standards | 3 | Hero scale diverges sharply between desktop and compact layouts. |
| 5 | Error prevention | n/a | No error-prone task exists in the reviewed Hero. |
| 6 | Recognition rather than recall | 4 | Identity, proposition, and actions are explicit. |
| 7 | Flexibility and efficiency | n/a | Not applicable to this portfolio Hero. |
| 8 | Aesthetic and minimalist design | 2 | Tablet and phone give portrait, name, copy, and actions near-equal prominence. |
| 9 | Error recovery | n/a | No error state exists in the reviewed Hero. |
| 10 | Help and documentation | n/a | Not applicable to this portfolio Hero. |
| **Total** |  | **19/24** | **Good foundation; responsive proportions need correction.** |

## Design Specificity Verdict

The Hero feels authored for this portfolio. Its operational-systems aesthetic, technical portrait treatment, direct positioning, and restrained faith signal are coherent. The problem is not generic design; it is responsive scale.

The deterministic scan returned three findings: `overused-font` at line 15, `codex-grid-background` at line 520, and an unrelated Stack `marquee` warning. The portrait-grid advisory is Hero-related but does not cause the excessive height. No ignore file exists.

## Overall Impression

Desktop is bold but controlled. Tablet is too tall. Phone is severely oversized: the Hero occupies nearly two viewport heights before Featured Work begins. The single biggest opportunity is to compress the compact Hero so project evidence appears much sooner.

## What's Working

- Desktop portrait and text columns balance well.
- The identity hierarchy is immediately understandable.
- The two actions remain clear and comfortably sized on phone.

## Priority Issues

### P1 — Compact Hero consumes too much of the journey

At 320px the Hero is about 1,102px tall, or 194% of the 568px viewport. At 768px it is about 1,056px, or 117% of the 900px viewport.

**Why it matters:** Hiring managers must scroll too long before seeing work evidence.

**Fix:** Reduce the phone Hero by roughly 35–40% and tablet by 25–30%. Target about 650–750px on phone and 750–850px on tablet.

**Suggested command:** `$impeccable layout`

### P1 — Portrait and name compete on phone

The phone portrait is 284×355px and the 56px name wraps to three lines. Both behave like primary cover elements.

**Why it matters:** The placeholder portrait receives as much attention as the professional proposition.

**Fix:** Reduce the phone portrait to about 220–250px wide and the name to about 40–44px, while preserving the portrait-first order.

**Suggested command:** `$impeccable adapt`

### P2 — Final padding override defeats earlier compact spacing

The late `.hero { padding-block: clamp(64px, 7vw, 100px); }` rule overrides earlier phone spacing, leaving 64px above and below at both 320px and 768px.

**Why it matters:** Compact layouts cannot achieve the intended compact rhythm.

**Fix:** Add final breakpoint-specific Hero padding after the shared rule and tighten the 30px row gap.

**Suggested command:** `$impeccable layout`

### P2 — In-page CTA uses the wrong directional cue

“View selected work” uses `↗` even though it scrolls to `#work`.

**Why it matters:** The icon suggests leaving the page.

**Fix:** Restore the approved downward cue.

**Suggested command:** `$impeccable clarify`

### P3 — Desktop can be modestly tighter

The Hero occupies 71–75% of a 900px viewport at 1280–1440px.

**Why it matters:** It is not broken, but a 10–15% reduction would bring more Featured Work into the first screen.

**Fix:** Reduce desktop vertical padding while preserving the current two-column composition and type hierarchy.

**Suggested command:** `$impeccable polish`

## Persona Red Flags

- **Jordan, first-time visitor:** Understands the role, but may conclude the portfolio is primarily biographical because evidence arrives late.
- **Casey, distracted phone visitor:** Must scroll almost two screens before seeing work; the portrait, name, copy, and actions compete for limited attention.
- **Riley, deliberate evaluator:** Will notice the incorrect CTA arrow and the mismatch between the documented compact Hero target and the rendered result.

## Minor Observations

- Featured Work is visible in the initial desktop viewport but absent on tablet and phone.
- The portrait grid warning is stylistic, not the source of the height problem.
- The Stack marquee detector warning is outside this Hero review.

## Questions to Consider

- Should mobile prioritize the professional proposition over the temporary portrait placeholder?
- Is the goal to show the start of Featured Work in the first phone viewport, or simply reach it within one viewport of scrolling?
- Should desktop remain dramatic while only tablet and phone are compressed?
