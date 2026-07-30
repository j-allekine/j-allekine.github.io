import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const homepageUrl = pathToFileURL(resolve(process.cwd(), "homepage-updated.html")).href;

test.describe("issue #14 responsive Hero portrait composition", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(homepageUrl, { waitUntil: "domcontentloaded" });
  });

  test("keeps the placeholder decorative and portrait-first below 1280px", async ({ page }) => {
    const portrait = page.locator("#hero .hero-portrait");
    await expect(portrait).toHaveAttribute("aria-hidden", "true");
    await expect(portrait).not.toHaveAttribute("role");
    await expect(portrait).not.toHaveAttribute("aria-label");

    for (const viewport of [
      { width: 320, height: 700 },
      { width: 768, height: 900 },
      { width: 1279, height: 900 },
    ]) {
      await page.setViewportSize(viewport);

      const portraitBox = await portrait.boundingBox();
      const introBox = await page.locator("#hero .hero-intro").boundingBox();
      const detailsBox = await page.locator("#hero .hero-details").boundingBox();
      expect(portraitBox).not.toBeNull();
      expect(introBox).not.toBeNull();
      expect(detailsBox).not.toBeNull();
      expect(introBox!.y - (portraitBox!.y + portraitBox!.height)).toBeGreaterThanOrEqual(20);
      expect(detailsBox!.y - (introBox!.y + introBox!.height)).toBeGreaterThanOrEqual(20);
      expect(portraitBox!.height).toBeGreaterThan(portraitBox!.width);
      expect(portraitBox!.height / portraitBox!.width).toBeLessThanOrEqual(1.3);
      await expect(page.locator("html")).toHaveJSProperty("scrollWidth", viewport.width);
    }
  });

  test("uses the compact portrait-left composition from 1280px", async ({ page }) => {
    for (const viewport of [
      { width: 1280, height: 900 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);

      const hero = page.locator("#hero");
      const portraitBox = await hero.locator(".hero-portrait").boundingBox();
      const introBox = await hero.locator(".hero-intro").boundingBox();
      const detailsBox = await hero.locator(".hero-details").boundingBox();
      const heroBox = await hero.boundingBox();
      const actions = hero.locator(".hero-actions a");
      const primaryBox = await actions.nth(0).boundingBox();
      const secondaryBox = await actions.nth(1).boundingBox();

      expect(portraitBox).not.toBeNull();
      expect(introBox).not.toBeNull();
      expect(detailsBox).not.toBeNull();
      expect(heroBox).not.toBeNull();
      expect(primaryBox).not.toBeNull();
      expect(secondaryBox).not.toBeNull();
      expect(introBox!.x - (portraitBox!.x + portraitBox!.width)).toBeGreaterThanOrEqual(32);
      expect(detailsBox!.x - (portraitBox!.x + portraitBox!.width)).toBeGreaterThanOrEqual(32);
      expect(detailsBox!.y - (introBox!.y + introBox!.height)).toBeGreaterThanOrEqual(16);
      expect(Math.abs(portraitBox!.width / portraitBox!.height - 1)).toBeLessThanOrEqual(0.12);
      expect(portraitBox!.width).toBeGreaterThanOrEqual(250);
      expect(portraitBox!.width).toBeLessThanOrEqual(288);
      expect(heroBox!.width).toBeLessThanOrEqual(760);
      expect(heroBox!.height).toBeLessThanOrEqual(620);
      expect(primaryBox!.width).toBeLessThan(300);
      expect(secondaryBox!.width).toBeLessThan(300);
      expect(Math.abs(primaryBox!.y - secondaryBox!.y)).toBeLessThan(2);
      await expect(page.locator("html")).toHaveJSProperty("scrollWidth", viewport.width);
    }
  });
});
