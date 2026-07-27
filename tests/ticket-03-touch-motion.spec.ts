import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const standaloneHomepageUrl = pathToFileURL(
  resolve(process.cwd(), "homepage-updated.html")
).href;

const workTrack = "[data-work-track]";

const dispatchPointerGesture = async (
  page: Parameters<typeof test>[0] extends never ? never : import("@playwright/test").Page,
  deltaX: number,
  deltaY: number
) => {
  await page.evaluate(({ deltaX: x, deltaY: y }) => {
    const track = document.querySelector("[data-work-track]");
    if (!track) throw new Error("Featured Work track is missing");

    const startX = 180;
    const startY = 120;
    const pointerInit = {
      bubbles: true,
      isPrimary: true,
      pointerId: 7,
      pointerType: "touch",
    };

    track.dispatchEvent(
      new PointerEvent("pointerdown", {
        ...pointerInit,
        clientX: startX,
        clientY: startY,
      })
    );
    track.dispatchEvent(
      new PointerEvent("pointerup", {
        ...pointerInit,
        clientX: startX + x,
        clientY: startY + y,
      })
    );
  }, { deltaX, deltaY });
};

const activeTitle = (page: import("@playwright/test").Page) =>
  page.locator(`${workTrack} .work-card.is-active h3`);

test.describe("ticket 03 Featured Work touch and motion", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(standaloneHomepageUrl, { waitUntil: "domcontentloaded" });
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test("accepts horizontal gestures, rejects short or vertical input, and wraps", async ({ page }) => {
    await expect(activeTitle(page)).toHaveText("Pharmacy Inventory System");
    await expect(page.locator(workTrack)).toHaveCSS("touch-action", "pan-y");

    const measurementsDuringGesture = await page.evaluate(() => {
      const track = document.querySelector("[data-work-track]") as HTMLElement;
      const originalGetBoundingClientRect = track.getBoundingClientRect;
      let measurements = 0;

      track.getBoundingClientRect = () => {
        measurements += 1;
        return originalGetBoundingClientRect.call(track);
      };

      const startX = 180;
      const startY = 120;
      const pointerInit = {
        bubbles: true,
        isPrimary: true,
        pointerId: 11,
        pointerType: "touch",
      };

      track.dispatchEvent(new PointerEvent("pointerdown", {
        ...pointerInit,
        clientX: startX,
        clientY: startY,
      }));
      track.dispatchEvent(new PointerEvent("pointermove", {
        ...pointerInit,
        clientX: startX - 72,
        clientY: startY,
      }));
      track.dispatchEvent(new PointerEvent("pointerup", {
        ...pointerInit,
        clientX: startX - 72,
        clientY: startY,
      }));

      track.getBoundingClientRect = originalGetBoundingClientRect;
      return measurements;
    });

    expect(measurementsDuringGesture).toBe(0);
    await expect(activeTitle(page)).toHaveText("Hospital OCR Automation Pipeline");

    await dispatchPointerGesture(page, -72, 0);
    await expect(activeTitle(page)).toHaveText("LGU Inventory & Asset System");
    await dispatchPointerGesture(page, -72, 0);
    await expect(activeTitle(page)).toHaveText("Pharmacy Inventory System");

    await dispatchPointerGesture(page, 72, 0);
    await expect(activeTitle(page)).toHaveText("LGU Inventory & Asset System");

    await dispatchPointerGesture(page, 18, 2);
    await expect(activeTitle(page)).toHaveText("LGU Inventory & Asset System");
    await dispatchPointerGesture(page, 14, 96);
    await expect(activeTitle(page)).toHaveText("LGU Inventory & Asset System");
  });

  test("supports the same gesture outcomes on phone and tablet", async ({ page }) => {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 800, height: 768 },
    ]) {
      await page.goto(standaloneHomepageUrl, { waitUntil: "domcontentloaded" });
      await page.setViewportSize(viewport);

      await dispatchPointerGesture(page, -72, 0);
      await expect(activeTitle(page)).toHaveText("Hospital OCR Automation Pipeline");

      await dispatchPointerGesture(page, 14, 96);
      await expect(activeTitle(page)).toHaveText("Hospital OCR Automation Pipeline");
    }
  });

  test("does not block page scrolling or swallow a click after cancellation", async ({ page }) => {
    const track = page.locator(workTrack);
    await track.scrollIntoViewIfNeeded();

    const scrollBefore = await page.evaluate(() => window.scrollY);
    const trackBox = await track.boundingBox();
    if (!trackBox) throw new Error("Featured Work track has no layout box");
    await page.mouse.move(trackBox.x + trackBox.width / 2, trackBox.y + trackBox.height / 2);
    await page.mouse.wheel(0, 240);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollBefore);

    await page.evaluate(() => {
      const trackElement = document.querySelector("[data-work-track]");
      if (!trackElement) throw new Error("Featured Work track is missing");

      const pointerInit = {
        bubbles: true,
        isPrimary: true,
        pointerId: 19,
        pointerType: "touch",
        clientX: 180,
        clientY: 120,
      };
      trackElement.dispatchEvent(new PointerEvent("pointerdown", pointerInit));
      trackElement.dispatchEvent(new PointerEvent("pointercancel", pointerInit));
    });

    await page.locator(`${workTrack} .work-card`).nth(1).evaluate((card) => (card as HTMLElement).click());
    await expect(activeTitle(page)).toHaveText("Hospital OCR Automation Pipeline");
  });

  test("keeps phone indicators non-interactive and synchronized", async ({ page }) => {
    const dots = page.locator("[data-work-dots]");
    const cards = page.locator(`${workTrack} .work-card`);

    await expect(dots).toBeVisible();
    await expect(dots.locator("button")).toHaveCount(0);
    expect(await dots.getAttribute("aria-hidden")).toBe("true");
    expect(await dots.locator(".deck-dot").evaluateAll((items) =>
      items.map((item) => ({
        tag: item.tagName,
        tabIndex: (item as HTMLElement).tabIndex,
        current: item.getAttribute("aria-current"),
      }))
    )).toEqual([
      { tag: "SPAN", tabIndex: -1, current: "true" },
      { tag: "SPAN", tabIndex: -1, current: "false" },
      { tag: "SPAN", tabIndex: -1, current: "false" },
    ]);

    await cards.nth(1).evaluate((card) => (card as HTMLElement).click());
    await expect(activeTitle(page)).toHaveText("Hospital OCR Automation Pipeline");
    await expect(dots.locator("[aria-current='true']")).toHaveAttribute("data-deck-index", "1");

    await page.locator(workTrack).focus();
    await page.keyboard.press("ArrowRight");
    await expect(activeTitle(page)).toHaveText("LGU Inventory & Asset System");
    await expect(dots.locator("[aria-current='true']")).toHaveAttribute("data-deck-index", "2");

    await dispatchPointerGesture(page, 72, 0);
    await expect(activeTitle(page)).toHaveText("Hospital OCR Automation Pipeline");
    await expect(dots.locator("[aria-current='true']")).toHaveAttribute("data-deck-index", "1");

    await page.setViewportSize({ width: 800, height: 768 });
    await expect(dots).toBeHidden();
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(dots).toBeVisible();
    await expect(dots.locator("[aria-current='true']")).toHaveAttribute("data-deck-index", "1");
  });

  test("keeps only the centered card link actionable", async ({ page }) => {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      const linkState = await page.evaluate(() =>
        [...document.querySelectorAll("[data-work-track] .work-card")].map((card) => {
          const link = card.querySelector(".work-link") as HTMLAnchorElement | null;
          return {
            active: card.classList.contains("is-active"),
            tabIndex: link?.tabIndex,
            pointerEvents: link ? getComputedStyle(link).pointerEvents : "",
            ariaDisabled: link?.getAttribute("aria-disabled"),
          };
        })
      );

      expect(linkState).toEqual([
        { active: true, tabIndex: 0, pointerEvents: "auto", ariaDisabled: "false" },
        { active: false, tabIndex: -1, pointerEvents: "none", ariaDisabled: "true" },
        { active: false, tabIndex: -1, pointerEvents: "none", ariaDisabled: "true" },
      ]);
    }
  });

  test("respects reduced motion and preserves selection across resize and orientation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.locator(`${workTrack} .work-card`).nth(2).evaluate((card) => (card as HTMLElement).click());
    await expect(activeTitle(page)).toHaveText("LGU Inventory & Asset System");

    const transitionDuration = await page.locator(`${workTrack} .work-card.is-active`).evaluate(
      (card) => Number.parseFloat(getComputedStyle(card).transitionDuration)
    );
    expect(transitionDuration).toBeLessThan(1);

    for (const viewport of [
      { width: 320, height: 568 },
      { width: 390, height: 844 },
      { width: 800, height: 768 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await page.evaluate(() => window.dispatchEvent(new Event("orientationchange")));
      await expect(page.locator(`${workTrack} .work-card.is-active`)).toHaveCount(1);
      await expect(activeTitle(page)).toHaveText("LGU Inventory & Asset System");
    }
  });

  test("captures the phone deck before and after completed swipes", async ({ page }, testInfo) => {
    for (const viewport of [
      { name: "phone", width: 390, height: 844 },
      { name: "minimum-phone", width: 320, height: 568 },
    ]) {
      await page.goto(standaloneHomepageUrl, { waitUntil: "domcontentloaded" });
      await page.setViewportSize(viewport);
      await page.locator("[data-work-carousel]").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: testInfo.outputPath(`ticket-03-${viewport.name}-before.png`),
        fullPage: false,
      });

      await dispatchPointerGesture(page, -72, 0);
      await page.waitForTimeout(300);
      await page.screenshot({
        path: testInfo.outputPath(`ticket-03-${viewport.name}-after.png`),
        fullPage: false,
      });
      await expect(activeTitle(page)).toHaveText("Hospital OCR Automation Pipeline");
    }
  });
});
