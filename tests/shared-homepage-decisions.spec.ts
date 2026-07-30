import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const standaloneHomepageUrl = pathToFileURL(
  resolve(process.cwd(), "homepage-updated.html")
).href;

const primaryNavigation = [
  { name: "Work", href: "/work" },
  { name: "Stack", href: "/stack" },
  { name: "Contact", href: "/contact" },
];

const socialDestinations = [
  { name: "GitHub", href: "https://github.com/j-allekine" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/j-allekine/" },
  { name: "Email", href: "mailto:ajihmallekine@gmail.com" },
];

test.describe("shared homepage decisions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(standaloneHomepageUrl, { waitUntil: "domcontentloaded" });
  });

  test("uses a fixed desktop sidebar with the approved navigation and social ownership", async ({ page }) => {
    for (const width of [1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });

      const sidebar = page.locator("[data-desktop-sidebar]");
      await expect(sidebar).toBeVisible();
      await expect(sidebar).toHaveCSS("position", "fixed");
      await expect(sidebar.locator(".desktop-sidebar__brand")).toHaveAttribute("href", "/");
      await expect(sidebar.locator(".desktop-sidebar__brand")).toHaveAttribute("aria-current", "page");
      await expect(sidebar.getByRole("link", { name: "Home", exact: true })).toHaveCount(0);

      const sidebarWidth = await sidebar.evaluate((element) => element.getBoundingClientRect().width);
      expect(sidebarWidth).toBeGreaterThanOrEqual(224);
      expect(sidebarWidth).toBeLessThanOrEqual(240);

      const navigationGrid = sidebar.locator(".desktop-sidebar__nav");
      await expect(navigationGrid).toHaveCSS("display", "grid");
      await expect(navigationGrid).toHaveCSS("border-top-style", "solid");
      await expect(navigationGrid).toHaveCSS("border-bottom-style", "solid");

      for (const item of primaryNavigation) {
        await expect(sidebar.getByRole("link", { name: item.name, exact: true })).toHaveAttribute(
          "href",
          item.href
        );
      }

      const sidebarLinks = sidebar.locator("[data-sidebar-socials] a");
      await expect(sidebarLinks).toHaveCount(socialDestinations.length);
      for (const item of socialDestinations) {
        await expect(sidebar.getByRole("link", { name: item.name, exact: true })).toHaveAttribute(
          "href",
          item.href
        );
      }
      await expect(sidebar).toContainText("Colossians 3:23");
      await expect(page.locator("[data-mobile-sidebar]")).toBeHidden();
    }
  });

  test("uses the same accessible responsive navigation panel below the desktop breakpoint", async ({ page }) => {
    for (const viewport of [
      { width: 1279, height: 768 },
      { width: 768, height: 900 },
      { width: 320, height: 568 },
    ]) {
      await page.setViewportSize(viewport);
      const menuButton = page.locator("[data-menu-button]");
      const navigationPanel = page.locator("[data-mobile-sidebar]");
      const pageFrame = page.locator("[data-page-frame]");

      await expect(page.locator("[data-desktop-sidebar]")).toBeHidden();
      await expect(menuButton).toBeVisible();
      await expect(page.locator(".site-header .brand")).toBeVisible();
      await expect(navigationPanel.locator(".mobile-sidebar__brand")).toHaveAttribute("href", "/");
      await expect(navigationPanel.getByRole("link", { name: "Home", exact: true })).toHaveCount(0);
      await expect(menuButton).toHaveAttribute("aria-expanded", "false");
      await expect(navigationPanel).toHaveAttribute("aria-hidden", "true");
      await expect(navigationPanel).toBeHidden();
      await expect(pageFrame).not.toHaveAttribute("inert");
      await expect(pageFrame).not.toHaveAttribute("aria-hidden");

      await menuButton.click();
      await expect(navigationPanel).toHaveAttribute("aria-hidden", "false");
      await expect(pageFrame).toHaveAttribute("inert", "");
      await expect(page.locator("[data-menu-close]")).toBeFocused();

      for (const item of primaryNavigation) {
        await expect(navigationPanel.getByRole("link", { name: item.name, exact: true })).toHaveAttribute(
          "href",
          item.href
        );
      }
      for (const item of socialDestinations) {
        await expect(navigationPanel.getByRole("link", { name: item.name, exact: true })).toHaveAttribute(
          "href",
          item.href
        );
      }
      await expect(navigationPanel).toContainText("Colossians 3:23");

      await page.keyboard.press("Escape");
      await expect(menuButton).toHaveAttribute("aria-expanded", "false");
      await expect(menuButton).toBeFocused();
    }
  });

  test("keeps the shared content baseline and section flow", async ({ page }) => {
    await expect(page).toHaveTitle("J. Allekine | Operational Problem-Solver");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /operational problem-solver/
    );

    await expect
      .poll(() => page.locator("main > section").evaluateAll((sections) => sections.map((section) => section.id)))
      .toEqual(["hero", "work", "stack", "process", "about", "contact"]);

    await expect(page.locator("#services-preview")).toHaveCount(0);
    await expect(page.getByText("Systems & Automation Developer", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Book a 30-minute call", { exact: false })).toHaveCount(0);

    await expect(page.locator(".hero-statement")).toHaveText("I am an automation specialist.");
    await expect(page.locator(".hero-copy--lead")).toHaveText(
      "I build spreadsheet systems, workflow automations, data tools, and practical software that turn manual processes into clearer, more reliable operations. I enjoy mapping workflows, understanding the details, and building useful tools that people can rely on."
    );
    await expect(page.locator(".hero-copy:not(.hero-copy--lead)")).toHaveText(
      "My Christian faith shapes how I approach my work. I see building as an act of stewardship: serving people well, pursuing excellence, and creating work that honors God."
    );

    await expect(page.getByRole("link", { name: /View selected work/ })).toHaveAttribute("href", "#work");
    await expect(page.getByRole("link", { name: /Contact me/ })).toHaveAttribute("href", "/contact");
    await expect(page.locator(".hero-socials")).toHaveCount(0);

    const cards = page.locator("[data-work-track] .work-card");
    await expect(cards).toHaveCount(3);
    await expect(cards.locator("h3")).toHaveText([
      "Pharmacy Inventory System",
      "Hospital OCR Automation Pipeline",
      "LGU Inventory & Asset System",
    ]);
    await expect(cards.locator(".work-link")).toHaveCount(0);

    await expect(page.locator("#stack .section-label")).toHaveText("Stack");
    await expect(page.locator("#stack .see-all")).toHaveAttribute("href", "/stack");
    await expect(page.locator("#stack .section-label")).toHaveCSS("font-family", /Geist Mono/);
    await expect(page.locator("body")).toHaveCSS("min-width", "320px");
  });
});
