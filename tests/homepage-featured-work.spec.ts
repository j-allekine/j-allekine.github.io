import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const homepageUrl = pathToFileURL(resolve(process.cwd(), "homepage-updated.html")).href;

const visibleCardCount = (page: import("@playwright/test").Page) =>
  page.locator("#work .work-card").evaluateAll((cards) =>
    cards.filter((card) => {
      const style = getComputedStyle(card);
      return style.display !== "none" && style.visibility !== "hidden";
    }).length
  );

test.describe("homepage Featured Work", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(homepageUrl, { waitUntil: "domcontentloaded" });
  });

  test("uses the approved content and responsive card counts", async ({ page }) => {
    const work = page.locator("#work");
    await expect(work.locator(".section-label")).toHaveText("Featured projects");
    await expect(work.getByRole("heading", { level: 2 })).toHaveText("Selected work.");
    await expect(work.getByRole("link", { name: /See all work/ })).toHaveAttribute("href", "/work");
    await expect(work.getByText("View case study")).toHaveCount(0);

    for (const expectation of [
      { width: 320, cards: 1, controls: 0 },
      { width: 768, cards: 2, controls: 2 },
      { width: 1279, cards: 2, controls: 2 },
      { width: 1280, cards: 3, controls: 0 },
      { width: 1440, cards: 3, controls: 0 },
    ]) {
      await page.setViewportSize({ width: expectation.width, height: 900 });
      expect(await visibleCardCount(page), `${expectation.width}px visible cards`).toBe(
        expectation.cards,
      );
      await expect(work.locator(".work-carousel__control:visible")).toHaveCount(
        expectation.controls,
      );
      const visibleMedia = await work.locator(".work-card").evaluateAll((cards) =>
        cards
          .filter((card) => getComputedStyle(card).display !== "none")
          .map((card) => {
            const cardBox = card.getBoundingClientRect();
            const mediaBox = card.querySelector(".work-visual")!.getBoundingClientRect();
            return {
              cardWidth: cardBox.width,
              mediaWidth: mediaBox.width,
              overflow: getComputedStyle(card.querySelector(".work-visual")!).overflow,
              contentFits: card.scrollHeight <= card.clientHeight + 1,
            };
          })
      );
      for (const media of visibleMedia) {
        expect(Math.abs(media.cardWidth - media.mediaWidth)).toBeLessThanOrEqual(2);
        expect(media.overflow).toBe("hidden");
        expect(media.contentFits).toBe(true);
      }
      await expect(page.locator("html")).toHaveJSProperty("scrollWidth", expectation.width);
    }
  });

  test("wraps with controls and keyboard while preserving selection across resize", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    const work = page.locator("#work");
    const track = work.locator("[data-work-track]");
    const status = work.locator("[data-deck-status]");

    await work.locator("[data-work-prev]").click();
    await expect(status).toContainText("3 of 3: LGU Inventory & Asset System");

    await track.press("ArrowRight");
    await expect(status).toContainText("1 of 3: Pharmacy Inventory System");

    await work.locator("[data-work-next]").click();
    await expect(status).toContainText("2 of 3: Hospital OCR Automation Pipeline");

    await page.setViewportSize({ width: 320, height: 700 });
    await expect(work.locator(".work-card[aria-current='true'] h3")).toHaveText(
      "Hospital OCR Automation Pipeline",
    );
    await expect(work.locator(".deck-dot[aria-current='true']")).toHaveAttribute(
      "data-deck-index",
      "1",
    );
  });

  test("accepts horizontal swipes, ignores vertical gestures, and honors reduced motion", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    const work = page.locator("#work");
    const track = work.locator("[data-work-track]");
    const status = work.locator("[data-deck-status]");

    await track.dispatchEvent("pointerdown", {
      pointerId: 1,
      isPrimary: true,
      clientX: 250,
      clientY: 200,
    });
    await track.dispatchEvent("pointerup", {
      pointerId: 1,
      isPrimary: true,
      clientX: 150,
      clientY: 205,
    });
    await expect(status).toContainText("2 of 3");

    await track.dispatchEvent("pointerdown", {
      pointerId: 2,
      isPrimary: true,
      clientX: 180,
      clientY: 150,
    });
    await track.dispatchEvent("pointerup", {
      pointerId: 2,
      isPrimary: true,
      clientX: 175,
      clientY: 260,
    });
    await expect(status).toContainText("2 of 3");

    await page.emulateMedia({ reducedMotion: "reduce" });
    const reducedDuration = await work.locator(".work-card").first().evaluate((card) =>
      Number.parseFloat(getComputedStyle(card).transitionDuration)
    );
    expect(reducedDuration).toBeLessThanOrEqual(0.001);
  });
});
