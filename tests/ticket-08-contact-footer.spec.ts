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
  { name: "narrow-phone", width: 320, height: 568 },
];

test.describe("standalone homepage contact and footer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(standaloneHomepageUrl, { waitUntil: "domcontentloaded" });
  });

  test("keeps Contact responsive and the ellipse behind its content", async ({ page }) => {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      const contact = page.locator("#contact");
      const button = contact.getByRole("link", { name: /Contact me/i });
      const layout = await button.locator("..").evaluate((card) => {
        const copy = card.firstElementChild!.getBoundingClientRect();
        const button = card.querySelector<HTMLElement>("a")!.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();

        return {
          card: {
            left: cardRect.left,
            right: cardRect.right,
            width: cardRect.width,
            height: cardRect.height,
          },
          copy,
          button,
          noOverflow: document.documentElement.scrollWidth <= innerWidth,
        };
      });

      expect(layout.noOverflow, viewport.name).toBe(true);
      await expect(contact).toBeVisible();
      expect(layout.button.bottom, viewport.name).toBeLessThanOrEqual(
        layout.card.height + layout.copy.top + 2
      );

      if (viewport.width < 721) {
        expect(layout.button.width, viewport.name).toBeGreaterThan(layout.card.width * 0.8);
        expect(layout.button.left, viewport.name).toBeGreaterThan(layout.card.left);
        expect(layout.button.right, viewport.name).toBeLessThan(layout.card.right);
        expect(layout.button.top, viewport.name).toBeGreaterThan(layout.copy.bottom);
      } else {
        expect(layout.copy.right, viewport.name).toBeLessThan(layout.button.left);
      }
    }
  });

  test("keeps the footer in one row at the minimum width and returns to top", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    const footer = page.locator("footer");
    const footerInner = footer.locator("div").first();
    const row = await footerInner.evaluate((inner) => {
      const children = [...inner.children].map((child) => child.getBoundingClientRect());
      return {
        tops: children.map((child) => child.top),
        contained: children.every((child) => child.left >= inner.getBoundingClientRect().left && child.right <= inner.getBoundingClientRect().right),
        separated: children.every((child, index) => index === 0 || child.left >= children[index - 1].right),
        noOverflow: document.documentElement.scrollWidth <= innerWidth,
      };
    });

    expect(row.noOverflow).toBe(true);
    expect(row.contained).toBe(true);
    expect(row.separated).toBe(true);
    expect(new Set(row.tops.map((top) => Math.round(top))).size).toBe(1);
    const backToTop = footer.getByRole("link", { name: /Back to top/ });

    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
    });
    await backToTop.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(4);
  });

  test("keeps the complete homepage usable through resize and rotation", async ({ page }, testInfo) => {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.locator("#contact").scrollIntoViewIfNeeded();

      await expect(page.locator("#contact").getByRole("link", { name: /Contact me/i })).toBeVisible();
      await expect(page.getByRole("link", { name: /Back to top/ })).toBeVisible();
      await expect(page.locator("[data-process] [role='tab']")).toHaveCount(4);
      await expect(page.locator("[data-work-track] .work-card.is-active")).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

      await page.screenshot({
        path: testInfo.outputPath(`homepage-${viewport.name}-full.png`),
        fullPage: true,
      });
    }

    await page.setViewportSize({ width: 390, height: 844 });
    const menuButton = page.locator("[data-menu-button]");
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator("[data-navigation]")).toBeHidden();
    await expect(menuButton).toBeVisible();
    await page.keyboard.press("Escape");

    await page.setViewportSize({ width: 844, height: 390 });
    await expect(page.locator("#contact").getByRole("link", { name: /Contact me/i })).toBeVisible();
    await expect(page.locator("[data-process] [role='tab']")).toHaveCount(4);
    await expect(page.locator("[data-work-track] .work-card.is-active")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
});
