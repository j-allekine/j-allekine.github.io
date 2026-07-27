import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const standaloneHomepageUrl = pathToFileURL(
  resolve(process.cwd(), "homepage-updated.html")
).href;

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "phone", width: 390, height: 844 },
  { name: "minimum-phone", width: 320, height: 568 },
];

const heroSection = 'section[aria-labelledby="hero-title"]';

test.describe("ticket 07 responsive Hero", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(standaloneHomepageUrl, { waitUntil: "domcontentloaded" });
  });

  test("keeps approved Hero content, links, and portrait description intact", async ({ page }) => {
    await expect(page.getByText("Systems & Automation Developer", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Jihm Allekine Almedilla" })).toBeVisible();
    await expect(page.locator(`${heroSection} p`).nth(1)).toHaveText(
      "I build spreadsheet systems, workflow automations, data tools, and practical software that turn manual processes into clearer, more reliable operations. I enjoy mapping workflows, understanding the details, and building useful tools that people can rely on."
    );
    await expect(page.getByRole("img", { name: "Temporary portrait area for Jihm Allekine Almedilla" })).toHaveAttribute(
      "aria-label",
      "Temporary portrait area for Jihm Allekine Almedilla"
    );

    await expect(page.getByRole("link", { name: /Book a 30-minute call/ })).toHaveAttribute(
      "href",
      "#contact"
    );
    await expect(page.getByRole("link", { name: /View Work/ })).toHaveAttribute("href", "#work");

    await expect(page.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/j-allekine"
    );
    await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "#");
    await expect(page.getByRole("link", { name: "Instagram" })).toHaveAttribute("href", "#");
    await expect(page.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:hello@example.com"
    );
  });

  test("puts a contained, wide portrait before the role label on phones", async ({ page }) => {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      const layout = await page.evaluate(() => {
        const hero = document.querySelector<HTMLElement>(`section[aria-labelledby="hero-title"]`)!;
        const portrait = hero.querySelector<HTMLElement>("[role=img]")!.parentElement!;
        const label = hero.querySelector<HTMLElement>("p")!;
        const actions = [...hero.querySelectorAll<HTMLElement>('a[href="#contact"], a[href="#work"]')];
        const heroRect = hero.getBoundingClientRect();
        const portraitRect = portrait.getBoundingClientRect();

        return {
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          heroRect: { left: heroRect.left, right: heroRect.right },
          portraitRect: {
            left: portraitRect.left,
            right: portraitRect.right,
            width: portraitRect.width,
            top: portraitRect.top,
          },
          labelTop: label.getBoundingClientRect().top,
          actionHeights: actions.map((action) => action.getBoundingClientRect().height),
        };
      });

      expect(layout.documentWidth, viewport.name).toBeLessThanOrEqual(layout.viewportWidth);
      expect(layout.heroRect.left, viewport.name).toBeGreaterThanOrEqual(0);
      expect(layout.heroRect.right, viewport.name).toBeLessThanOrEqual(layout.viewportWidth);

      if (viewport.width <= 720) {
        const availableWidth = viewport.width - 36;
        expect(layout.portraitRect.top, viewport.name).toBeLessThan(layout.labelTop);
        expect(layout.portraitRect.width, viewport.name).toBeLessThanOrEqual(340);
        expect(layout.portraitRect.width, viewport.name).toBeGreaterThanOrEqual(
          Math.min(availableWidth, 340) * 0.9
        );
        expect(layout.portraitRect.left, viewport.name).toBeGreaterThanOrEqual(18);
        expect(layout.portraitRect.right, viewport.name).toBeLessThanOrEqual(viewport.width - 18);
      }

      expect(layout.actionHeights, viewport.name).toEqual(
        expect.arrayContaining([expect.any(Number)])
      );
      expect(layout.actionHeights.every((height) => height >= 44), viewport.name).toBe(true);
    }
  });

  test("retains visible keyboard focus for both Hero actions", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });

    for (const action of await page.locator(`${heroSection} a[href="#contact"], ${heroSection} a[href="#work"]`).all()) {
      await action.focus();
      await expect(action).toBeFocused();
      const box = await action.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("captures the Hero at representative responsive viewports", async ({ page }, testInfo) => {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.locator(heroSection).scrollIntoViewIfNeeded();
      await page.screenshot({
        path: testInfo.outputPath(`ticket-07-hero-${viewport.name}.png`),
        fullPage: false,
      });
    }
  });
});
