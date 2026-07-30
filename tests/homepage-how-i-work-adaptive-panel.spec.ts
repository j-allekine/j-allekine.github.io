import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const homepageUrl = pathToFileURL(resolve(process.cwd(), "homepage-updated.html")).href;

test.describe("homepage adaptive How I Work panel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(homepageUrl, { waitUntil: "domcontentloaded" });
  });

  test("uses a centered reading width and natural unclipped height", async ({ page }) => {
    const panel = page.locator("#process-panel");

    for (const expectation of [
      { width: 320, maxWidth: 284 },
      { width: 768, maxWidth: 640 },
      { width: 1440, maxWidth: 640 },
    ]) {
      await page.setViewportSize({ width: expectation.width, height: 900 });
      const dimensions = await panel.evaluate((element) => ({
        width: element.getBoundingClientRect().width,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
      }));

      expect(dimensions.width).toBeLessThanOrEqual(expectation.maxWidth);
      expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.clientHeight + 1);
    }
  });

  test("supports pointer and complete keyboard selection with visible focus", async ({ page }) => {
    const panel = page.locator("#process-panel");
    const tabs = page.locator("[data-process-step]");

    await tabs.nth(1).click();
    await expect(panel.locator("[data-process-title]")).toHaveText("Plan");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");

    await tabs.nth(1).focus();
    await tabs.nth(1).press("End");
    await expect(tabs.nth(3)).toBeFocused();
    await expect(panel).toHaveAttribute("aria-labelledby", "process-tab-launch");

    await tabs.nth(3).press("Home");
    await expect(tabs.nth(0)).toBeFocused();
    await expect(tabs.nth(0)).toHaveCSS("outline-style", "solid");
  });

  test("animates height for 180ms and updates immediately with reduced motion", async ({
    page,
  }) => {
    const panel = page.locator("#process-panel");
    const plan = page.locator("[data-process-step='plan']");

    await plan.click();
    const animation = await panel.evaluate((element) => {
      const active = element.getAnimations()[0];
      return active
        ? {
            duration: Number(active.effect?.getTiming().duration),
            overflow: getComputedStyle(element).overflow,
          }
        : null;
    });
    expect(animation?.duration).toBe(180);
    expect(animation?.overflow).toBe("hidden");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.locator("[data-process-step='build']").click();
    await expect(panel.locator("[data-process-title]")).toHaveText("Build");
    expect(await panel.evaluate((element) => element.getAnimations().length)).toBe(0);
  });
});
