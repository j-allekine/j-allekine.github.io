import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const homepageUrl = pathToFileURL(resolve(process.cwd(), "homepage-updated.html")).href;

test.describe("issue #13 homepage Hero workflow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(homepageUrl, { waitUntil: "domcontentloaded" });
  });

  test("presents the approved identity, copy, and action destinations", async ({ page }) => {
    const hero = page.locator("#hero");
    const heading = hero.getByRole("heading", { level: 1 });
    const actions = hero.locator(".hero-actions a");

    await expect(heading).toHaveText(/JIHM ALLEKINE\s+ALMEDILLA/);
    await expect(hero.locator(".hero-statement")).toHaveText("I am an automation specialist.");
    await expect(hero.locator(".hero-copy")).toHaveCount(2);
    await expect(actions).toHaveCount(2);
    await expect(actions.nth(0)).toHaveText("View selected work ↓");
    await expect(actions.nth(0)).toHaveAttribute("href", "#work");
    await expect(actions.nth(1)).toHaveText("Contact me ↗");
    await expect(actions.nth(1)).toHaveAttribute("href", "/contact");
    await expect(hero.getByText("Book a 30-minute call")).toHaveCount(0);
    await expect(hero.locator(".hero-socials")).toHaveCount(0);

    await actions.nth(0).click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.locator("#work")).toBeInViewport();
  });

  test("keeps actions full-width at 320px and compact at wider widths", async ({ page }) => {
    const hero = page.locator("#hero");
    const actions = hero.locator(".hero-actions a");

    await page.setViewportSize({ width: 320, height: 700 });
    const mobileHeroBox = await hero.boundingBox();
    const mobilePrimaryBox = await actions.nth(0).boundingBox();
    const mobileSecondaryBox = await actions.nth(1).boundingBox();

    expect(mobileHeroBox).not.toBeNull();
    expect(mobilePrimaryBox).not.toBeNull();
    expect(mobileSecondaryBox).not.toBeNull();
    expect(mobilePrimaryBox!.width).toBeGreaterThanOrEqual(mobileHeroBox!.width - 2);
    expect(mobileSecondaryBox!.width).toBeGreaterThanOrEqual(mobileHeroBox!.width - 2);
    expect(mobilePrimaryBox!.height).toBeGreaterThanOrEqual(44);
    expect(mobileSecondaryBox!.height).toBeGreaterThanOrEqual(44);
    expect(mobileSecondaryBox!.y).toBeGreaterThan(mobilePrimaryBox!.y + mobilePrimaryBox!.height);

    await page.setViewportSize({ width: 768, height: 900 });
    const widePrimaryBox = await actions.nth(0).boundingBox();
    const wideSecondaryBox = await actions.nth(1).boundingBox();

    expect(widePrimaryBox).not.toBeNull();
    expect(wideSecondaryBox).not.toBeNull();
    expect(widePrimaryBox!.width).toBeLessThan(300);
    expect(wideSecondaryBox!.width).toBeLessThan(300);
    expect(Math.abs(widePrimaryBox!.y - wideSecondaryBox!.y)).toBeLessThan(2);
    await expect(page.locator("html")).toHaveJSProperty("scrollWidth", 768);
  });
});
