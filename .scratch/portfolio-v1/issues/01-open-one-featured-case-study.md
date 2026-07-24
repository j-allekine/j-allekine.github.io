# 01 — Open one featured case study

**What to build:** Replace the untouched starter with the first thin portfolio experience: a hiring manager can open the homepage, understand that the site presents operational improvement work, select one featured-work card, and reach a generated case-study page with a compact Overview. All displayed content is centralized, typed, and unmistakably provisional when the owner has not supplied facts.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [x] The homepage replaces the Astro starter and presents an initial text-led introduction followed by one provisional featured-work card.
- [x] The featured-work card exposes project number, category, title, a problem-to-outcome summary, role, system type, year, and secondary tool metadata without presenting tools as the main value.
- [x] One descriptive primary link opens a statically generated case-study route sourced from the project slug.
- [x] The case-study page provides a “Back to work” link and one compact Overview containing title, one-sentence summary, role, timeline, tools, and industry or system type.
- [x] Site configuration and project content are held in centralized typed records that can represent the remaining agreed homepage and case-study content without embedding facts in presentation components.
- [x] Unprovided personal copy and project facts are visibly neutral placeholders; no project detail, metric, contact destination, or external link is fabricated.
- [x] The shared document shell uses English, semantic landmarks, a meaningful homepage title and description, and a meaningful case-study title and description.
- [x] A Playwright acceptance seam runs against the production Astro build and verifies the homepage-to-case-study journey at the browser boundary.
- [x] The production build, initial browser acceptance check, and repository diff hygiene check pass.
