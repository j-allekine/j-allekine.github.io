# Portfolio Homepage Redesign — Design Direction

**Project:** J. Allekine Portfolio  
**Page:** Homepage only  
**Purpose of this document:** Visual and interaction design direction only  
**Primary audience:** Hiring managers  
**Secondary audience:** Potential clients  

This document defines the approved homepage direction. It is intentionally **not** an implementation plan, engineering ticket, test checklist, or coding specification.

---

# 1. Design objective

Evolve the current homepage into a stronger personal portfolio that presents J. Allekine as an **automation specialist who understands operational problems and builds practical systems around them**.

The homepage should communicate this sequence:

```text
Who I am
↓
What I have built
↓
What I use
↓
How I work
↓
What I value
↓
How to reach me
```

The redesign should feel:

- dark
- minimal
- technical
- editorial
- calm
- deliberate
- evidence-first
- professional
- personal without becoming biography-heavy
- suitable for hiring managers first, while still useful to potential clients

The homepage should no longer feel primarily like a freelancer services landing page.

---

# 2. References

## 2.1 Primary baseline — current homepage

**File:** `homepage-updated.html`

This is the current design baseline and should remain visibly recognizable in the redesign.

Reference it for:

- current dark monochrome identity
- typography character
- Geist / Geist Mono style
- hero portrait/image placeholder concept
- hero copy tone
- button styling
- project card content hierarchy
- compact project tags
- Stack marquee
- How I Work interaction
- restrained borders and surfaces
- faith content
- `Colossians 3:23`

The redesign is an evolution of this homepage, not a replacement with an unrelated visual system.

---

## 2.2 Previous redesign handoff

**File:** `j-allekine-homepage-figma-handoff-2026-07-28(1).md`

Use it for the broader redesign context:

- hiring-manager-first hierarchy
- sidebar shell concept
- stronger Featured Work emphasis
- removal of the homepage Services section
- restrained faith signal
- narrower editorial content behavior
- wider Featured Work breakout

Where this document conflicts with the handoff, **this document is the newer approved direction**.

---

## 2.3 Bryl Lim website

**Website:** `https://bryllim.com/`

Use as a reference for:

- fixed left desktop sidebar
- quiet navigation
- editorial page structure
- narrow content measure
- whitespace
- simple project presentation
- restrained information density
- minimal use of decorative UI

Do not clone:

- Bryl branding
- exact copy
- exact project card styling
- decorative motifs that do not belong to this portfolio
- personal identity elements unique to Bryl

---

## 2.4 Bryl Minimal Design

**Repository:** `https://github.com/bryllim/bryl-minimal-design`

Use as a design-language reference for:

- monochrome palette
- typography hierarchy
- small mono metadata
- hairline borders
- restrained cards
- sidebar proportions
- spacing rhythm
- subtle motion
- dark-mode discipline

Particularly relevant ideas:

- sidebar around `14rem / 224px`
- narrow reading measure
- minimal accent use
- typography doing most of the visual hierarchy
- thin dividers instead of heavy containers
- modest animation
- generous whitespace

---

## 2.5 ChatGPT layout behavior

Use the current ChatGPT desktop interface only as a **content-width behavior reference**.

Borrow:

- narrow centered reading column
- comfortable text measure
- strong focus on one main content stream
- generous space around content

Do not borrow:

- ChatGPT branding
- chat bubbles
- prompt composer
- icons
- conversation UI
- product-specific controls

The goal is the **reading width and calmness**, not a ChatGPT clone.

---

## 2.6 Approved mockup direction

The latest mockup created during this design discussion is a **composition reference**, not a source of literal content.

Approved aspects from the mockup:

- desktop fixed sidebar
- narrow main editorial column
- wider Featured Work section
- desktop hero with copy left and portrait/image right
- portrait/image first on tablet and mobile
- three project cards visible on sufficiently wide desktop
- peeking project deck on narrower viewports
- project cards with a large logo/image area
- socials placed at the bottom of the desktop sidebar
- verse below the social links
- overall dark, editorial, restrained composition

### Do not copy from the mockup

The mockup included some exploratory elements that are **not approved**:

- `+` expandable/collapsible homepage sections
- accordion behavior
- sections hidden by default
- fake/generated company logos
- generated portrait imagery
- invented project copy
- invented project outcomes or metrics
- duplicated social links at the bottom of the mobile homepage

The homepage must remain fully scrollable from Hero through Contact on every viewport.

---


## 2.7 Reference precedence

The references have different jobs and should not be treated as interchangeable.

- `homepage-updated.html` remains the primary visual reference for existing components that are explicitly retained, especially **Stack** and **How I Work**.
- the approved mockup controls **overall composition and responsive arrangement only**
- `bryl-minimal-design` controls the intended **visual restraint, typography, spacing, borders, card tone, sidebar language, and motion character**
- the attached Featured Work card references inform the **peeking-deck composition**
- this specification overrides any older handoff or exploratory mockup where they conflict

Do not redesign retained components merely because the generated mockup rendered them differently.

---

# 3. Overall page structure

The homepage order is:

```text
Hero
Featured Work
Stack
How I Work
About
Contact
Footer
```

Desktop adds a persistent left sidebar around this main content.

The dedicated **Services** section from `homepage-updated.html` is removed from the homepage.

Capabilities should instead be communicated through:

- hero copy
- Featured Work
- project tags
- Stack
- case studies

---

# 4. Desktop sidebar

Use a fixed left sidebar inspired by Bryl Lim.

## Width

Target:

```text
224px
```

Acceptable visual range:

```text
224–240px
```

The sidebar should feel like structural navigation, not a profile card.

---

## Sidebar content

```text
J. ALLEKINE

Home
Work
Stack
Contact


[flexible empty space]


GitHub
LinkedIn
Email

Colossians 3:23
```

### Top area

Contains:

- `J. ALLEKINE`
- primary homepage navigation

### Bottom area

Pinned visually toward the bottom:

- GitHub
- LinkedIn
- Email
- `Colossians 3:23`

The verse reference sits **below** the social links.

Do not include the verse text in the sidebar. Use only:

```text
Colossians 3:23
```

---

## Sidebar visual treatment

- near-black or slightly raised dark surface
- subtle right-side hairline divider
- compact mono navigation
- active link may use stronger text, a small indicator, or restrained inversion
- inactive links stay muted
- no large icons required
- no profile card
- no large portrait in the sidebar
- no service promotion
- no repeated CTA block

The bottom social/verse area should be quieter than the navigation.

---

# 5. Responsive navigation

Use `1280px` as the major shell breakpoint.

## `≥ 1280px`

Use:

- fixed left sidebar
- desktop two-column Hero
- three Featured Work cards side by side

## `< 1280px`

Replace the fixed sidebar with:

- compact sticky top bar
- `J. ALLEKINE`
- menu control
- off-canvas or full-height drawer

At this breakpoint the Hero also switches to portrait-first composition and Featured Work switches to the peeking deck.

The drawer should contain the same information hierarchy as the desktop sidebar:

```text
Home
Work
Stack
Contact

GitHub
LinkedIn
Email

Colossians 3:23
```

Social links should **not** also be repeated at the bottom of the mobile homepage.

---

# 6. Width system

Do not use one width for every section.

The redesign uses three visual width categories.

---

## 6.1 Reading width

Target:

```text
~768px
```

Use for normal editorial sections:

- Stack
- How I Work
- About
- Contact

This is the primary ChatGPT-like reading measure.

These sections should feel narrow, centered, and easy to scan.

---

## 6.2 Hero width

Target:

```text
~960px
```

The Hero needs a wider shell than the normal reading column because desktop contains both:

- a readable text column
- a portrait/image column

Suggested visual balance:

```text
Text:      ~580–620px
Gap:       ~40–56px
Portrait:  ~280–320px
```

The text should still behave like a narrow reading column even though the overall Hero shell is wider.

The wider Hero shell exists only to make the two-column composition breathe.

---

## 6.3 Featured Work width

Target:

```text
~1024px
```

Featured Work is the widest homepage section.

This is intentional.

It allows three project cards to sit side by side on sufficiently wide screens without shrinking them into narrow tiles.

Suggested geometry:

```text
Card width: ~320px+
Gap:        ~16–20px
```

---

# 7. Hero — desktop

The Hero should preserve the current two-column idea from `homepage-updated.html`.

## Composition

```text
[ text content ]     [ portrait / image ]
```

Text on the left.

Portrait/image on the right.

The portrait/image is part of the approved design and must remain.

---

## Hero name

Use:

```text
JIHM ALLEKINE
ALMEDILLA
```

The name is the main visual anchor.

Do not show the old eyebrow:

```text
Systems & Automation Developer
```

There is no occupational label above the name.

---

## Professional statement

Directly below the name:

```text
I am an automation specialist.
```

This is the concise statement of what Jihm is.

It should be visually stronger than the supporting paragraphs but clearly secondary to the name.

---

## Supporting paragraph

Use the substance and tone already present in `homepage-updated.html`.

Approved copy:

```text
I build spreadsheet systems, workflow automations, data tools, and practical software that turn manual processes into clearer, more reliable operations. I enjoy mapping workflows, understanding the details, and building useful tools that people can rely on.
```

This paragraph explains what "automation specialist" means in practice.

---

## Faith paragraph

Keep:

```text
My Christian faith shapes how I approach my work. I see building as an act of stewardship: serving people well, pursuing excellence, and creating work that honors God.
```

The faith paragraph should:

- remain clearly readable
- sit beneath the professional paragraph
- use slightly lower emphasis
- feel intentional, not hidden
- not compete with the professional positioning

---

## Hero actions

Primary:

```text
View selected work ↗
```

Secondary:

```text
Contact me ↗
```

Remove the freelancer-first emphasis from:

```text
Book a 30-minute call
```

Do not repeat social icons inside the desktop Hero because they are already persistent in the sidebar.

---

# 8. Hero portrait/image

The current portrait/image placeholder concept from `homepage-updated.html` should remain.

The approved mockup accidentally omitted it in one iteration; that omission is **not** part of the design direction.

## Desktop

- portrait/image sits to the right of the Hero text
- vertical portrait proportion
- dark framed treatment
- restrained border
- subtle depth
- no excessive glow
- no elaborate decorative framing

## Image state

Until a final real portrait is provided, use the existing intentional placeholder concept.

The placeholder should look deliberately designed rather than like a broken image slot.

---

# 9. Hero — tablet and mobile

Tablet and mobile change the Hero order.

## Approved order

```text
[ portrait / image ]

JIHM ALLEKINE
ALMEDILLA

I am an automation specialist.

Supporting paragraph

Faith paragraph

View selected work
Contact me
```

The image comes **first**.

This applies to both tablet and mobile.

The image should be visually important without consuming an unreasonable portion of the first screen.

The name begins immediately after the image.

Do not insert an occupational eyebrow between the image and name.

The same professional/supporting/faith hierarchy from desktop remains.

---

# 10. Featured Work heading

Retain the existing homepage convention of:

```text
small uppercase eyebrow / category label
larger section title
```

The exact Featured Work wording is a content decision and is intentionally **not prescribed by this design spec**.

A `View all work →` action may sit opposite the heading when appropriate and when the destination is real.

Do not add section numbers such as:

```text
01 —
02 —
03 —
```

The homepage should have no visible section numbering system.

---

# 11. Featured Work purpose

Featured Work is the homepage's primary proof section.

Show three featured projects.

The homepage card should make the visitor understand:

- what the project is
- what kind of system it represents
- why it is relevant
- that a deeper case study exists

Do not force the full:

```text
Problem → System → Result
```

onto the homepage card.

That belongs in the case study.

---

# 12. Featured Work card hierarchy

Each project card contains:

```text
Project visual / company logo
Project title
Short description
Compact tags
View case study ↗
```

The case-study action should remain explicit.

Even if the card itself is interactive, the visitor should still see a clear:

```text
View case study ↗
```

---

# 13. Featured Work visual priority

Use this visual priority:

### 1. Real company/project logo

Preferred.

The logo may sit centered inside a generous image field.

### 2. Real project image

Use when no meaningful logo exists or when the project image communicates identity better.

### 3. Intentional neutral placeholder

Use when neither approved logo nor project image exists.

Never fabricate client/company branding.

---

# 14. Featured Work card visual style

The approved direction may use a light card/image surface against the dark page.

Reference feel:

- off-white or subtle neutral surface
- very gentle tint/gradient
- large clear logo/image area
- restrained borders
- soft shadow
- compact text area
- small project tags
- strong contrast against the dark page

Example structure:

```text
┌──────────────────────────┐
│                          │
│       COMPANY LOGO       │
│                          │
├──────────────────────────┤
│ Project Title            │
│ Short description        │
│                          │
│ TAG   TAG   TAG          │
│                          │
│ View case study ↗        │
└──────────────────────────┘
```

Avoid generic schematic dashboards when real project identity can be shown.

Detailed system screenshots, workflow diagrams, and evidence belong primarily in case studies.

---

# 15. Featured Work — wide desktop

At sufficiently wide desktop sizes, show all three project cards simultaneously.

## Layout

```text
FEATURED PROJECTS                       View all work →
Selected Work.

[CARD]   [CARD]   [CARD]
```

All three projects are:

- visible at once
- readable without interaction
- equally discoverable

No spotlight carousel on wide desktop.

No project should be hidden behind another.

Cards should remain mostly upright.

Subtle hover movement is acceptable, but the desktop should prioritize scanability.

---

# 16. Featured Work breakpoints

The desired presentation follows the same major shell breakpoint as the rest of the homepage.

## `≥ 1280px`

Use:

```text
3 visible project cards
```

Target Work width:

```text
~1024px
```

Suggested card width:

```text
~320px+
```

Suggested gap:

```text
~16–20px
```

The fixed desktop sidebar is active and the Hero uses its two-column layout.

---

## `< 1280px`

Use the **peeking deck**.

At the same breakpoint:

- the fixed sidebar becomes the sticky top bar + drawer
- the Hero becomes portrait-first
- Featured Work becomes the peeking deck

The design intent is therefore:

```text
≥ 1280px → fixed sidebar + desktop Hero + 3 visible project cards
< 1280px → top bar/drawer + portrait-first Hero + peeking deck
```

Do not squeeze three cards into a narrow content area.

---

# 17. Featured Work — peeking deck

Below `1280px`, Featured Work uses a three-card peeking deck inspired by the attached card references, but visually restrained using Bryl Minimal principles.

The active card is centered.

Adjacent cards remain partially visible from the **left and right** so the visitor immediately understands that other projects can be selected.

## Visual behavior

Active card:

- centered
- dominant
- straight
- full contrast
- readable
- case-study action available

Adjacent cards:

- partially visible from the horizontal edges
- lower emphasis
- slightly reduced scale or opacity if useful
- may use only a very subtle rotation
- should clearly look selectable

The visual treatment should stay quiet and editorial rather than exaggerated or playful.

A restrained target is roughly:

- `10–15%` of each adjacent card visible
- active card perfectly straight
- adjacent-card rotation, if used, around `1–2°`
- hairline borders
- soft, low-contrast depth

## Interaction

Navigation is intentionally simple.

- tap/click a visible adjacent card to make it active
- the active card retains its normal `View case study ↗` action
- no swipe navigation
- no arrow controls
- no autoplay
- dots are **visual position indicators only**
- dots are not buttons and should not be presented as interactive controls

Visual concept:

```text
   [previous peek]   [ ACTIVE PROJECT ]   [next peek]

                         ● ○ ○
```

The side-card previews are the primary navigation affordance.

The deck behavior comes from the approved card-reference direction; its visual language should remain consistent with Bryl Minimal rather than copying a nonexistent Bryl carousel component.

---

# 18. Stack

The current Stack component from `homepage-updated.html` is already approved.

Keep its concept.

Do not replace it with a different showcase.

## Preserve

- horizontal marquee
- technology icons/logos
- pill-like items
- current dark visual treatment
- understated motion
- existing tool-list personality

## Refine

Make it more compact:

- reduce vertical section padding
- reduce heading-to-marquee spacing
- slightly reduce pill dimensions if necessary
- preserve one-row flow
- preserve readability

It should feel like a concise technical strip between larger narrative sections.

---

# 19. Stack heading

Keep the existing heading style.

Example:

```text
STACK
```

A secondary `View all →` action may remain if the real destination exists.

Do not add section numbering.

---

# 20. How I Work

The current interactive How I Work component from `homepage-updated.html` is approved.

Keep the same core concept:

```text
Discovery
Plan
Build
Launch
```

Preserve:

- four-step progression
- step icons
- connecting line/progression
- selected state
- descriptive panel
- technical but approachable tone

Do not redesign it into a card grid or unrelated workflow visual.

---

## How I Work refinement

Only refine:

- spacing
- width
- vertical rhythm
- compactness
- integration with the new sidebar/main shell

The section should remain visually recognizable from the current homepage.

Use the current heading pattern:

```text
HOW I WORK
My process.
```

---

# 21. About

Add a new About section after How I Work.

The About section should not repeat the Hero.

Its role is to communicate:

- how Jihm thinks
- what he values
- how he approaches operational problems
- his interest in understanding real workflows
- his growth across automation, data, and software

The section should feel more personal than Featured Work while remaining concise.

---

# 22. About composition

Desktop may use a compact editorial composition such as:

```text
ABOUT
[short title if needed]

[paragraph]                  [paragraph]

VALUES
[value] [value] [value] [value]

View résumé ↗
```

A two-column text treatment is acceptable on desktop if it improves rhythm.

Do not create a large biography block.

Do not recreate a full About page inside the homepage.

---

## About values

Values are part of the approved design structure, but the exact final list is still content-level TBD.

Illustrative examples:

- Curiosity
- Stewardship
- Reliability
- Excellence

These examples should not be treated as final copy unless separately approved.

---

## Resume action

Include:

```text
View résumé ↗
```

This is the key action in About.

Do not repeat:

- GitHub
- LinkedIn
- Email

inside About.

Those already belong to the site navigation/sidebar.

---

# 23. Contact

Keep Contact compact and direct.

It should work for:

- hiring managers
- collaborators
- potential clients

Avoid turning it into a large sales banner.

Desired tone:

- open
- professional
- neutral
- easy to act on

Potential structure:

```text
CONTACT
[short heading]

Short invitation / availability statement.

Contact action ↗
```

Exact final Contact copy remains TBD.

---

# 24. No accordion / no collapsed homepage sections

This is a hard design rule.

The homepage must remain fully scrollable from top to bottom on:

- desktop
- tablet
- mobile

Do not use the `+` section controls shown in one exploratory mockup.

Do not collapse:

- Stack
- How I Work
- About
- Contact

All sections remain visible in normal document flow.

The `+` pattern was only an artifact of the mockup exploration and is explicitly rejected.

---

# 25. Mobile page flow

Mobile should read naturally from top to bottom:

```text
Sticky top bar

Portrait / image

JIHM ALLEKINE
ALMEDILLA

I am an automation specialist.

Supporting paragraph

Faith paragraph

View selected work
Contact me

FEATURED PROJECTS
Selected Work.

Peeking project deck

STACK
Marquee

HOW I WORK
Interactive process

ABOUT
About copy
Values
Résumé

CONTACT
Contact copy/action

Footer
```

No section is hidden behind an expand control.

---

# 26. Social links by viewport

## Desktop

Socials live at the bottom of the fixed sidebar.

```text
GitHub
LinkedIn
Email

Colossians 3:23
```

## Tablet/mobile

Socials live inside the navigation drawer.

Do not repeat them:

- in Hero
- in About
- at the bottom of the mobile homepage

The goal is persistent access without redundant social-link clusters.

---

# 27. Faith treatment

Faith appears in two restrained but intentional ways.

## Hero

Full faith paragraph:

```text
My Christian faith shapes how I approach my work. I see building as an act of stewardship: serving people well, pursuing excellence, and creating work that honors God.
```

## Navigation/sidebar

Only:

```text
Colossians 3:23
```

Do not place the full verse excerpt in the sidebar or mobile drawer.

Do not create a dedicated faith section.

---

# 28. Footer

Keep the footer minimal.

Approved structure:

```text
© 2026 J. Allekine                         Back to top ↑
```

Do not repeat:

- social links
- `Colossians 3:23`
- Contact CTA
- résumé link

The sidebar or responsive navigation drawer already owns the persistent social and scripture-reference content.

---

# 29. Typography


Keep the current typography character from `homepage-updated.html`.

## Primary roles

Sans-serif:

- hero name
- section titles
- body copy
- project titles
- buttons

Mono:

- nav
- tags
- small labels
- metadata
- social links
- scripture reference
- section eyebrows

The design should derive hierarchy primarily from:

- type role
- weight
- spacing
- contrast

rather than extreme font sizes.

---

## Hero typography hierarchy

```text
JIHM ALLEKINE
ALMEDILLA

I am an automation specialist.

Supporting paragraph

Faith paragraph
```

The name is largest.

Professional statement is second.

Supporting copy is normal body emphasis.

Faith paragraph is slightly quieter.

---

# 31. Section heading language

Do not introduce section numbering.

Retain the current homepage convention:

```text
SMALL UPPERCASE EYEBROW
Larger section title.
```

Featured Work is specifically:

```text
FEATURED PROJECTS
Selected Work.
```

How I Work remains:

```text
HOW I WORK
My process.
```

Other section eyebrow/title copy may be refined later, but should follow the same visual structure.

---

# 32. Color

Keep the existing near-black site identity.

Primary page:

- near-black background
- off-white foreground
- muted gray secondary text
- subtle dark surfaces
- gray hairline borders

No global bright accent color is necessary.

Real project logos may retain their authentic brand colors.

Featured project cards may use light/off-white visual surfaces to create contrast against the dark site.

---

# 33. Project card contrast

The approved card direction can intentionally create:

```text
dark page
↓
light project artifact
↓
dark page
```

This helps Featured Work feel tangible and distinct.

Keep the light surfaces restrained:

- warm/off-white
- very light neutral
- subtle project-specific tint if justified
- soft gradient if needed

Avoid loud saturated backgrounds unless they come directly from real project branding.

---

# 34. Borders, radius, and depth

Retain the understated treatment from the current homepage and Bryl references.

Use:

- thin borders
- moderate radius
- subtle surface separation
- soft shadows on light project cards
- minimal shadow on dark sections/sidebar

Avoid:

- heavy glassmorphism
- thick outlines
- dramatic elevation
- excessive nested cards

---

# 35. Motion

Motion should remain restrained and functional.

Appropriate:

- small hover lift
- arrow nudge
- subtle border transition
- mobile/tablet deck transition
- slight inactive-card rotation in the peeking deck
- technology marquee

Avoid:

- bouncing
- dramatic zoom
- autoplay Featured Work rotation
- parallax
- constant decorative movement

The page should still feel complete when perfectly still.

---

# 36. Desktop composition reference

```text
┌──────────── SIDEBAR ────────────┐   ┌────────────── MAIN ──────────────┐
│ J. ALLEKINE                     │   │                                  │
│                                 │   │ JIHM ALLEKINE      [ PORTRAIT ] │
│ Home                            │   │ ALMEDILLA                        │
│ Work                            │   │                                  │
│ Stack                           │   │ I am an automation specialist.   │
│                                 │   │ Supporting paragraph...          │
│ Contact                         │   │ Faith paragraph...               │
│                                 │   │                                  │
│                                 │   │ [View selected work] [Contact]   │
│                                 │   │                                  │
│                                 │   ├──────────────────────────────────┤
│                                 │   │ FEATURED PROJECTS                │
│                                 │   │ Selected Work.                   │
│                                 │   │                                  │
│                                 │   │ [CARD]   [CARD]   [CARD]         │
│                                 │   │                                  │
│                                 │   ├──────────────────────────────────┤
│                                 │   │ STACK                            │
│                                 │   │ [compact marquee]                │
│                                 │   ├──────────────────────────────────┤
│ GitHub                          │   │ HOW I WORK                       │
│ LinkedIn                        │   │ My process.                      │
│ Email                           │   │                                  │
│                                 │   │ Discovery → Plan → Build → ...  │
│ Colossians 3:23                 │   ├──────────────────────────────────┤
│                                 │   │ ABOUT                            │
│                                 │   │ copy / values / résumé          │
│                                 │   ├──────────────────────────────────┤
│                                 │   │ CONTACT                          │
└─────────────────────────────────┘   └──────────────────────────────────┘
```

---

# 37. Tablet / intermediate composition reference

```text
┌──────────────────────────────────┐
│ J. ALLEKINE                   ☰  │
├──────────────────────────────────┤
│                                  │
│          PORTRAIT / IMAGE        │
│                                  │
├──────────────────────────────────┤
│ JIHM ALLEKINE                    │
│ ALMEDILLA                        │
│                                  │
│ I am an automation specialist.   │
│                                  │
│ Supporting paragraph             │
│ Faith paragraph                  │
│                                  │
│ [View selected work] [Contact]   │
├──────────────────────────────────┤
│ FEATURED PROJECTS                │
│ Selected Work.                   │
│                                  │
│     peeking project deck         │
│                                  │
├──────────────────────────────────┤
│ STACK                            │
│ compact marquee                  │
├──────────────────────────────────┤
│ HOW I WORK                       │
│ My process.                      │
│ process component                │
├──────────────────────────────────┤
│ ABOUT                            │
│ copy / values / résumé           │
├──────────────────────────────────┤
│ CONTACT                          │
└──────────────────────────────────┘
```

The page remains fully scrollable.

---

# 38. Mobile composition reference

```text
┌──────────────────────────────┐
│ J. ALLEKINE               ☰ │
├──────────────────────────────┤
│                              │
│       PORTRAIT / IMAGE       │
│                              │
├──────────────────────────────┤
│ JIHM ALLEKINE                │
│ ALMEDILLA                    │
│                              │
│ I am an automation specialist. │
│                              │
│ Supporting paragraph         │
│                              │
│ Faith paragraph              │
│                              │
│ [ View selected work ]       │
│ [ Contact me ]               │
├──────────────────────────────┤
│ FEATURED PROJECTS            │
│ Selected Work.               │
│                              │
│ previous    next             │
│   peek   [ACTIVE]   peek     │
│                              │
│          ● ○ ○               │
├──────────────────────────────┤
│ STACK                         │
│ [marquee]                    │
├──────────────────────────────┤
│ HOW I WORK                   │
│ My process.                  │
│ [interactive process]        │
├──────────────────────────────┤
│ ABOUT                        │
│ [copy]                       │
│ [values]                     │
│ View résumé ↗                │
├──────────────────────────────┤
│ CONTACT                      │
│ [copy + action]              │
├──────────────────────────────┤
│ minimal footer               │
└──────────────────────────────┘
```

No `+` controls.

No collapsed sections.

No social links repeated at the bottom.

---

# 39. Approved design decisions summary

## Shell

- fixed Bryl-inspired sidebar at `≥ 1280px`
- approximately 224px sidebar
- ChatGPT-like narrow editorial reading width
- top navigation/drawer at `< 1280px`
- socials at the bottom of desktop sidebar
- socials inside mobile/tablet navigation drawer
- `Colossians 3:23` below socials

## Hero

- preserve portrait/image
- desktop: text left, portrait right
- tablet/mobile: portrait first
- no occupational eyebrow
- name: `JIHM ALLEKINE / ALMEDILLA`
- statement: `I am an automation specialist.`
- retain approved supporting paragraph
- retain faith paragraph
- `View selected work` becomes primary CTA
- Contact remains secondary

## Featured Work

- preserve the current eyebrow + larger-title heading pattern; exact wording remains a content decision
- three approved projects
- concise homepage cards
- explicit `View case study ↗`
- preferred visual: real company/project logo
- fallback: real project image
- final fallback: intentional neutral placeholder
- no fabricated branding
- `≥ 1280px`: all three visible side by side
- `< 1280px`: peeking deck
- navigate the deck by tapping/clicking adjacent cards
- no swipe navigation
- no arrow controls
- dots are visual indicators only
- no autoplay

## Stack

- preserve current marquee concept
- make more compact
- no major visual redesign

## How I Work

- preserve current four-step interaction
- refine spacing only

## About

- add homepage About
- concise personal/professional context
- values included
- exact value copy TBD
- résumé action included
- no repeated social links

## Contact

- compact
- works for hiring and client contexts
- no oversized freelancer CTA
- final copy TBD

## Mobile

- fully scrollable page
- no accordions
- no `+` section controls
- all homepage sections visible in document flow
- portrait first
- Featured Work uses peeking deck

## Removed

- homepage Services section
- desktop top navigation
- hero `Systems & Automation Developer` eyebrow
- `Book a 30-minute call` as primary hero CTA
- visible section numbering
- duplicated social sections
- mockup accordion behavior

---

# 40. Final design principle

The homepage should feel like a **focused professional portfolio built around evidence of solving real operational problems**.

The visual system should support the work rather than compete with it.

Use:

- narrow reading width for clarity
- wider Featured Work for evidence
- sidebar for persistent navigation and identity
- real project identity wherever possible
- restrained typography and motion
- deliberate whitespace

Preserve the strongest parts of `homepage-updated.html`, use `bryl-minimal-design` for visual discipline, borrow reading-width behavior from ChatGPT, and use the approved mockup/card references only for the specific composition decisions defined above.

The result should feel like one coherent portfolio, not a collage of references or a generic freelancer landing page.
