import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const standaloneHomepageUrl = pathToFileURL(
  resolve(process.cwd(), "homepage-updated.html")
).href;

test.describe("standalone compact responsive homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(standaloneHomepageUrl, { waitUntil: "domcontentloaded" });
  });

  test("opens and contains the mobile sidebar", async ({ page }) => {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 320, height: 568 },
    ]) {
      await page.setViewportSize(viewport);

      const menuButton = page.locator("[data-menu-button]");
      const sidebar = page.locator("[data-mobile-sidebar]");

      await expect(menuButton).toBeVisible();
      await expect(page.locator(".site-header .brand")).toBeHidden();
      await expect(page.locator("[data-navigation]")).toBeHidden();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

      await menuButton.click();
      await expect(menuButton).toHaveAttribute("aria-expanded", "true");
      await expect(sidebar).toHaveAttribute("aria-hidden", "false");
      await expect(page.locator("[data-page-frame]")).toHaveAttribute("inert", "");
      await expect(page.locator("[data-menu-close]")).toBeFocused();
      await page.waitForTimeout(260);

      const openState = await page.evaluate(() => {
        const sidebarRect = document.querySelector("[data-mobile-sidebar]")?.getBoundingClientRect();
        const frameTransform = getComputedStyle(document.querySelector("[data-page-frame]")!).transform;

        return {
          sidebarWidth: sidebarRect?.width ?? 0,
          frameTranslated: frameTransform.includes("224"),
          bodyScrollLocked: getComputedStyle(document.body).overflow === "hidden",
        };
      });

      expect(openState.sidebarWidth).toBe(224);
      expect(openState.frameTranslated).toBe(true);
      expect(openState.bodyScrollLocked).toBe(true);

      for (let index = 0; index < 6; index += 1) {
        await page.keyboard.press("Tab");
        await expect(page.locator("[data-mobile-sidebar]")).toContainText(
          await page.evaluate(() => document.activeElement?.textContent ?? "")
        );
      }

      await page.keyboard.press("Escape");
      await expect(menuButton).toHaveAttribute("aria-expanded", "false");
      await expect(page.locator("[data-page-frame]")).not.toHaveAttribute("inert");
      await expect(menuButton).toBeFocused();

      await menuButton.click();
      await page.mouse.click(viewport.width - 8, viewport.height / 2);
      await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    }
  });

  test("clears mobile navigation state when resized to desktop", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("[data-menu-button]").click();
    await page.setViewportSize({ width: 900, height: 768 });

    await expect(page.locator("[data-menu-button]")).toBeHidden();
    await expect(page.locator("[data-navigation]")).toBeVisible();
    await expect(page.locator("[data-page-frame]")).not.toHaveAttribute("inert");
    await expect(page.locator("[data-page-frame]")).toHaveAttribute("data-menu-open", "false");
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).not.toBe("hidden");

    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator("[data-navigation]")).toBeVisible();
  });

  test("keeps the featured work deck focused and keyboard operable", async ({ page }) => {
    const track = page.locator("[data-work-track]");
    const cards = track.locator(".work-card");

    await expect(cards).toHaveCount(3);
    await expect(page.locator("[data-work-prev], [data-work-next]")).toHaveCount(0);
    await expect(track.locator(".work-card.is-active")).toHaveCount(1);

    for (const viewport of [
      { width: 1440, height: 900, min: 0.4, max: 0.45 },
      { width: 1024, height: 768, min: 0.54, max: 0.6 },
      { width: 390, height: 844, min: 0.81, max: 0.87 },
      { width: 320, height: 568, min: 0.81, max: 0.87 },
    ]) {
      await page.setViewportSize(viewport);

      const deckState = await track.evaluate((trackElement) => {
        const trackRect = trackElement.getBoundingClientRect();
        const active = trackElement.querySelector(".work-card[aria-current='true']")?.getBoundingClientRect();
        const sideCards = [...trackElement.querySelectorAll(".work-card[aria-current='false']")];

        return {
          activeWidthRatio: active ? active.width / trackRect.width : 0,
          sideCards: sideCards.map((card) => ({
            visibleWidth: Math.max(
              0,
              Math.min(card.getBoundingClientRect().right, innerWidth) -
                Math.max(card.getBoundingClientRect().left, 0)
            ),
          })),
          links: [...trackElement.querySelectorAll(".work-card")].map(
            (card) => card.querySelector("a")?.tabIndex
          ),
        };
      });

      expect(deckState.activeWidthRatio).toBeGreaterThanOrEqual(viewport.min);
      expect(deckState.activeWidthRatio).toBeLessThanOrEqual(viewport.max);
      expect(deckState.sideCards).toHaveLength(2);
      expect(deckState.sideCards.every(({ visibleWidth }) => visibleWidth > 0)).toBe(true);
      expect(deckState.links.filter((tabIndex) => tabIndex === 0)).toHaveLength(1);
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await track.focus();
    await page.keyboard.press("ArrowRight");
    await expect(track.locator(".work-card[aria-current='true'] h3")).toHaveText(
      "Hospital OCR Automation Pipeline"
    );
    await page.keyboard.press("ArrowLeft");
    await expect(track.locator(".work-card[aria-current='true'] h3")).toHaveText(
      "Pharmacy Inventory System"
    );

    await cards.nth(1).evaluate((card) => {
      (card as HTMLElement).click();
    });
    await expect(track.locator(".work-card[aria-current='true'] h3")).toHaveText(
      "Hospital OCR Automation Pipeline"
    );

    for (const description of await cards.locator("p").allTextContents()) {
      expect(description.trim().length).toBeGreaterThan(0);
    }
    const descriptionLayout = await cards.locator("p").first().evaluate((element) => {
      const styles = getComputedStyle(element);
      const lineHeight = Number.parseFloat(styles.lineHeight);
      const rect = element.getBoundingClientRect();
      return {
        lineHeight,
        visibleHeight: (element as HTMLElement).offsetHeight,
        transformedHeight: rect.height,
        scrollHeight: element.scrollHeight,
      };
    });
    expect(descriptionLayout.visibleHeight).toBeLessThanOrEqual(descriptionLayout.lineHeight * 2 + 2);
    expect(descriptionLayout.scrollHeight).toBeGreaterThanOrEqual(descriptionLayout.visibleHeight);
    await expect(track.locator(".work-card[aria-current='true'] .work-link")).toContainText("↗");
  });

  test("preserves deck and sidebar outcomes with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });

    await page.locator("[data-work-track]").focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("[data-work-track] .work-card[aria-current='true'] h3"))
      .toHaveText("Hospital OCR Automation Pipeline");

    await page.locator("[data-menu-button]").click();
    await expect(page.locator("[data-menu-button]")).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-menu-button]")).toHaveAttribute("aria-expanded", "false");
  });

  test("captures responsive deck and sidebar checkpoints", async ({ page }, testInfo) => {
    for (const viewport of [
      { name: "desktop", width: 1440, height: 900 },
      { name: "tablet", width: 1024, height: 768 },
      { name: "phone", width: 390, height: 844 },
      { name: "narrow-phone", width: 320, height: 568 },
    ]) {
      await page.setViewportSize(viewport);
      await page.locator("[data-work-carousel]").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: testInfo.outputPath(`featured-work-${viewport.name}-initial.png`),
        fullPage: false,
      });

      await page.locator("[data-work-track]").focus();
      await page.keyboard.press("ArrowRight");
      await page.screenshot({
        path: testInfo.outputPath(`featured-work-${viewport.name}-cycled.png`),
        fullPage: false,
      });

      if (viewport.width < 900) {
        await page.locator("[data-menu-button]").click();
        await page.waitForTimeout(260);
        await page.screenshot({
          path: testInfo.outputPath(`mobile-sidebar-${viewport.name}-open.png`),
          fullPage: false,
        });
        await page.keyboard.press("Escape");
      }
    }
  });
});
