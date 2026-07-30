import { expect, test } from "@playwright/test";

const approvedLeadCopy =
  "I build spreadsheet systems, workflow automations, data tools, and practical software that turn manual processes into clearer, more reliable operations. I enjoy mapping workflows, understanding the details, and building useful tools that people can rely on.";
const approvedFaithCopy =
  "My Christian faith shapes how I approach my work. I see building as an act of stewardship: serving people well, pursuing excellence, and creating work that honors God.";

const reviewViewports = [
  { width: 320, height: 700 },
  { width: 480, height: 700 },
  { width: 768, height: 900 },
  { width: 1279, height: 900 },
  { width: 1280, height: 900 },
  { width: 1440, height: 900 },
];

test.describe("approved Astro homepage Hero", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("presents the approved identity, copy, actions, and accessible placeholder", async ({ page }) => {
    const hero = page.locator("#hero");
    const heading = hero.getByRole("heading", { level: 1 });
    const actions = hero.locator(".hero-actions a");
    const portrait = hero.locator(".hero-portrait");

    await expect(hero).toHaveAttribute("aria-labelledby", "hero-title");
    await expect(heading.locator(".hero-name-line")).toHaveText(["JIHM ALLEKINE", "ALMEDILLA"]);
    await expect(hero.locator(".hero-statement")).toHaveText("I am an automation specialist.");
    await expect(hero.locator(".hero-copy--lead")).toHaveText(approvedLeadCopy);
    await expect(hero.locator(".hero-copy:not(.hero-copy--lead)")).toHaveText(approvedFaithCopy);

    await expect(actions).toHaveCount(2);
    await expect(actions.nth(0)).toContainText("View selected work");
    await expect(actions.nth(0)).toHaveAttribute("href", "#work");
    await expect(actions.nth(1)).toContainText("Contact me");
    await expect(actions.nth(1)).toHaveAttribute("href", "/contact");

    await expect(hero.locator(".hero-label")).toHaveCount(0);
    await expect(hero.getByText("Book a 30-minute call", { exact: false })).toHaveCount(0);
    await expect(hero.locator(".hero-socials")).toHaveCount(0);
    await expect(hero.locator('a[href="#"], a[href="mailto:hello@example.com"]')).toHaveCount(0);

    await expect(portrait).toHaveAttribute("aria-hidden", "true");
    await expect(portrait).not.toHaveAttribute("role");
    await expect(portrait).not.toHaveAttribute("aria-label");

    await actions.nth(0).click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.locator("#work")).toBeInViewport();
  });

  test("keeps the approved composition and actions usable at review widths", async ({ page }) => {
    for (const viewport of reviewViewports) {
      await page.setViewportSize(viewport);

      const geometry = await page.evaluate(() => {
        const getBox = (selector: string) => {
          const element = document.querySelector(selector);
          const box = element?.getBoundingClientRect();
          return box
            ? { x: box.x, y: box.y, width: box.width, height: box.height }
            : null;
        };

        return {
          hero: getBox("#hero"),
          portrait: getBox("#hero .hero-portrait"),
          intro: getBox("#hero .hero-intro"),
          details: getBox("#hero .hero-details"),
          primaryAction: getBox("#hero .hero-actions a:nth-child(1)"),
          secondaryAction: getBox("#hero .hero-actions a:nth-child(2)"),
          scrollWidth: document.documentElement.scrollWidth,
        };
      });

      expect(geometry.hero, `${viewport.width}px Hero`).not.toBeNull();
      expect(geometry.portrait, `${viewport.width}px portrait`).not.toBeNull();
      expect(geometry.intro, `${viewport.width}px intro`).not.toBeNull();
      expect(geometry.details, `${viewport.width}px details`).not.toBeNull();
      expect(geometry.primaryAction, `${viewport.width}px primary action`).not.toBeNull();
      expect(geometry.secondaryAction, `${viewport.width}px secondary action`).not.toBeNull();
      expect(geometry.scrollWidth, `${viewport.width}px overflow`).toBeLessThanOrEqual(viewport.width);

      if (viewport.width < 1280) {
        expect(geometry.portrait!.y, `${viewport.width}px portrait-first`).toBeLessThan(geometry.intro!.y);
        expect(geometry.details!.y, `${viewport.width}px reading order`).toBeGreaterThanOrEqual(
          geometry.intro!.y + geometry.intro!.height,
        );
        expect(geometry.portrait!.height / geometry.portrait!.width, `${viewport.width}px portrait ratio`).toBeGreaterThan(1);
      } else {
        expect(geometry.portrait!.x, `${viewport.width}px portrait-left`).toBeLessThan(geometry.intro!.x);
        expect(geometry.intro!.x - (geometry.portrait!.x + geometry.portrait!.width), `${viewport.width}px column gap`).toBeGreaterThanOrEqual(32);
        expect(geometry.portrait!.width, `${viewport.width}px portrait size`).toBeGreaterThanOrEqual(250);
        expect(geometry.portrait!.width / geometry.portrait!.height, `${viewport.width}px portrait ratio`).toBeGreaterThan(0.88);
        expect(geometry.hero!.width, `${viewport.width}px compact Hero width`).toBeLessThanOrEqual(760);
        expect(geometry.details!.y, `${viewport.width}px reading order`).toBeGreaterThanOrEqual(
          geometry.intro!.y + geometry.intro!.height,
        );
      }

      if (viewport.width === 320) {
        expect(geometry.primaryAction!.width, "320px primary action width").toBeGreaterThanOrEqual(geometry.hero!.width - 2);
        expect(geometry.secondaryAction!.width, "320px secondary action width").toBeGreaterThanOrEqual(geometry.hero!.width - 2);
        expect(geometry.secondaryAction!.y, "320px stacked actions").toBeGreaterThanOrEqual(
          geometry.primaryAction!.y + geometry.primaryAction!.height,
        );
      } else {
        expect(Math.abs(geometry.primaryAction!.y - geometry.secondaryAction!.y), `${viewport.width}px inline actions`).toBeLessThan(2);
      }
    }
  });

  test("keeps actions visible, focusable, and understandable with reduced motion", async ({ page }) => {
    const primaryAction = page.getByRole("link", { name: /View selected work/ });
    const secondaryAction = page.getByRole("link", { name: /Contact me/ });

    await primaryAction.focus();
    await expect(primaryAction).toBeFocused();
    await expect(primaryAction).toHaveCSS("outline-style", "solid");
    await expect(primaryAction).toBeVisible();
    await expect(secondaryAction).toBeVisible();

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(primaryAction).toBeVisible();
    await expect(secondaryAction).toBeVisible();
    expect(
      await primaryAction.evaluate((element) => Number.parseFloat(getComputedStyle(element).transitionDuration)),
    ).toBeLessThan(0.1);
  });
});
