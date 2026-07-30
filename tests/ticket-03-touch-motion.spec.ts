import { expect, test, type Page } from "@playwright/test";

const track = "[data-work-track]";
const selectedTitle = (page: Page) => page.locator(`${track} .work-card[aria-current="true"] h3`);

async function swipe(page: Page, deltaX: number, deltaY: number) {
  await page.locator(track).evaluate((element, delta) => {
    const start = { x: 180, y: 120 };
    const init = { bubbles: true, isPrimary: true, pointerId: 15, pointerType: "touch" };
    element.dispatchEvent(new PointerEvent("pointerdown", {
      ...init,
      clientX: start.x,
      clientY: start.y,
    }));
    element.dispatchEvent(new PointerEvent("pointerup", {
      ...init,
      clientX: start.x + delta.x,
      clientY: start.y + delta.y,
    }));
  }, { x: deltaX, y: deltaY });
}

test.describe("Issue #15 Featured Work interaction", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.setViewportSize({ width: 320, height: 900 });
  });

  test("keyboard arrows wrap and announce the selected project", async ({ page }) => {
    await page.locator(track).focus();
    await expect(selectedTitle(page)).toHaveText("Pharmacy Inventory System");

    await page.keyboard.press("ArrowLeft");
    await expect(selectedTitle(page)).toHaveText("LGU Inventory & Asset System");
    await expect(page.locator("[data-work-carousel] [data-deck-status]")).toHaveText(
      "Featured project 3 of 3: LGU Inventory & Asset System"
    );

    await page.keyboard.press("ArrowRight");
    await expect(selectedTitle(page)).toHaveText("Pharmacy Inventory System");
  });

  test("horizontal swipes move one project and wrap", async ({ page }) => {
    await swipe(page, -72, 0);
    await expect(selectedTitle(page)).toHaveText("Hospital OCR Automation Pipeline");
    await swipe(page, -72, 0);
    await swipe(page, -72, 0);
    await expect(selectedTitle(page)).toHaveText("Pharmacy Inventory System");
  });

  test("short and mostly vertical gestures leave selection and page scrolling available", async ({ page }) => {
    await swipe(page, 18, 2);
    await swipe(page, 14, 96);
    await expect(selectedTitle(page)).toHaveText("Pharmacy Inventory System");
    await expect(page.locator(track)).toHaveCSS("touch-action", "pan-y");

    await page.locator(track).scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 240);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
  });

  test("tablet controls wrap and keep focus on the carousel", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await page.locator("[data-work-prev]").click();
    await expect(selectedTitle(page)).toHaveText("LGU Inventory & Asset System");
    await page.locator("[data-work-next]").click();
    await expect(selectedTitle(page)).toHaveText("Pharmacy Inventory System");
  });

  test("selection persists across every responsive breakpoint", async ({ page }) => {
    await page.locator(track).focus();
    await page.keyboard.press("ArrowRight");
    await expect(selectedTitle(page)).toHaveText("Hospital OCR Automation Pipeline");

    for (const width of [768, 1279, 1280, 1440, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(selectedTitle(page)).toHaveText("Hospital OCR Automation Pipeline");
    }
  });

  test("reduced motion removes carousel transitions", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const durations = await page.locator(`${track} .work-card`).evaluateAll((cards) =>
      cards.map((card) => Number.parseFloat(getComputedStyle(card).transitionDuration))
    );
    expect(durations.every((duration) => duration < 0.01)).toBe(true);
  });
});
