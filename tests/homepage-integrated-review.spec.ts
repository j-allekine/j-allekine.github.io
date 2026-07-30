import { expect, test, type Page } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const standaloneHomepageUrl = pathToFileURL(
  resolve(process.cwd(), "homepage-updated.html")
).href;

const reviewViewports = [
  { name: "minimum-phone", width: 320, height: 568 },
  { name: "tablet", width: 768, height: 900 },
  { name: "compact-wide", width: 1279, height: 768 },
  { name: "desktop-threshold", width: 1280, height: 900 },
  { name: "desktop", width: 1440, height: 900 },
];

const sectionOrder = ["hero", "work", "stack", "process", "about", "contact"];

const openNavigation = async (page: Page) => {
  await page.setViewportSize({ width: 768, height: 900 });
  const menuButton = page.locator("[data-menu-button]");
  await menuButton.focus();
  await menuButton.click();
  await expect(page.locator("[data-mobile-sidebar]")).toHaveAttribute("aria-hidden", "false");
  return menuButton;
};

test.describe("homepage integrated responsive and accessibility review", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(standaloneHomepageUrl, { waitUntil: "domcontentloaded" });
  });

  test("covers the approved shell widths without overflow or broken flow", async ({ page }, testInfo) => {
    for (const viewport of reviewViewports) {
      await page.setViewportSize(viewport);

      const shell = await page.locator("main > section").evaluateAll((sections) => {
        const rects = sections.map((section) => {
          const rect = section.getBoundingClientRect();
          return { id: section.id, top: rect.top + window.scrollY, right: rect.right };
        });

        return {
          ids: rects.map(({ id }) => id),
          ordered: rects.every((rect, index) => index === 0 || rect.top >= rects[index - 1].top),
          contained: rects.every(({ right }) => right <= window.innerWidth + 1),
          noOverflow: document.documentElement.scrollWidth <= window.innerWidth,
        };
      });

      expect(shell.ids, viewport.name).toEqual(sectionOrder);
      expect(shell.ordered, viewport.name).toBe(true);
      expect(shell.contained, viewport.name).toBe(true);
      expect(shell.noOverflow, viewport.name).toBe(true);

      if (viewport.width >= 1280) {
        await expect(page.locator("[data-desktop-sidebar]")).toBeVisible();
        await expect(page.locator("[data-mobile-sidebar]")).toBeHidden();
        await expect(page.locator("[data-desktop-sidebar]")).toHaveCSS("position", "fixed");
      } else {
        await expect(page.locator("[data-desktop-sidebar]")).toBeHidden();
        await expect(page.locator("[data-menu-button]")).toBeVisible();
      }

      await page.screenshot({
        path: testInfo.outputPath(`homepage-review-${viewport.name}.png`),
        fullPage: true,
      });
    }
  });

  test("keeps editorial sections within the approved reading width", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    for (const selector of ["#stack > .reading-shell", "#process > .reading-shell", "#about > .reading-shell", "#contact > .reading-shell"]) {
      const width = await page.locator(selector).evaluate((element) => element.getBoundingClientRect().width);
      expect(width, selector).toBeLessThanOrEqual(768);
    }
  });

  test("highlights the visible navigation destination across the continuous page flow", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const activeNavigation = () =>
      page.locator("[data-section-nav][aria-current='location']");

    await expect(activeNavigation()).toHaveCount(3);
    await expect(activeNavigation().first()).toHaveAttribute("href", "#top");

    for (const target of ["work", "stack", "contact"]) {
      await page.evaluate((sectionId) => {
        document.documentElement.style.scrollBehavior = "auto";
        document.getElementById(sectionId)?.scrollIntoView({ block: "start" });
      }, target);
      await expect
        .poll(() => activeNavigation().first().getAttribute("href"))
        .toBe(`#${target}`);
    }
  });

  test("keeps the responsive navigation surface contained and recoverable", async ({ page }) => {
    const menuButton = await openNavigation(page);
    const drawer = page.locator("[data-mobile-sidebar]");
    const pageFrame = page.locator("[data-page-frame]");

    await expect(pageFrame).toHaveAttribute("inert", "");
    await expect(pageFrame).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("body")).toHaveCSS("position", "fixed");
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
    await expect(drawer.locator("[data-menu-close]")).toBeFocused();

    const focusableItems = drawer.locator("a[href], button:not([disabled])");
    await focusableItems.first().focus();
    await page.keyboard.press("Shift+Tab");
    await expect(focusableItems.last()).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(focusableItems.first()).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(drawer).toHaveAttribute("aria-hidden", "true");
    await expect(menuButton).toBeFocused();
    await expect(pageFrame).not.toHaveAttribute("inert");

    await menuButton.click();
    await drawer.locator("[data-menu-close]").click();
    await expect(drawer).toHaveAttribute("aria-hidden", "true");
    await expect(menuButton).toBeFocused();
  });

  test("restores scroll after backdrop close and moves to a selected section", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    const menuButton = page.locator("[data-menu-button]");
    const drawer = page.locator("[data-mobile-sidebar]");
    const backdrop = page.locator("[data-sidebar-backdrop]");

    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 900);
    });
    const scrollBeforeOpen = await page.evaluate(() => window.scrollY);
    await menuButton.click();
    await expect(drawer).toHaveAttribute("aria-hidden", "false");
    await backdrop.click({ position: { x: 300, y: 4 } });
    await expect(drawer).toHaveAttribute("aria-hidden", "true");
    await expect(menuButton).toBeFocused();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrollBeforeOpen);

    await menuButton.click();
    await drawer.getByRole("link", { name: "Work", exact: true }).click();
    await expect(drawer).toHaveAttribute("aria-hidden", "true");
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("#work");
    await expect(page.locator("#work")).toBeInViewport();
  });

  test("closes safely when the compact breakpoint changes", async ({ page }) => {
    await openNavigation(page);
    const menuButton = page.locator("[data-menu-button]");

    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(page.locator("[data-mobile-sidebar]")).toHaveAttribute("aria-hidden", "true");
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("[data-page-frame]")).not.toHaveAttribute("inert");
    await expect(menuButton).not.toBeFocused();
  });

  test("keeps labels, heading structure, focus visibility, and reduced motion usable", async ({ page }) => {
    const unlabeledControls = await page.locator("a, button").evaluateAll((elements) =>
      elements
        .filter((element) => !element.getAttribute("aria-label") && !element.textContent?.trim())
        .map((element) => element.outerHTML)
    );
    expect(unlabeledControls).toEqual([]);

    const headingLevels = await page.locator("h1, h2, h3").evaluateAll((headings) =>
      headings.map((heading) => Number(heading.tagName.slice(1)))
    );
    expect(headingLevels[0]).toBe(1);
    expect(headingLevels.slice(1).every((level, index) => index === 0 || level <= headingLevels[index] + 1)).toBe(true);

    await page.setViewportSize({ width: 768, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => page.locator("[data-sidebar-backdrop]").evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).transitionDuration)
      ))
      .toBeLessThan(0.1);

    await page.locator("[data-menu-button]").focus();
    await expect(page.locator("[data-menu-button]")).toBeFocused();
  });
});
