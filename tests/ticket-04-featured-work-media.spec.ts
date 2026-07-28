import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const standaloneHomepageUrl = pathToFileURL(
  resolve(process.cwd(), "homepage-updated.html")
).href;

const supportedViewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "phone", width: 390, height: 844 },
  { name: "narrow-phone", width: 320, height: 568 },
];

test.describe("Issue #4 Featured Work media", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(standaloneHomepageUrl, { waitUntil: "domcontentloaded" });
  });

  test("keeps one full-width preview stable at every supported viewport", async ({ page }, testInfo) => {
    const mediaStates = [];

    for (const viewport of supportedViewports) {
      await page.setViewportSize(viewport);
      await page.locator("[data-work-carousel]").scrollIntoViewIfNeeded();

      const cards = page.locator("[data-work-track] .work-card");
      await expect(cards).toHaveCount(3);
      const cardStates = await cards.evaluateAll((cards) => cards.map((card) => {
        const media = card.querySelector<HTMLElement>(".work-visual");
        const preview = card.querySelector<HTMLElement>(".mock-window");
        if (!media || !preview) throw new Error("Featured Work media is missing");

        return {
          cardWidth: (card as HTMLElement).offsetWidth,
          cardHeight: (card as HTMLElement).offsetHeight,
          mediaWidth: media.offsetWidth,
          mediaHeight: media.offsetHeight,
          previewWidth: preview.offsetWidth,
          previewHeight: preview.offsetHeight,
          mediaOverflow: getComputedStyle(media).overflow,
          mediaItems: card.querySelectorAll(":scope > .work-visual").length,
          nestedControls: media.querySelectorAll("button, a, [role='button'], [role='slider'], [role='tablist']").length,
        };
      }));

      for (const [index, state] of cardStates.entries()) {
        expect(state.mediaItems, `${viewport.name} card ${index}`).toBe(1);
        expect(state.nestedControls, `${viewport.name} card ${index}`).toBe(0);
        expect(state.mediaWidth, `${viewport.name} card ${index}`).toBeGreaterThanOrEqual(
          state.cardWidth - 2
        );
        expect(state.previewWidth, `${viewport.name} card ${index}`).toBe(state.mediaWidth);
        expect(state.previewHeight, `${viewport.name} card ${index}`).toBeGreaterThanOrEqual(
          state.mediaHeight - 1
        );
        expect(state.mediaOverflow, `${viewport.name} card ${index}`).toBe("hidden");
        expect(state.mediaHeight / state.cardHeight, `${viewport.name} card ${index}`).toBeGreaterThanOrEqual(0.35);
        expect(state.mediaHeight / state.cardHeight, `${viewport.name} card ${index}`).toBeLessThanOrEqual(0.4);
      }

      await page.screenshot({
        path: testInfo.outputPath(`ticket-04-${viewport.name}-media.png`),
        fullPage: false,
      });

      mediaStates.push({ viewport: viewport.name, cardStates });
    }

    expect(mediaStates).toHaveLength(supportedViewports.length);
  });
});
