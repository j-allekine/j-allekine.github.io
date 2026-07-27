import { expect, test, type Page } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const standaloneHomepageUrl = pathToFileURL(
  resolve(process.cwd(), "homepage-updated.html")
).href;

const serviceTrack = "[data-services-track]";
const activeTitle = (page: Page) =>
  page.locator(`${serviceTrack} article[aria-current="true"] h3`);

const dispatchPointerGesture = async (
  page: Page,
  deltaX: number,
  deltaY: number
) => {
  await page.evaluate(({ deltaX: x, deltaY: y }) => {
    const track = document.querySelector("[data-services-track]");
    if (!track) throw new Error("Services track is missing");

    const pointerInit = {
      bubbles: true,
      isPrimary: true,
      pointerId: 23,
      pointerType: "touch",
    };

    track.dispatchEvent(new PointerEvent("pointerdown", {
      ...pointerInit,
      clientX: 180,
      clientY: 120,
    }));
    track.dispatchEvent(new PointerEvent("pointerup", {
      ...pointerInit,
      clientX: 180 + x,
      clientY: 120 + y,
    }));
  }, { deltaX, deltaY });
};

test.describe("ticket 04 Services spotlight", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(standaloneHomepageUrl, { waitUntil: "domcontentloaded" });
  });

  test("uses the shared spotlight structure without service controls or actions", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    await expect(page.locator("[data-services-carousel]")).toHaveAttribute(
      "aria-roledescription",
      "spotlight deck"
    );
    await expect(page.locator(`${serviceTrack} article`)).toHaveCount(3);
    await expect(page.locator("[data-services-prev], [data-services-next]")).toHaveCount(0);
    await expect(page.locator(`${serviceTrack} article a`)).toHaveCount(0);

    await expect(activeTitle(page)).toHaveText("Spreadsheet & Data Systems");
    await expect(page.locator(`${serviceTrack} article[aria-current="false"]`)).toHaveCount(2);
    await expect(page.locator(`${serviceTrack} article[aria-current="true"] svg`)).toBeVisible();

    const serviceText = await page.locator(`${serviceTrack} article`).allTextContents();
    expect(serviceText[0]).toContain(
      "Turn operational spreadsheets into reliable systems for tracking, reporting, inventory, finance, and day-to-day data."
    );
    await expect(page.locator(`${serviceTrack} article p`).first()).toContainText(
      "Turn operational spreadsheets into reliable systems"
    );
  });

  test("cycles by side-card selection, keyboard, and horizontal gestures", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const cards = page.locator(`${serviceTrack} article`);
    await cards.nth(1).evaluate((card) => (card as HTMLElement).click());
    await expect(activeTitle(page)).toHaveText("Workflow Automation");

    await page.locator(serviceTrack).focus();
    await page.keyboard.press("ArrowRight");
    await expect(activeTitle(page)).toHaveText("Internal Tools & Web Apps");
    await page.keyboard.press("ArrowRight");
    await expect(activeTitle(page)).toHaveText("Spreadsheet & Data Systems");
    await page.keyboard.press("ArrowLeft");
    await expect(activeTitle(page)).toHaveText("Internal Tools & Web Apps");

    await dispatchPointerGesture(page, -72, 0);
    await expect(activeTitle(page)).toHaveText("Spreadsheet & Data Systems");
    await dispatchPointerGesture(page, 72, 0);
    await expect(activeTitle(page)).toHaveText("Internal Tools & Web Apps");
  });

  test("rejects short and vertical gestures and synchronizes phone-only dots", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await dispatchPointerGesture(page, 18, 2);
    await dispatchPointerGesture(page, 14, 96);
    await expect(activeTitle(page)).toHaveText("Spreadsheet & Data Systems");

    const dots = page.locator("[data-services-dots]");
    await expect(dots).toBeVisible();
    await expect(dots).toHaveAttribute("aria-hidden", "true");
    await expect(dots.locator("button")).toHaveCount(0);
    await expect(dots.locator("[aria-current='true']")).toHaveAttribute("data-deck-index", "0");

    await dispatchPointerGesture(page, -72, 0);
    await expect(activeTitle(page)).toHaveText("Workflow Automation");
    await expect(dots.locator("[aria-current='true']")).toHaveAttribute("data-deck-index", "1");

    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(dots).toBeHidden();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(dots).toBeHidden();
  });

  test("keeps selection and state stable with reduced motion at supported widths", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 320, height: 568 });

    await page.locator(`${serviceTrack} article`).nth(2).evaluate((card) => (card as HTMLElement).click());
    await expect(activeTitle(page)).toHaveText("Internal Tools & Web Apps");
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 1024, height: 768 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await expect(page.locator(`${serviceTrack} article[aria-current="true"]`)).toHaveCount(1);
      await expect(activeTitle(page)).toHaveText("Internal Tools & Web Apps");
    }
  });

  test("captures initial and cycled states across responsive viewports", async ({ page }, testInfo) => {
    for (const viewport of [
      { name: "desktop", width: 1440, height: 900 },
      { name: "tablet", width: 1024, height: 768 },
      { name: "phone", width: 390, height: 844 },
      { name: "minimum-phone", width: 320, height: 568 },
    ]) {
      await page.goto(standaloneHomepageUrl, { waitUntil: "domcontentloaded" });
      await page.setViewportSize(viewport);
      await page.locator("[data-services-carousel]").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: testInfo.outputPath(`ticket-04-${viewport.name}-before.png`),
        fullPage: false,
      });

      await dispatchPointerGesture(page, -72, 0);
      await page.waitForTimeout(300);
      await page.screenshot({
        path: testInfo.outputPath(`ticket-04-${viewport.name}-after.png`),
        fullPage: false,
      });
      await expect(activeTitle(page)).toHaveText("Workflow Automation");
    }
  });
});
