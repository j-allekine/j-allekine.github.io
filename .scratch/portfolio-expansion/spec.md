# Portfolio expansion

Status: ready-for-agent

## Scope

This follow-up feature adds one About page to Portfolio v1.

The About page explains how J. Allekine thinks and works. Professional history supports that purpose rather than becoming the page's main subject.

Its central argument is that J. Allekine understands the workflow before choosing a tool, then builds the simplest reliable system that improves it.

This feature includes:

- A new `/about/` route
- An introduction with a portrait
- A five-stage How I Work section
- A Selected Journey timeline
- A permanent About link in the shared header
- Use of the existing shared contact call to action and footer
- About-page metadata and browser-level acceptance coverage

This feature does not include:

- Changes to the Portfolio v1 homepage or case-study content
- Other follow-up pages or sections
- A separate personal-note section
- A complete resume or employment-history section
- New contact, footer, or navigation systems
- Final personal copy, history, dates, portrait, metrics, links, or other unapproved details

Do not revise `.scratch/portfolio-v1/spec.md` as part of this feature.

## Content Status

J. Allekine will supply final content and an approved portrait.

Until then:

- Use clearly marked guiding content that demonstrates hierarchy and approximate content shape.
- Do not invent personal claims, history, dates, locations, faith statements, employers, metrics, links, or project details.
- Keep unapproved copy centralized and easy to replace.
- Use a clearly marked portrait placeholder rather than treating the supplied design portrait as approved content.

## Approved Design Direction

The supplied About-page composition is the visual direction for section order, hierarchy, light-and-dark rhythm, and responsive intent.

Primary visual reference: `.scratch/portfolio-expansion/screenshots/about-page-reference.png`

Refine it through the decisions in this specification:

- Keep the introduction, process, journey, contact, and footer sequence.
- Use the existing portfolio typography, grid, spacing, rules, colors, focus states, and motion limits.
- Reuse the shared header, contact call to action, and footer instead of recreating their appearance from the reference.
- Correct the portrait to a consistent 4:5 treatment.
- Keep the selected five-stage process rail and expose each working principle.
- Use the selected vertical timeline with three or four milestones rather than the horizontal five-point journey shown in the reference.
- Do not copy unapproved personal statements from the reference into production content.

## Page Structure

The page order is:

1. Shared header
2. Introduction with portrait
3. How I Work
4. Selected Journey
5. Shared contact call to action
6. Shared footer

The introduction, How I Work, and Selected Journey sections are the About page's only page-specific sections.

The three page-specific sections must expose these visible labels:

- `01 Introduction`
- `02 How I Work`
- `03 Selected Journey`

The labels must:

- Be visible text
- Use the existing restrained metadata typography
- Follow the established section hierarchy
- Not replace semantic headings
- Remain readable on desktop and mobile

Use a restrained alternating rhythm:

- Introduction on the portfolio's light canvas
- How I Work as a near-black band with accessible light text
- Selected Journey on the light canvas
- Existing shared contact call to action and footer using their system styles

How I Work uses the portfolio's secondary dark or charcoal surface. The shared contact call to action retains the deepest black surface, stronger vertical spacing, and primary action hierarchy. The contact call to action must remain visually more prominent than How I Work.

## Shared System

Render the About page through the existing shared page layout.

Reuse without page-specific copies:

- Skip link
- Static site header
- Mobile navigation behavior
- Contact call to action
- Site footer
- Wide container and responsive gutters
- Typography and color tokens
- Focus and reduced-motion behavior

The About page may supply its own document metadata and main content only.

Do not add About-specific variants of the contact call to action or footer. Do not duplicate shared component styles inside the About page.

## Navigation

Add About as a permanent top-level link in the shared header on every page.

Use this navigation order on desktop and mobile:

1. Work
2. About
3. Resume
4. Contact

Place About directly after Work. Mark it as the current page on `/about/` through visible styling and `aria-current="page"`.

The Work link continues to target featured work. Resume and Contact retain their existing configured-or-unavailable behavior.

This header sequence replaces Capabilities and GitHub in the primary navigation. It does not change:

- Capabilities content on the homepage
- GitHub's role as a secondary action in the shared contact call to action
- Resume's role in the header and shared contact call to action

Do not repeat the full navigation in the footer.

## Introduction

The introduction contains:

- A small section label
- The page's only `h1`
- Two or three short supporting paragraphs
- One portrait or clearly marked portrait placeholder

The copy should establish the central argument, not provide a full biography. It may communicate professional focus, working perspective, and a small amount of approved personal context.

The portrait belongs inside this responsive introduction. It does not form a separate hero or section.

### Desktop Layout

- Place text on the left and portrait on the right.
- Use a 7/5 column ratio within the shared twelve-column grid.
- Align both columns to the top.
- Keep the portrait visually subordinate to the introduction and within the approved 280px–360px desktop width range.
- Do not stretch the introduction or add filler content solely to match the portrait height.
- Keep paragraph measure within the shared reading-width limit.

### Mobile Layout

- Place text first and portrait second.
- Let the portrait use the available width up to a sensible maximum.
- Keep the portrait left-aligned rather than centering it like a profile avatar.
- Preserve clear space between the copy and portrait.

### Portrait Treatment

The portrait is an intentional, functional exception to the portfolio's general avoidance of decorative personal photography.

- Use a rectangular 4:5 crop at every viewport.
- Preserve the subject's focal point when the image resizes.
- Use a neutral or black-and-white treatment.
- Place it within a thin structural border.
- Reserve its dimensions to prevent layout shift.
- Provide useful alternative text once an approved portrait is supplied.
- Do not add shadows, overlays, decorative frames, hover effects, or animation.

## How I Work

Use a five-stage process rail:

1. Understand
2. Design
3. Build
4. Validate
5. Improve

Option A was selected from a disposable comparison against a vertical numbered editorial list and a two-column structured ledger. The process rail communicates the ordered working method most immediately and preserves that relationship on mobile.

Each stage contains:

- Two-digit number
- Short title
- Concise description
- Distinct working principle

The description explains what happens during the stage. The working principle explains the judgment guiding it. Do not merge them into one undifferentiated paragraph.

### Desktop Layout

- Present five equal stages in one horizontal row.
- Use thin structural rules to connect and separate stages.
- Keep the number, title, description, and principle aligned consistently across all stages.
- Allow the content to determine a readable section height; do not force text to clip or overflow.

### Mobile Layout

- Convert the rail into one vertical ordered sequence.
- Keep the number in a narrow left column and stage content in the right column.
- Preserve the same number, title, description, and principle hierarchy.
- Use thin horizontal rules between stages.

Do not use icons, shadows, gradients, cards, dots, decorative arrows, or animation.

Any comparison screenshots stored under `.scratch/portfolio-expansion/screenshots/` are decision evidence, not production assets. The disposable design-lab route and variant switcher are not part of the production site.

## Selected Journey

Use an anchored vertical timeline containing three or four concise milestones.

Option B was selected from a disposable comparison against chronological editorial rows and a compact milestone ledger. The vertical timeline communicates progression clearly without making the section resemble a complete resume.

Each milestone contains:

- Two-digit number
- Approved date or period
- Short title
- Concise context
- Significance to the present working approach

Milestones should explain meaningful progression toward the current operational problem-solver identity. They must not become an exhaustive employment or education history.

### Desktop Layout

- Place the milestone number and date or period to the left of one continuous vertical rule.
- Place the milestone title, context, and significance to the right.
- Use thin horizontal rules to separate milestone content.
- Keep the timeline narrower than the full page container.

### Mobile Layout

- Move the vertical rule to the left edge of the timeline.
- Place the number and period together above the milestone content.
- Stack title, context, and significance in one readable column.

Do not add dots, icons, cards, shadows, gradients, decorative graphics, or animation.

Dates and personal history remain guiding content until approved details are supplied. Any comparison screenshots stored under `.scratch/portfolio-expansion/screenshots/` are decision evidence, not production assets. The disposable design-lab route and variant switcher are not part of the production site.

## Responsive and Interaction Behavior

- Follow the shared layout's established viewport thresholds unless browser validation shows the approved content no longer remains readable.
- Keep the shared header in normal document flow.
- Preserve the existing mobile menu behavior and keyboard support.
- Add no About-page client-side JavaScript.
- Do not add scroll reveals, portrait effects, timeline animation, parallax, or new hover movement.
- Maintain the shared reduced-motion behavior.

## Accessibility and Metadata

- Use semantic page sections with ordered heading levels.
- Represent the process and journey as ordered lists.
- Keep the portrait alternative text factual and useful; do not describe styling.
- Maintain sufficient contrast in the dark How I Work section.
- Do not rely on color alone for the active About navigation state.
- Give the About page a unique title and description using approved or clearly provisional wording.
- Preserve the shared canonical and social metadata behavior where values are available.

## Implementation Boundaries

- Keep Astro and static generation.
- Do not introduce a client framework.
- Keep About content separate from presentation through typed centralized data.
- Reuse the existing shared page layout and presentation system.
- Create page-specific presentation components only for the introduction, process rail, and journey timeline.
- Do not alter the content or purpose of the shared contact call to action or footer.
- Limit shared-header changes to the approved navigation sequence, About destination, and current-page state.
- Do not add routes other than `/about/`.
- Do not add dependencies. Astro, semantic HTML, and the existing CSS and testing setup are sufficient for this feature.
- Do not add client frameworks, animation libraries, timeline libraries, image-processing packages, layout libraries, or additional testing packages.

## Acceptance Criteria

- `/about/` is statically generated and resolves without a 404.
- The page renders the shared header, Introduction, How I Work, Selected Journey, shared contact call to action, and shared footer in that order.
- The page visibly labels its page-specific sections as `01 Introduction`, `02 How I Work`, and `03 Selected Journey`.
- The page contains exactly one `h1`.
- The introduction keeps its text and portrait in one section.
- The portrait or placeholder preserves a 4:5 box, uses a thin border, and appears after the text on mobile.
- The process contains exactly five ordered stages: Understand, Design, Build, Validate, and Improve.
- Every process stage exposes a number, title, description, and distinct working principle.
- The process is one horizontal five-stage rail on desktop and one numbered vertical sequence on mobile.
- The journey contains three or four ordered milestones.
- The journey uses one continuous vertical rule and contains no timeline dots or decorative icons.
- The journey remains narrower than the full container on desktop and moves its rule to the left edge on mobile.
- The shared header uses Work, About, Resume, Contact in that order on desktop and mobile.
- About is visibly marked and exposes `aria-current="page"` on `/about/`.
- Capabilities and GitHub do not appear in the primary navigation.
- GitHub remains available in the shared contact call to action according to its existing configured-or-unavailable behavior.
- The About page uses the same shared contact call to action and footer as the homepage and case studies.
- The footer does not gain a repeated navigation menu or About-specific content.
- Unapproved personal copy, dates, portrait content, and external destinations remain clearly provisional or absent.
- The page introduces no new client-side JavaScript or animation.
- Keyboard navigation, focus visibility, mobile-menu behavior, semantic landmarks, and text contrast remain usable.
- The production build succeeds.
- Browser acceptance coverage verifies route availability, section order, navigation order and current-page state, process count, journey count, and shared contact/footer presence.
- Human visual review covers desktop, tablet, and mobile widths without requiring brittle pixel-perfect screenshot assertions.
