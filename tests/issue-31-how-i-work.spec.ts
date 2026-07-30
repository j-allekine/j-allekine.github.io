import { expect, test, type Page } from "@playwright/test";

const processTabs = (page: Page) =>
  page.locator("#process [role='tab']");

test.describe("issue #31 How I Work interaction", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("exposes one shared panel through an accessible horizontal tab set", async ({
    page,
  }) => {
    const tablist = page.getByRole("tablist", {
      name: "Four-step working process",
    });
    const panel = page.getByRole("tabpanel");
    const tabs = processTabs(page);

    await expect(tablist).toHaveAttribute("aria-orientation", "horizontal");
    await expect(tabs).toHaveCount(4);
    await expect(tabs).toHaveText(["Discovery", "Plan", "Build", "Launch"]);
    expect(
      await tabs.evaluateAll((items) =>
        items.filter((item) => item.getAttribute("aria-selected") === "true").length
      )
    ).toBe(1);
    expect(
      await tabs.evaluateAll((items) =>
        items.filter((item) => (item as HTMLElement).tabIndex === 0).length
      )
    ).toBe(1);
    await expect(panel).toHaveAttribute("aria-labelledby", "process-tab-discovery");
    await expect(panel).not.toHaveAttribute("aria-live");
  });

  test("updates selection, focus, labeling, and content for pointer and keyboard input", async ({
    page,
  }) => {
    const tabs = processTabs(page);
    const panel = page.getByRole("tabpanel");

    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(1)).toHaveAttribute("tabindex", "0");
    await expect(panel).toHaveAttribute("aria-labelledby", "process-tab-plan");
    await expect(panel.locator("[data-process-title]")).toHaveText("Plan");
    await expect(panel.locator("[data-process-description]")).toContainText("roadmap");

    await tabs.nth(1).press("ArrowRight");
    await expect(tabs.nth(2)).toBeFocused();
    await expect(panel.locator("[data-process-title]")).toHaveText("Build");

    await tabs.nth(2).press("ArrowLeft");
    await expect(tabs.nth(1)).toBeFocused();

    await tabs.nth(1).press("End");
    await expect(tabs.nth(3)).toBeFocused();
    await expect(panel.locator("[data-process-title]")).toHaveText("Launch");

    await tabs.nth(3).press("Home");
    await expect(tabs.nth(0)).toBeFocused();
    await expect(panel.locator("[data-process-title]")).toHaveText("Discovery");
  });

  test("keeps the controls, focus indicator, and panel understandable at required widths", async ({
    page,
  }) => {
    for (const width of [320, 768, 1279, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });

      const state = await page.locator("#process").evaluate((section) => {
        const tabs = [...section.querySelectorAll<HTMLElement>("[role='tab']")];
        const panel = section.querySelector<HTMLElement>("[role='tabpanel']");
        const icons = [...section.querySelectorAll<HTMLElement>(".process-tab__icon")];
        const dots = [...section.querySelectorAll<HTMLElement>(".process-tab__dot")];
        const sectionRect = section.getBoundingClientRect();
        const panelRect = panel?.getBoundingClientRect();
        const tabTops = tabs.map((tab) => Math.round(tab.getBoundingClientRect().top));

        return {
          noPageOverflow: document.documentElement.scrollWidth <= window.innerWidth,
          tabsContained: tabs.every((tab) => {
            const tabRect = tab.getBoundingClientRect();
            return tabRect.left >= sectionRect.left && tabRect.right <= sectionRect.right;
          }),
          tabsShareOneRow: new Set(tabTops).size === 1,
          iconWidths: icons.map((icon) => Math.round(icon.getBoundingClientRect().width)),
          dotsVisible: dots.every((dot) => getComputedStyle(dot).display !== "none"),
          panelCentered: panelRect
            ? Math.abs(
                panelRect.left + panelRect.width / 2 -
                  (sectionRect.left + sectionRect.width / 2)
              ) <= 1
            : false,
          panelWidth: panelRect?.width ?? 0,
          panelFitsContent: panel
            ? panel.scrollHeight <= panel.clientHeight + 1
            : false,
        };
      });

      expect(state).toEqual({
        noPageOverflow: true,
        tabsContained: true,
        tabsShareOneRow: true,
        iconWidths: Array(4).fill(width < 720 ? 48 : 34),
        dotsVisible: width >= 720,
        panelCentered: true,
        panelWidth: width === 320 ? 288 : 640,
        panelFitsContent: true,
      });

      const focusedTab = processTabs(page).nth(1);
      await focusedTab.focus();
      const hasVisibleFocus = await focusedTab.evaluate((tab) => {
        const tabOutline = getComputedStyle(tab).outlineStyle;
        const icon = tab.querySelector(".process-tab__icon");
        const iconOutline = icon ? getComputedStyle(icon).outlineStyle : "none";
        return tabOutline !== "none" || iconOutline !== "none";
      });
      expect(hasVisibleFocus).toBe(true);
    }
  });

  test("updates immediately when reduced motion is requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const panel = page.getByRole("tabpanel");

    await processTabs(page).nth(2).click();

    await expect(panel.locator("[data-process-title]")).toHaveText("Build");
    expect(await panel.evaluate((element) => element.getAnimations().length)).toBe(0);
  });

  test("animates panel height without leaving its content clipped", async ({ page }) => {
    const panel = page.getByRole("tabpanel");

    await processTabs(page).nth(1).click();
    const duration = await panel.evaluate((element) => {
      const animation = element.getAnimations()[0];
      return Number(animation?.effect?.getTiming().duration ?? 0);
    });

    expect(duration).toBe(180);
    await expect
      .poll(() =>
        panel.evaluate((element) => ({
          height: element.style.height,
          overflow: element.style.overflow,
        }))
      )
      .toEqual({ height: "", overflow: "" });
  });
});
