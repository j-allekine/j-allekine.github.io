import { expect, test } from "@playwright/test";

test.describe("production How I Work adaptive panel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#process").scrollIntoViewIfNeeded();
  });

  test("centers the panel at reading width and adapts to its description", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const panel = page.getByRole("tabpanel");
    const plan = page.getByRole("tab", { name: "Plan" });
    const launch = page.getByRole("tab", { name: "Launch" });

    const desktopBox = await panel.boundingBox();
    const processBox = await page.locator("[data-process]").boundingBox();
    expect(desktopBox).not.toBeNull();
    expect(processBox).not.toBeNull();
    expect(desktopBox!.width).toBeLessThanOrEqual(640.5);
    expect(Math.abs(
      desktopBox!.x + desktopBox!.width / 2
      - (processBox!.x + processBox!.width / 2),
    )).toBeLessThanOrEqual(1);

    await plan.click();
    await panel.evaluate((element) => element.getAnimations().forEach((animation) => animation.finish()));
    const planHeight = (await panel.boundingBox())!.height;

    await launch.click();
    await panel.evaluate((element) => element.getAnimations().forEach((animation) => animation.finish()));
    const launchHeight = (await panel.boundingBox())!.height;

    expect(planHeight).toBeGreaterThan(launchHeight);
  });

  test("uses the available width without overflow on a narrow phone", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });

    const panel = page.getByRole("tabpanel");
    const process = page.locator("[data-process]");
    const panelBox = await panel.boundingBox();
    const processBox = await process.boundingBox();

    expect(panelBox).not.toBeNull();
    expect(processBox).not.toBeNull();
    expect(Math.abs(panelBox!.width - processBox!.width)).toBeLessThanOrEqual(1);
    expect(panelBox!.x).toBeGreaterThanOrEqual(0);
    expect(panelBox!.x + panelBox!.width).toBeLessThanOrEqual(320);
    await expect(page.getByRole("tab")).toHaveCount(4);
  });

  test("keeps immediate keyboard selection and honors reduced motion", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });

    const discovery = page.getByRole("tab", { name: "Discovery" });
    const plan = page.getByRole("tab", { name: "Plan" });

    await discovery.focus();
    await page.keyboard.press("ArrowRight");

    await expect(plan).toBeFocused();
    await expect(plan).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", "process-tab-plan");
    expect(await page.getByRole("tabpanel").evaluate((element) => element.getAnimations().length)).toBe(0);
  });
});
