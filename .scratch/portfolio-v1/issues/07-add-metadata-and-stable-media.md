# 07 — Add metadata and stable media

**What to build:** Make every portfolio page useful when found through search or shared directly, and keep project media stable on slow connections. Visitors receive accurate page context without fabricated sharing values, disruptive layout shifts, or unnecessary client-side weight.

**Blocked by:** 03 — Browse all three case studies.

**Status:** ready-for-agent

- [ ] The homepage and every case study provide unique titles and descriptions sourced from centralized site and project data.
- [ ] Each page emits canonical metadata and basic social-sharing metadata when corresponding real values are available.
- [ ] Unavailable canonical or social values are omitted or remain explicitly provisional without fabricated domains, images, project claims, or outbound destinations.
- [ ] Informative project media uses useful alternative text, truly decorative images use empty alternative text, and every gallery visual retains its explanatory caption.
- [ ] Every image reserves its layout space through known dimensions or an equivalent stable aspect ratio so content does not jump while media loads.
- [ ] Primary above-the-fold media receives appropriate loading priority, while supporting gallery media is lazy-loaded.
- [ ] The primary Solution media is not repeated in the gallery unless the gallery instance communicates a distinct, documented detail.
- [ ] The site remains statically generated and lightweight, with no new client-side runtime beyond the approved mobile-navigation behavior.
- [ ] Browser acceptance coverage verifies page metadata, available-value behavior, image dimensions or aspect reservation, loading strategy, alternative text, captions, and the absence of unexpected client-side hydration.
- [ ] The production build, browser acceptance suite, and repository diff hygiene check pass.
