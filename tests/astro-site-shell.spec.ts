import { expect, test } from "@playwright/test";

const primaryNavigation = [
  { name: "Work", href: "/work" },
  { name: "Stack", href: "/stack" },
  { name: "Contact", href: "/contact" },
];

const existingRoutes = [
  "/",
  "/work",
  "/stack",
  "/services",
  "/about",
  "/contact",
];

test.describe("Astro shared site shell", () => {
  test("Astro preview is available @unconfigured", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });

    expect(response?.ok()).toBe(true);
    await expect(page.locator("main#top")).toHaveCount(1);
  });

  test("renders the persistent desktop sidebar with approved destinations", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.setViewportSize({ width: 1440, height: 900 });

    const sidebar = page.locator("[data-desktop-sidebar]");
    await expect(sidebar).toBeVisible();
    await expect(sidebar).toHaveCSS("position", "fixed");
    await expect(sidebar.locator(".desktop-sidebar__brand")).toHaveAttribute("href", "/");
    await expect(sidebar.locator(".desktop-sidebar__brand")).toHaveAttribute("aria-current", "page");
    await expect(sidebar.getByRole("link", { name: "Home", exact: true })).toHaveCount(0);

    for (const item of primaryNavigation) {
      await expect(sidebar.getByRole("link", { name: item.name, exact: true })).toHaveAttribute(
        "href",
        item.href,
      );
    }

    await expect(sidebar.locator("[data-sidebar-socials] a")).toHaveCount(3);
    await expect(sidebar).toContainText("Colossians 3:23");
    await expect(page.locator("[data-mobile-sidebar]")).toBeHidden();
  });

  test("keeps the compact navigation contained and recoverable", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.setViewportSize({ width: 768, height: 900 });

    const menuButton = page.locator("[data-menu-button]");
    const navigationPanel = page.locator("[data-mobile-sidebar]");
    const pageFrame = page.locator("[data-page-frame]");
    const backdrop = page.locator("[data-sidebar-backdrop]");
    const contentShell = page.locator("main .content-shell").first();
    const contentLeftBefore = await contentShell.evaluate((element) => element.getBoundingClientRect().left);

    await expect(page.locator("[data-desktop-sidebar]")).toBeHidden();
    await expect(navigationPanel).toHaveAttribute("aria-hidden", "true");
    await menuButton.focus();
    await menuButton.click();

    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(navigationPanel).toHaveAttribute("aria-hidden", "false");
    await expect(pageFrame).toHaveAttribute("inert", "");
    await expect(pageFrame).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
    await expect(page.locator("body")).toHaveCSS("position", "fixed");
    await expect
      .poll(() => contentShell.evaluate((element) => element.getBoundingClientRect().left))
      .toBe(contentLeftBefore);
    await expect(navigationPanel.locator("[data-menu-close]")).toBeFocused();

    const focusableItems = navigationPanel.locator("a[href], button:not([disabled])");
    await focusableItems.first().focus();
    await page.keyboard.press("Shift+Tab");
    await expect(focusableItems.last()).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(focusableItems.first()).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(navigationPanel).toHaveAttribute("aria-hidden", "true");
    await expect(pageFrame).not.toHaveAttribute("inert");
    await expect(menuButton).toBeFocused();

    await menuButton.click();
    await backdrop.click({ position: { x: 300, y: 4 } });
    await expect(navigationPanel).toHaveAttribute("aria-hidden", "true");
    await expect(menuButton).toBeFocused();

    await menuButton.click();
    const workLink = navigationPanel.getByRole("link", { name: "Work", exact: true });
    await workLink.evaluate((link) => {
      link.addEventListener("click", (event) => event.preventDefault(), { once: true });
    });
    await workLink.click();
    await expect(navigationPanel).toHaveAttribute("aria-hidden", "true");
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await menuButton.click();
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(navigationPanel).toHaveAttribute("aria-hidden", "true");
    await expect(pageFrame).not.toHaveAttribute("inert");
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
  });

  test("uses the same shell and footer on every existing route", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });

    for (const route of existingRoutes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.locator("[data-page-frame]")).toBeVisible();
      await expect(page.locator("[data-menu-button]")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
      await expect(page.locator("footer .footer-inner > *")).toHaveCount(2);
      await expect(page.locator("footer .footer-back")).toHaveAttribute("href", "#top");
      await expect(page.locator("main#top")).toHaveCount(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        `${route} at 768px`,
      ).toBe(true);
    }

    await page.setViewportSize({ width: 320, height: 568 });
    for (const route of existingRoutes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.locator("[data-mobile-sidebar]")).toBeHidden();
      await expect(page.locator("footer .footer-back")).toHaveAttribute("href", "#top");
      await expect(page.locator("main#top")).toHaveCount(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        `${route} at 320px`,
      ).toBe(true);
    }

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, document.body.scrollHeight);
    });
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await page.locator("footer .footer-back").click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(4);

    await page.setViewportSize({ width: 1440, height: 900 });
    for (const route of existingRoutes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.locator("[data-desktop-sidebar]")).toBeVisible();
      await expect(page.locator("[data-mobile-sidebar]")).toBeHidden();
      await expect(page.locator("footer")).toBeVisible();
    }
  });
});
