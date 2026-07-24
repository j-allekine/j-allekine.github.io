# Portfolio v1

Status: ready-for-agent

## Problem Statement

J. Allekine needs a professional portfolio that positions them as an operational problem-solver who improves inefficient or unreliable work through practical automation. The current site is an untouched Astro starter and does not explain their professional value, provide evidence of their work, or give hiring managers a useful next step.

The portfolio must support a broad early-career positioning without becoming vague. It needs to demonstrate operational analysis, workflow design, spreadsheet systems, and data automation through three credible case studies. It must remain useful before final copy, project media, verified metrics, and external links are supplied, without inventing any of those details.

The visual experience must feel black-and-white, minimal, technical, calm, and credible. It must avoid generic developer-portfolio conventions, decorative AI-generated styling, excessive motion, and content-free skill claims.

## Solution

Build a statically generated Astro portfolio with a focused homepage, three dedicated case-study pages, and a small shared presentation system.

The homepage will introduce the portfolio with replaceable placeholder copy, present three equal featured-work cards, summarize “What I do,” and end with a direct contact call to action. Each featured-work card will lead to a dedicated case study following the agreed seven-section evidence structure. Shared components will provide a static header, custom Christian faith signal, contact CTA, footer, layout grid, typography, responsive behavior, and restrained interaction feedback.

The initial build will use centralized, clearly marked placeholder data. Missing personal content or links must remain visibly provisional or be omitted from interaction; the implementation must never fabricate project details, metrics, contact information, or destinations.

## User Stories

1. As a hiring manager, I want to understand the portfolio’s professional focus immediately, so that I can decide whether the candidate is relevant to an automation or operations role.
2. As a hiring manager, I want the portfolio to lead with operational improvement rather than a list of tools, so that I can understand the value the candidate creates.
3. As a hiring manager, I want to see three featured projects near the start of the homepage, so that I can reach evidence without reading a long introduction.
4. As a hiring manager, I want each featured project to show its problem and outcome in predictable positions, so that I can compare the work quickly.
5. As a hiring manager, I want each project card to expose role, system type, and year metadata, so that I can understand its context before opening it.
6. As a hiring manager, I want project tools to appear as secondary metadata, so that technology does not overshadow the operational problem.
7. As a hiring manager, I want each featured project to open a dedicated page, so that I can examine the work in sufficient detail.
8. As a hiring manager, I want every case study to start with a compact overview, so that I can orient myself quickly.
9. As a hiring manager, I want the problem section to explain what happened, who was affected, and why it mattered, so that I can judge whether the project addressed a real operational need.
10. As a hiring manager, I want the solution section to explain the improved workflow, so that I can understand the system without reverse-engineering screenshots.
11. As a hiring manager, I want the candidate’s contribution separated from the overall project, so that I can distinguish individual work from team output.
12. As a hiring manager, I want results to distinguish verified measurements from qualitative improvements, so that I can trust the claims.
13. As a hiring manager, I want two or three key decisions per project, so that I can evaluate the candidate’s judgment without reading technical archaeology.
14. As a hiring manager, I want project visuals to have explanatory captions, so that I know why each artifact matters.
15. As a hiring manager, I want previous and next project navigation, so that I can review all three case studies efficiently.
16. As a hiring manager, I want a direct email action after reviewing the work, so that contacting the candidate is easy.
17. As a hiring manager, I want resume and GitHub actions near the contact prompt, so that I can continue evaluating the candidate.
18. As a hiring manager, I want the site to feel restrained and credible, so that presentation supports rather than competes with the work.
19. As a visitor, I want navigation labels to be direct and familiar, so that I can find work, capabilities, resume, GitHub, and contact information.
20. As a visitor, I want the header to remain static, so that it does not occupy reading space or introduce distracting motion.
21. As a mobile visitor, I want navigation to expand directly below the header, so that the menu remains understandable and spatially predictable.
22. As a mobile visitor, I want project cards and gallery media to form one readable column, so that content does not become cramped.
23. As a tablet visitor, I want a two-column project grid with the final card centered at the same width, so that every project retains equal prominence.
24. As a desktop visitor, I want three equal project cards in one row, so that the homepage uses wide space efficiently.
25. As a keyboard user, I want a visible skip link, so that I can bypass repeated navigation and move directly to the main content.
26. As a keyboard user, I want every interactive element to have a visible focus state, so that I always know where I am.
27. As a keyboard user, I want the mobile menu to be operable without a pointer, so that I can open, navigate, and close it.
28. As a screen-reader user, I want semantic landmarks and headings, so that I can understand page structure and navigate efficiently.
29. As a screen-reader user, I want decorative faith marks hidden from the accessibility tree, so that they do not add meaningless repetition.
30. As a visitor with low vision, I want strong black-and-white contrast and readable type, so that the minimalist design remains usable.
31. As a motion-sensitive visitor, I want nonessential motion removed when reduced motion is requested, so that the site does not cause discomfort.
32. As a potential client, I want to understand the kinds of operational problems the candidate can handle, so that I can judge whether to make contact.
33. As a potential client, I want the work explained without developer jargon, so that I can understand the practical benefit.
34. As a potential client, I want a direct email route rather than a form, so that initiating a conversation is straightforward.
35. As the portfolio owner, I want homepage copy to be replaceable, so that I can provide the final positioning language later.
36. As the portfolio owner, I want project content centralized in a consistent model, so that I can replace placeholders without restructuring pages.
37. As the portfolio owner, I want optional verified metrics, so that I can add exact results when evidence exists without being forced to invent numbers.
38. As the portfolio owner, I want qualitative before-and-after results to remain valid content, so that projects without precise measurements can still be represented honestly.
39. As the portfolio owner, I want external contact, resume, and GitHub destinations centrally configurable, so that they can be supplied once.
40. As the portfolio owner, I want unavailable external actions to avoid fake destinations, so that the provisional site does not contain misleading links.
41. As the portfolio owner, I want gallery entries to support featured and supporting visuals, so that the strongest artifact receives appropriate hierarchy.
42. As the portfolio owner, I want the custom Christian faith signal to remain subtle, so that it reflects personal identity without becoming the site’s main message.
43. As the portfolio owner, I want the faith signal used in the header and favicon, so that it becomes part of the identity system.
44. As the portfolio owner, I want the footer faith signal to remain optional, so that it is not repeated without a visual need.
45. As the portfolio owner, I want the design system to use Geist Sans and restrained Geist Mono, so that the site feels technical without resembling a terminal.
46. As the portfolio owner, I want project pages to share one structure, so that new content remains coherent and easy to maintain.
47. As an implementation agent, I want explicit responsive and interaction rules, so that I can build without inventing design behavior.
48. As an implementation agent, I want placeholder content clearly distinguished from approved content, so that provisional material cannot be mistaken for fact.
49. As an implementation agent, I want one browser-level acceptance seam, so that behavior is tested at the user-visible boundary.
50. As a search visitor, I want each page to have a meaningful title and description, so that search results explain the page before I open it.
51. As a visitor opening a shared case-study link, I want its page metadata to describe that project, so that the shared link has useful context.
52. As a visitor on a slow connection, I want a lightweight static experience with limited JavaScript, so that the portfolio becomes usable quickly.
53. As a visitor viewing project media, I want images to reserve their layout space, so that the page does not jump while loading.
54. As a visitor, I want back-to-top access in the footer, so that I can return to the beginning of a long case study.

## Implementation Decisions

- Keep Astro as the site framework and use static generation. Do not introduce a client framework.
- Use one homepage route and one statically generated work route parameterized by project slug. Generate exactly three initial case-study routes from centralized project data.
- Use standard HTML anchors for navigation, consistent with Astro’s routing model.
- Build a shared page layout responsible for document metadata, global styles, the skip link, header, main-content target, contact CTA, and footer.
- Build reusable presentation modules for the custom cross mark, header, mobile navigation, featured-work grid, featured-work card, “What I do” ledger, contact CTA, footer, case-study layout, results comparison, key-decision list, gallery, and project navigation.
- Keep content separate from presentation through a typed site configuration and typed project records.
- The site configuration will support owner name, homepage placeholder copy, capability summaries, email, resume destination, GitHub destination, location, and footer text.
- External actions are optional until real values are supplied, but the agreed email, resume, and GitHub slots remain visible so the provisional build preserves the final layout. An unconfigured slot is clearly marked as placeholder content and is not rendered as an anchor. Do not create fake email addresses, placeholder outbound URLs, invented social profiles, or broken `#` destinations.
- Each project record will support slug, project number, title, one-sentence summary, category, role, timeline, tools, industry or system type, problem content, solution content, ordered workflow steps, contribution bullets, results, key decisions, and gallery media.
- Overview is one compact information block containing the project title, one-sentence summary, role, timeline, tools, and industry or system type. It is not a long prose section.
- Problem answers only what was happening, who was affected, and why it mattered. It contains no more than two short paragraphs or three bullets.
- Solution explains the improved workflow as an ordered sequence and includes one primary workflow diagram or main system screenshot within the section.
- My Contribution is a direct list of action-oriented bullets that distinguishes J. Allekine's work from the overall project.
- Results will support optional verified measurements and qualitative before-and-after statements. The UI must not imply that qualitative observations are measured metrics.
- Key decisions will contain only two or three entries per project. Each entry will identify the decision, reasoning, and relevant trade-off.
- Project Gallery includes only the strongest visuals needed to understand the work; do not add filler images. Every entry includes a media source, alternative text, and a one-line caption explaining why the visual matters. One featured visual spans the gallery width; supporting visuals use two columns on wider screens and one column on mobile. Do not repeat the primary Solution visual unless the gallery instance communicates a distinct detail.
- The first case study shows only next-project navigation, the last shows only previous-project navigation, and the middle shows both. Do not create circular navigation.
- Use clearly marked neutral placeholders for unprovided copy and media. Do not adapt the PhilHealth example into portfolio content unless the owner later confirms it as a real project.
- Homepage order is static header, text-led hero, featured work, “What I do,” contact CTA, and minimal footer.
- The hero is text-led and contains no portrait. It supports a role label, a replaceable positioning statement, supporting introduction, work anchor, and optional availability or location metadata.
- Featured work uses three equal technical-dossier cards. Cards have square corners, thin borders, no shadows, no pill badges, and no decorative gradients.
- Each featured-work card uses one descriptive link covering the card’s primary action. It includes project number, category, artifact area, title, problem-to-outcome summary, and secondary metadata.
- On desktop, the twelve-column grid gives each card four columns. At tablet widths, cards form two columns and the third equal-width card is centered on the second row. On mobile, cards form one column.
- Use representative layout thresholds of 1024px for the three-column desktop arrangement and 640px for the transition between tablet and mobile. Adjust only if browser validation shows the agreed content no longer remains readable.
- “What I do” is a structured capability ledger, not a tools list, skill-card grid, logo cloud, or proficiency display.
- The contact CTA uses the strongest black section on the page. Direct email is the primary action; resume and GitHub are secondary. No contact form or backend is included.
- The footer remains visually quiet and includes configurable identity text, optional location, copyright year, and a back-to-top link. It does not repeat a large navigation menu.
- The header is static on every viewport. It never sticks, hides, or reveals in response to scrolling.
- Desktop navigation remains visible in the header. Mobile navigation expands in normal document flow directly below the header.
- The mobile menu control exposes its open state and controlled region to assistive technology, supports keyboard activation, and closes through the same control and the Escape key.
- Place a “Back to work” link near the top of every case study.
- Place a skip link before the header. It targets the main content region and becomes visibly apparent when focused.
- Build one reusable custom SVG Latin-cross component. It uses `currentColor`, a crossbar above the midpoint, and a stroke weight consistent with divider lines.
- Use the full cross mark in the header and a simplified version for favicon readability at 16×16. A footer instance is optional and should appear only when needed for visual balance.
- Treat the cross mark as decorative when adjacent identity text already communicates the header identity. Decorative instances are hidden from the accessibility tree.
- Do not animate, glow, pattern, or repeatedly decorate with the cross mark.
- Use a predominantly white canvas, near-black text, thin black rules, restrained gray values when hierarchy requires them, and a black contact section. Do not add an accent color merely for decoration.
- Self-host Geist Sans as the primary font and Geist Mono as the metadata font, with sensible system fallbacks.
- Body copy uses Geist Sans at a fluid 17–18px size, 1.6 line height, and 400 weight. When viewport space permits, reading paragraphs target a width between 60 and 68 characters and never exceed 68 characters.
- Headings use Geist Sans at 500 or 600 weight. Avoid thin weights and aggressive negative letter spacing.
- Geist Mono is limited to metadata, project numbering, categories, tools, and workflow notation. It is never used for paragraph copy.
- The wide layout container has a maximum width of 1280px.
- Horizontal gutters use `clamp(1.25rem, 4vw, 4rem)`.
- The desktop layout uses twelve columns. Reading content uses a separate maximum width of 68 characters and never stretches to the wide container.
- Section spacing is generous and fluid through clamp-based values rather than fixed pixel spacing.
- Motion duration is 160–200ms with ease-out easing.
- Link arrows may move 3–4px. Card containers do not move by default; any necessary card movement must not exceed 2px.
- Motion is limited to link underline or arrow feedback, button hover and pressed states, subtle card border or background changes, and mobile-menu opening.
- Do not add scroll reveals, page-load animation, parallax, cursor effects, dramatic card lifting, or any animation that delays reading.
- Under `prefers-reduced-motion: reduce`, apply the override to every element and both pseudo-elements. Set scroll behavior to `auto`, and force transition and animation durations to `0.01ms` with an important override.
- Use semantic page landmarks, ordered heading levels, lists for repeated structured content, figures and captions for project media, and native interactive elements wherever possible.
- Maintain visible keyboard focus, adequate target sizes, and sufficient contrast. Do not rely on color alone to communicate state.
- Provide useful alternative text for informative project media. Use empty alternative text for images that are truly decorative.
- Reserve image dimensions to prevent layout shift. Load primary above-the-fold media appropriately and lazy-load supporting gallery media.
- Keep client-side JavaScript limited to the mobile-navigation interaction. Do not hydrate static presentation components.
- Give the homepage and every case study unique document titles and descriptions sourced from the central data. Use canonical metadata and basic social-sharing metadata where values are available.
- Keep the document language set to English.
- Preserve the current favicon formats while replacing their artwork with the simplified cross mark.
- Use the existing background-mode Astro development workflow documented in the repository instructions.

## Testing Decisions

- Use one high-level browser seam: a Playwright acceptance suite executed against the production Astro build. Tests exercise user-visible behavior rather than internal component structure.
- Require the production build command to succeed before browser acceptance tests run.
- Add no unit tests for individual Astro components. The repository has no prior test infrastructure, and component-level tests would create lower-value seams for a small static portfolio.
- Treat the existing production build as prior art for integration validation. The browser suite is the only new automated behavior seam.
- Verify the homepage renders the agreed section order and exposes exactly three featured-work cards.
- Verify featured-work cards navigate to three generated case-study routes.
- Verify each case study exposes Overview, Problem, Solution, My Contribution, Results, Key Decisions, and Project Gallery in that order.
- Verify Overview renders as one compact block with all six agreed metadata fields.
- Verify Problem contains no more than two paragraphs or three bullets and identifies what happened, who was affected, and why it mattered.
- Verify Solution presents an ordered workflow and one primary diagram or system screenshot.
- Verify My Contribution renders as an action-oriented list distinct from the general project description.
- Verify every case study contains two or three key decisions.
- Verify every gallery item has a one-line caption and the featured item receives full-width hierarchy.
- Verify case-study project navigation follows the non-circular previous-and-next rules.
- Verify shared contact CTA and footer behavior on the homepage and every case study.
- Verify the skip link is the first focusable control, becomes visible on focus, and moves focus or navigation to the main-content target.
- Verify the mobile menu opens below the static header, reports its state, supports keyboard operation, and closes with Escape.
- Verify the desktop layout presents three featured-work columns at a representative 1280px viewport.
- Verify the tablet layout presents two columns and centers the third equal-width card at a representative 768px viewport.
- Verify the mobile layout presents one card column and one gallery column at a representative 375px viewport.
- Verify the header remains in normal document flow and does not become sticky while scrolling.
- Verify internal links resolve without 404 responses.
- Verify email, resume, and GitHub slots remain visible when unconfigured but do not render fabricated or broken anchors.
- Verify headings, landmarks, figures, captions, accessible names, and focus visibility through browser-observable behavior.
- Verify reduced-motion emulation produces automatic scroll behavior and `0.01ms` transition and animation durations for elements and pseudo-elements.
- Avoid brittle pixel-perfect screenshot assertions. Use screenshots for human visual review at desktop, tablet, and mobile widths, while automated assertions focus on structure, visibility, navigation, and state.
- Run `git diff --check` alongside the build and browser suite as a repository hygiene check.

## Out of Scope

- Final biography, positioning copy, project narratives, or polished microcopy supplied by the portfolio owner.
- Invented project details, metrics, results, tools, timelines, industries, contact information, or outbound links.
- More than three initial case studies.
- A separate About page.
- A separate Contact page.
- A contact form, email service, database, or server-side submission handling.
- Resume writing or generation.
- A blog, writing section, testimonials, services page, pricing, or client intake workflow.
- A content management system or admin interface.
- User accounts, authentication, personalization, comments, or search.
- Skill ratings, progress bars, tool-logo walls, or generic technology badge collections.
- A portrait-led hero or decorative personal photography.
- Dark mode or a theme switcher.
- Decorative color accents, gradients, glass effects, rounded SaaS cards, shadows, or terminal styling.
- Scroll reveals, page transitions, parallax, custom cursors, or theatrical animation.
- Analytics, tracking, cookies, or consent UI.
- Internationalization.
- Deployment-provider configuration, DNS changes, or publishing the site.
- Creating implementation ticket files; a later ticketing workflow may split this specification after approval.

## Further Notes

- Use the repository glossary’s terms: operational problem-solver, automation, faith signal, case study, featured work, primary audience, and secondary audience.
- The primary audience is hiring managers. Potential clients are secondary.
- Placeholder content is an implementation aid, not approved portfolio copy. Keep it centralized and conspicuously replaceable.
- The case-study structure deliberately folds previous workflow into Problem, system design into Solution, constraints and lessons into Key Decisions, primary artifact into Solution, and implementation artifacts into Project Gallery.
- The design should feel like a precise technical record rather than a generic developer template.
- Accessibility and performance are credibility signals, not optional polish.
- Astro’s current guidance supports file-based static routes, standard HTML anchors, reusable Astro components, and scoped or global CSS as appropriate for this implementation.
