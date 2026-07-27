import { expect, test, type Page } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const standaloneHomepageUrl = pathToFileURL(
  resolve(process.cwd(), "homepage-updated.html")
).href;

const processTabs = (page: Page) =>
  page.locator("[data-process] [role='tab']");

test("Astro preview is available @unconfigured", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/J\. Allekine/);
});

test.describe("standalone How I Work mobile refinement", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(standaloneHomepageUrl, { waitUntil: "domcontentloaded" });
  });

  test("shows the connected four-step control on phones without overflow", async ({ page }) => {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 320, height: 568 },
    ]) {
      await page.setViewportSize(viewport);

      const tabs = processTabs(page);
      await expect(tabs).toHaveCount(4);
      await expect(tabs.nth(0)).toContainText("Discovery");
      await expect(tabs.nth(1)).toContainText("Plan");
      await expect(tabs.nth(2)).toContainText("Build");
      await expect(tabs.nth(3)).toContainText("Launch");

      const layout = await page.locator("[data-process]").evaluate((process) => {
        const nav = process.querySelector("[role='tablist']");
        const iconRects = [...process.querySelectorAll("[role='tab'] .process-tab__icon")]
          .map((icon) => icon.getBoundingClientRect());
        const labelRects = [...process.querySelectorAll("[role='tab'] .process-tab__label")]
          .map((label) => label.getBoundingClientRect());
        const connector = nav ? getComputedStyle(nav, "::before") : null;
        const connectorY = nav && connector
          ? nav.getBoundingClientRect().top + Number.parseFloat(connector.top)
          : Number.NaN;

        return {
          iconSizes: iconRects.map((rect) => [rect.width, rect.height]),
          labelsBelowIcons: labelRects.every((label, index) => label.top >= iconRects[index].bottom),
          connectorThroughCenters: iconRects.every(
            (rect) => Math.abs(rect.top + rect.height / 2 - connectorY) < 1
          ),
          connectorVisible: connector?.display !== "none",
          noOverflow: document.documentElement.scrollWidth <= window.innerWidth,
        };
      });

      expect(layout.iconSizes).toHaveLength(4);
      expect(layout.iconSizes.every(([width, height]) => width >= 44 && height >= 44)).toBe(true);
      expect(layout.labelsBelowIcons).toBe(true);
      expect(layout.connectorThroughCenters).toBe(true);
      expect(layout.connectorVisible).toBe(true);
      expect(layout.noOverflow).toBe(true);
    }
  });

  test("keeps the restored presentation at and above 720px", async ({ page }) => {
    for (const width of [720, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });

      const desktopState = await page.locator("[data-process]").evaluate((process) => {
        const tab = process.querySelector("[role='tab']");
        const nav = process.querySelector("[role='tablist']");
        const dot = tab?.querySelector(".process-tab__dot");
        const icon = tab?.querySelector(".process-tab__icon")?.getBoundingClientRect();
        const dotRect = dot?.getBoundingClientRect();

        return {
          iconVisible: Boolean(tab?.querySelector("svg")),
          iconSize: icon ? [icon.width, icon.height] : [0, 0],
          dotVisible: dot ? getComputedStyle(dot).display !== "none" : false,
          dotSize: dotRect ? [dotRect.width, dotRect.height] : [0, 0],
          connectorVisible: nav
            ? getComputedStyle(nav, "::before").display !== "none"
            : false,
        };
      });

      expect(desktopState.iconVisible).toBe(true);
      expect(desktopState.iconSize).toEqual([34, 34]);
      expect(desktopState.dotVisible).toBe(true);
      expect(desktopState.dotSize.every((size) => size >= 13 && size <= 16)).toBe(true);
      expect(desktopState.connectorVisible).toBe(true);
    }
  });

  test("preserves selection, panel association, and keyboard navigation", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const tabs = processTabs(page);
    const panel = page.getByRole("tabpanel");
    const discovery = tabs.nth(0);
    const plan = tabs.nth(1);
    const build = tabs.nth(2);
    const launch = tabs.nth(3);

    await expect(discovery).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("[data-process-title]")).toHaveText("Discovery");
    await expect(panel).toHaveAttribute("aria-labelledby", "process-tab-discovery");

    await plan.click();
    await expect(plan).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("[data-process-title]")).toHaveText("Plan");
    await expect(page.locator("[data-process-description]")).toContainText("roadmap");
    await expect(panel).toHaveAttribute("aria-labelledby", "process-tab-plan");

    await build.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(plan).toHaveAttribute("aria-selected", "true");
    await expect(plan).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await expect(build).toHaveAttribute("aria-selected", "true");
    await expect(build).toBeFocused();

    await page.keyboard.press("Home");
    await expect(discovery).toHaveAttribute("aria-selected", "true");
    await expect(discovery).toBeFocused();

    await page.keyboard.press("End");
    await expect(launch).toHaveAttribute("aria-selected", "true");
    await expect(launch).toBeFocused();

    await page.emulateMedia({ reducedMotion: "reduce" });
    await plan.click();
    await expect(page.locator("[data-process-title]")).toHaveText("Plan");
  });

  test("captures the required visual checkpoints", async ({ page }, testInfo) => {
    for (const viewport of [
      { name: "desktop", width: 1440, height: 900 },
      { name: "tablet", width: 1024, height: 768 },
      { name: "phone", width: 390, height: 844 },
      { name: "narrow-phone", width: 320, height: 568 },
    ]) {
      await page.setViewportSize(viewport);
      await page.locator("#process").scrollIntoViewIfNeeded();
      await expect(page.locator("#process")).toBeVisible();
      await page.screenshot({
        path: testInfo.outputPath(`how-i-work-${viewport.name}.png`),
        fullPage: false,
      });
    }
  });

  test("uses the outlined speech bubble only for Discovery", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const tabs = processTabs(page);
    await expect(tabs.nth(0).locator("svg path")).toHaveCount(1);
    await expect(tabs.nth(0).locator("svg circle")).toHaveCount(0);
    await expect(tabs.nth(1).locator("svg circle")).toHaveCount(4);
    await expect(tabs.nth(2).locator("svg rect")).toHaveCount(4);
    await expect(tabs.nth(3).locator("svg path")).toHaveCount(2);
  });
});
