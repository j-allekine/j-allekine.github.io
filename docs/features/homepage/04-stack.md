# Homepage Stack

**Status:** ready for tickets

## Goal

Preserve the existing Stack marquee while making it more compact and consistent with the new reading width.

## Root spec coverage

- Sections 18–19: preserved marquee and heading
- Sections 29 and 31–35: typography and shared visual behavior
- Sections 36–39: responsive placement

## Planned scope

- Preserve the horizontal marquee, technology marks, pill-like items, dark treatment, and understated motion.
- Reduce excess vertical height and spacing.
- Place the section within the normal reading width.
- Preserve reduced-motion behavior.
- Avoid turning the section into a new tool showcase or card grid.

## Resolved decisions

- Preserve the current 12-tool list and its order. The root specification approves the existing Stack component and its tool-list personality.
- Retain the existing technology marks and external image sources. Replacing them with local assets is outside this ticket's scope.
- Keep the duplicated marquee sequence solely for seamless looping. Treat the duplicate as implementation content rather than a second tool list.
- Retain `View all →` and link it to the approved `/stack` destination.
- When reduced motion is requested, stop the marquee animation and present the tools as a stationary, horizontally scrollable one-row strip.
- Keep the compact Stack section within the normal reading width at every supported viewport.

## Ticket requirements

- Make compact spacing testable at the approved `320`, `768`, `1279`, `1280`, and `1440` px review widths.
- Verify the animated marquee loops seamlessly without exposing a visual break between sequences.
- Verify reduced motion stops automatic movement while every tool remains reachable without animation.
- Identify existing marquee tests as retain, rewrite, replace, or remove before implementation.
