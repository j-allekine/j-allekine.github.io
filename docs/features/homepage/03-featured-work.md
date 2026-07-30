# Homepage Featured Work

**Status:** needs more info

## Goal

Make Featured Work the homepage's primary proof section with three credible, equally discoverable case studies.

## Root spec coverage

- Sections 10–17: heading, purpose, card hierarchy, visuals, wide layout, and peeking deck
- Sections 32–35: color, contrast, depth, and motion
- Sections 36–39: responsive composition and approved Featured Work decisions

## Planned scope

- Show three project cards side by side at `1280px` and wider.
- Use the centered peeking deck below `1280px`.
- Let visitors select a visible adjacent card by pointer or keyboard.
- Keep only the active card's case-study action available in the peeking deck.
- Use non-interactive position indicators.
- Remove swipe navigation, arrow controls, and autoplay.
- Preserve explicit `View case study` actions.
- Use real project identity first, real project imagery second, and intentional neutral placeholders last.
- Remove invented project branding, claims, and destinations.
- Reuse the current Featured Work titles, descriptions, and tags from `homepage-updated.html`.
- Defer individual case-study destinations and omit those actions for the homepage-only scope.
- Replace tests that require swipe or the current spotlight geometry.

## Needs Info

- The three current Featured Work records in `homepage-updated.html` are the approved homepage content source.
- What real logo or project image may be used for each card?
- What neutral placeholder treatment is approved when no media is available?
- Individual case-study destinations are deferred; omit those actions for now.
- What is the final eyebrow and section title? The root spec contains both a TBD statement and a later example.
- `View all work` uses `/work` if retained.
- Should Left and Right Arrow select adjacent cards and wrap when the deck has focus?
- What selection state should be preserved when crossing the `1280px` breakpoint?

## Ready for tickets when

- The three projects, content, media state, and destinations are approved.
- Heading wording and View All behavior are decided.
- Pointer, keyboard, focus, wrapping, live announcement, and resize behavior are explicit.
- Old gesture and spotlight tests are identified for replacement or removal.
