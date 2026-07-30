# Homepage Featured Work

**Status:** ready for tickets

## Goal

Make Featured Work the homepage's primary proof section with three credible, equally discoverable case studies.

## Root spec coverage

- Sections 10–17: heading, purpose, card hierarchy, visuals, wide layout, and peeking deck
- Sections 32–35: color, contrast, depth, and motion
- Sections 36–39: responsive composition and approved Featured Work decisions

## Planned scope

- Show three project cards side by side without carousel controls at `1280px` and wider.
- Show two cards with previous and next controls from `768px` through `1279px`.
- Show one card without chevron controls below `768px`.
- Move by one project per control activation and wrap in both directions.
- Support Left and Right Arrow selection while the carousel has focus.
- Support horizontal swipe navigation on touch and pointer devices.
- Ignore short or mostly vertical gestures so normal page scrolling remains available.
- Use non-interactive position indicators.
- Remove autoplay.
- On tablet, use compact light circular controls with black chevrons and at least `44px` pointer targets.
- On mobile, use horizontal swipes as the primary navigation and retain non-interactive position indicators.
- Use real project identity first, real project imagery second, and intentional neutral placeholders last.
- Remove invented project branding, claims, and destinations.
- Reuse the current Featured Work titles, descriptions, and tags from `homepage-updated.html`.
- Limit card descriptions to three visible lines.
- Use the existing project mockups as temporary media until approved company or partner logos are available.
- Defer individual case-study destinations and omit those actions for the homepage-only scope.
- Use `FEATURED PROJECTS` as the eyebrow and `Selected work.` as the section title.
- Retain `See all work` linking to `/work`.
- Preserve the selected project when the viewport crosses a responsive breakpoint.
- Announce the selected project's position and title to screen readers without showing duplicate visible status text.
- Replace tests that require swipe or the current spotlight geometry.

## Approved content and behavior

- The three current Featured Work records in `homepage-updated.html` are the approved homepage content source.
- Existing project mockups are approved as temporary media.
- Approved company or partner logos may replace the mockups later.
- Individual case-study destinations are deferred; omit those actions for now.
- Use `FEATURED PROJECTS` and `Selected work.`.
- `See all work` uses `/work`.
- Left and Right Arrow select projects and wrap when the carousel has focus.
- Preserve the current selection across responsive breakpoint changes.

## Ticket requirements

- Replace old gesture and spotlight geometry tests.
- Verify three cards at `1280px` and wider, two cards with chevrons from `768px` through `1279px`, and one swipeable card without chevrons below `768px`.
- Verify pointer, keyboard, focus, wrapping, live announcement, and resize behavior.
- Verify horizontal swipes move one project, wrap, and do not block vertical scrolling.
- Verify descriptions remain within three lines and controls retain at least `44px` pointer targets.
- Verify mockups are presented as temporary media and do not introduce invented claims or branding.
