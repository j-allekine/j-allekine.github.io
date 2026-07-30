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

test.describe("standalone How I Work Process tabs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(standaloneHomepageUrl, { waitUntil: "domcontentloaded" });
  });

  test("shows four labeled circular controls without overflow", async ({ page }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 1024, height: 768 },
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
        const processRect = process.getBoundingClientRect();
        const tabs = [...process.querySelectorAll("[role='tab']")];
        const iconRects = [...process.querySelectorAll("[role='tab'] .process-tab__icon")]
          .map((icon) => icon.getBoundingClientRect());
        const labelRects = [...process.querySelectorAll("[role='tab'] .process-tab__label")]
          .map((label) => label.getBoundingClientRect());
        const connector = nav ? getComputedStyle(nav, "::before") : null;

        return {
          iconSizes: iconRects.map((rect) => [rect.width, rect.height]),
          labelsBelowIcons: labelRects.every((label, index) => label.top >= iconRects[index].bottom),
          circles: [...process.querySelectorAll("[role='tab'] .process-tab__icon")]
            .every((icon) => getComputedStyle(icon).borderRadius === "50%"),
          controlsContained: tabs.every((tab) => {
            const rect = tab.getBoundingClientRect();
            return rect.left >= processRect.left && rect.right <= processRect.right;
          }),
          connectorVisible: connector?.display !== "none",
          noOverflow: document.documentElement.scrollWidth <= window.innerWidth,
        };
      });

      expect(layout.iconSizes).toHaveLength(4);
      expect(layout.iconSizes.every(([width, height]) => width >= 48 && height >= 48)).toBe(true);
      expect(layout.labelsBelowIcons).toBe(true);
      expect(layout.circles).toBe(true);
      expect(layout.controlsContained).toBe(true);
      expect(layout.connectorVisible).toBe(true);
      expect(layout.noOverflow).toBe(true);
    }
  });

  test("exposes tab semantics and preserves selection in one shared panel", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const tabs = processTabs(page);
    const tablist = page.getByRole("tablist");
    const panel = page.getByRole("tabpanel");
    const discovery = tabs.nth(0);
    const plan = tabs.nth(1);
    const build = tabs.nth(2);
    const launch = tabs.nth(3);

    await expect(tablist).toHaveAttribute("aria-orientation", "horizontal");
    await expect(discovery).toHaveAttribute("aria-selected", "true");
    await expect(discovery).toHaveAttribute("tabindex", "0");
    await expect(plan).toHaveAttribute("tabindex", "-1");
    await expect(discovery).toHaveAttribute("aria-controls", "process-panel");
    await expect(page.locator("[data-process-title]")).toHaveText("Discovery");
    await expect(panel).toHaveAttribute("aria-labelledby", "process-tab-discovery");

    await plan.click();
    await expect(plan).toHaveAttribute("aria-selected", "true");
    await expect(plan.locator(".process-tab__icon")).toHaveCSS(
      "background-color",
      "rgb(245, 245, 247)"
    );
    await expect(plan.locator(".process-tab__icon")).toHaveCSS("border-radius", "50%");
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

    await page.keyboard.press("ArrowRight");
    await expect(launch).toHaveAttribute("aria-selected", "true");
    await expect(launch).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await expect(discovery).toHaveAttribute("aria-selected", "true");
    await expect(discovery).toBeFocused();

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

  test("supports pointer and touch selection", async ({ page, browser }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await processTabs(page).nth(2).click();
    await expect(page.locator("[data-process-title]")).toHaveText("Build");
    await expect(processTabs(page).nth(2)).toHaveAttribute("aria-selected", "true");

    const touchContext = await browser.newContext({
      hasTouch: true,
      isMobile: true,
      viewport: { width: 390, height: 844 },
    });
    const touchPage = await touchContext.newPage();

    try {
      await touchPage.goto(standaloneHomepageUrl, { waitUntil: "domcontentloaded" });
      await touchPage.locator("[data-process] [role='tab']").nth(3).tap();
      await expect(touchPage.locator("[data-process-title]")).toHaveText("Launch");
      await expect(touchPage.locator("[data-process] [role='tab']").nth(3))
        .toHaveAttribute("aria-selected", "true");
    } finally {
      await touchContext.close();
    }
  });

  test("adapts the shared panel height and honors reduced motion", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });

    const process = page.locator("[data-process]");
    const heights = [];

    for (const tab of await processTabs(page).all()) {
      await tab.click();
      heights.push(await process.locator("[role='tabpanel']").evaluate((panel) => panel.getBoundingClientRect().height));
    }

    expect(new Set(heights.map((height) => Math.round(height))).size).toBeGreaterThan(1);

    await page.emulateMedia({ reducedMotion: "reduce" });
    const transitionDuration = await process.locator(".process-tab__icon").first().evaluate(
      (icon) => Number.parseFloat(getComputedStyle(icon).transitionDuration)
    );
    expect(transitionDuration).toBeLessThanOrEqual(0.01);

    await processTabs(page).nth(1).click();
    await expect(page.locator("[data-process-title]")).toHaveText("Plan");
    const panelState = await process.locator("[role='tabpanel']").evaluate((panel) => ({
      animations: panel.getAnimations().length,
      clientHeight: panel.clientHeight,
      scrollHeight: panel.scrollHeight,
    }));
    expect(panelState.animations).toBe(0);
    expect(panelState.scrollHeight).toBeLessThanOrEqual(panelState.clientHeight + 1);
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

  test("uses the lighter Lucide line icons for each process step", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const tabs = processTabs(page);
    await expect(tabs.nth(0).locator("svg")).toHaveAttribute("viewBox", "0 0 24 24");
    await expect(tabs.nth(0).locator("svg path")).toHaveCount(1);
    await expect(tabs.nth(0).locator("svg circle")).toHaveCount(0);
    await expect(tabs.nth(1).locator("svg path")).toHaveCount(1);
    await expect(tabs.nth(1).locator("svg circle")).toHaveCount(2);
    await expect(tabs.nth(2).locator("svg rect")).toHaveCount(4);
    await expect(tabs.nth(3).locator("svg path")).toHaveCount(4);

    await expect(tabs.nth(0).locator("svg")).toHaveCSS("stroke-width", "1.5px");
  });
});
