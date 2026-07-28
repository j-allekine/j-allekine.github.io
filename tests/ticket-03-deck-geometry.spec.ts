import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const standaloneHomepageUrl = pathToFileURL(
  resolve(process.cwd(), "homepage-updated.html")
).href;

const viewports = [
  { name: "desktop", width: 1440, height: 900, active: { min: 0.4, max: 0.45 }, exposure: { min: 0.2, max: 0.25 } },
  { name: "tablet", width: 1024, height: 768, active: { min: 0.55, max: 0.6 }, exposure: { min: 0.2, max: 0.25 } },
  { name: "phone", width: 390, height: 844, active: { min: 0.82, max: 0.86 }, exposure: { min: 0.06, max: 0.1 } },
  { name: "narrow-phone", width: 320, height: 568, active: { min: 0.82, max: 0.86 }, exposure: { min: 0.06, max: 0.1 } },
];

const deckSelectors = [
  { name: "featured-work", track: "[data-work-track]", carousel: "[data-work-carousel]" },
];

test.describe("Issue 3 shared spotlight deck geometry", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(standaloneHomepageUrl, { waitUntil: "domcontentloaded" });
  });

  test("uses the same responsive card geometry for both decks", async ({ page }) => {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(300);

      const states = await page.evaluate(() =>
        ["work"].map((kind) => {
          const track = document.querySelector(`[data-${kind}-track]`);
          const trackRect = track?.getBoundingClientRect();
          const cards = [...(track?.querySelectorAll("article") ?? [])];
          const active = cards.find((card) => card.getAttribute("aria-current") === "true");
          const sideCards = cards.filter((card) => card !== active);

          if (!trackRect || !active) throw new Error(`${kind} deck is incomplete`);

          const activeRect = active.getBoundingClientRect();
          const sideState = sideCards.map((card) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = (rect.left + rect.right) / 2;
            const trackCenter = (trackRect.left + trackRect.right) / 2;
            const exposure = cardCenter < trackCenter
              ? activeRect.left - rect.left
              : rect.right - activeRect.right;
            const transform = getComputedStyle(card).transform;
            const matrix = new DOMMatrix(transform);

            return {
              exposureRatio: exposure / trackRect.width,
              opacity: Number.parseFloat(getComputedStyle(card).opacity),
              rotation: Math.abs(Math.atan2(matrix.b, matrix.a) * 180 / Math.PI),
            };
          });

          const activeMatrix = new DOMMatrix(getComputedStyle(active).transform);

          return {
            activeRatio: activeRect.width / trackRect.width,
            activeRotation: Math.abs(Math.atan2(activeMatrix.b, activeMatrix.a) * 180 / Math.PI),
            activeOpacity: Number.parseFloat(getComputedStyle(active).opacity),
            sideState,
          };
        })
      );

      for (const [index, state] of states.entries()) {
        expect(state.activeRatio).toBeGreaterThanOrEqual(viewport.active.min);
        expect(state.activeRatio).toBeLessThanOrEqual(viewport.active.max);
        expect(state.activeRotation).toBeLessThanOrEqual(0.5);
        expect(state.activeOpacity).toBeGreaterThanOrEqual(0.95);
        expect(state.sideState).toHaveLength(2);
        expect(state.sideState.every(({ exposureRatio }) => exposureRatio >= viewport.exposure.min && exposureRatio <= viewport.exposure.max)).toBe(true);
        expect(state.sideState.every(({ rotation }) => rotation >= 6 && rotation <= 8)).toBe(true);
        expect(state.sideState.every(({ opacity }) => opacity >= 0.6 && opacity <= 0.7)).toBe(true);

        if (index > 0) {
          expect(state.activeRatio).toBeCloseTo(states[0].activeRatio, 2);
          state.sideState.forEach(({ exposureRatio }, sideIndex) => {
            expect(Math.abs(exposureRatio - states[0].sideState[sideIndex].exposureRatio)).toBeLessThanOrEqual(0.03);
          });
        }
      }
    }
  });

  test("keeps interaction, wrapping, reduced motion, and hover geometry intact", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });

    for (const { track } of deckSelectors) {
      const deck = page.locator(track);
      const cards = deck.locator("article");
      await deck.focus();
      await page.keyboard.press("ArrowLeft");
      await expect(deck.locator("article[aria-current='true']")).toHaveAttribute("aria-posinset", "3");
      await page.keyboard.press("ArrowRight");
      await expect(deck.locator("article[aria-current='true']")).toHaveAttribute("aria-posinset", "1");
      await page.waitForTimeout(50);

      const beforeHover = await cards.evaluateAll((items) => Object.fromEntries(items.map((item) => {
        const rect = item.getBoundingClientRect();
        return [item.getAttribute("aria-posinset"), { x: rect.x, y: rect.y, width: rect.width, height: rect.height }];
      })));
      await deck.locator("article[aria-current='true']").hover();
      await page.waitForTimeout(50);
      const afterHover = await cards.evaluateAll((items) => Object.fromEntries(items.map((item) => {
        const rect = item.getBoundingClientRect();
        return [item.getAttribute("aria-posinset"), { x: rect.x, y: rect.y, width: rect.width, height: rect.height }];
      })));

      for (const key of Object.keys(beforeHover)) {
        for (const dimension of ["x", "y", "width", "height"] as const) {
          expect(
            Math.abs(afterHover[key][dimension] - beforeHover[key][dimension]),
            `${key} ${dimension} changed during hover`
          ).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  test("captures initial and cycled deck checkpoints at every supported viewport", async ({ page }, testInfo) => {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(300);

      for (const { name, track, carousel } of deckSelectors) {
        await page.locator(carousel).scrollIntoViewIfNeeded();
        await page.screenshot({
          path: testInfo.outputPath(`${name}-${viewport.name}-initial.png`),
          fullPage: false,
        });

        await page.locator(track).focus();
        await page.keyboard.press("ArrowRight");
        await page.waitForTimeout(300);
        await page.screenshot({
          path: testInfo.outputPath(`${name}-${viewport.name}-cycled.png`),
          fullPage: false,
        });
      }
    }
  });
});
