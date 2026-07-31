import { expect, test } from "@playwright/test";

const homepageSections = ["hero", "work", "stack", "process", "about", "contact"];

test.describe("issue #32 homepage story", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("presents the approved About and Contact flow without removed content", async ({ page }) => {
    await expect(page.locator("main > section")).toHaveCount(homepageSections.length);

    expect(
      await page.locator("main > section").evaluateAll((sections) => sections.map((section) => section.id)),
    ).toEqual(homepageSections);

    const about = page.locator("#about");
    await expect(about).toHaveAttribute("aria-labelledby", "about-title");
    await expect(about.getByRole("heading", { level: 2 })).toHaveText("About");
    await expect(about).toContainText("I work at the intersection of spreadsheets, automation, and software to help organizations solve real problems.");
    await expect(about).toContainText("My Christian faith shapes how I approach that work");
    await expect(about.locator(".socials")).toHaveCount(0);
    await expect(about.getByRole("link")).toHaveCount(0);
    await expect(about.getByRole("link", { name: /résumé|resume/i })).toHaveCount(0);

    const contact = page.locator("#contact");
    await expect(contact.getByRole("heading", { level: 2 })).toHaveText("Let’s build something that works.");
    await expect(contact).toContainText("Bring the process that feels too manual, too scattered, or too fragile. We can turn it into a clearer system.");
    await expect(contact.getByRole("link", { name: /Contact Me/ })).toHaveAttribute("href", "/contact");

    await expect(page.locator("main")).not.toContainText("Services");
    await expect(page.getByRole("link", { name: "Services", exact: true })).toHaveCount(0);
    await expect(page.locator("main").getByRole("link", { name: /case study|résumé|resume/i })).toHaveCount(0);
    await expect(page.locator("main a[href='#']")).toHaveCount(0);
    await expect(page.locator("main a[href='mailto:hello@example.com']")).toHaveCount(0);
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator("footer .footer-back")).toHaveAttribute("href", "#top");
  });

  test("keeps About and Contact contained and operable at every approved width", async ({ page }) => {
    for (const width of [320, 768, 1279, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });

      const layout = await page.evaluate(() => {
        const sections = [...document.querySelectorAll("main > section")];
        const about = document.querySelector("#about");
        const contact = document.querySelector("#contact");

        return {
          noOverflow: document.documentElement.scrollWidth <= window.innerWidth,
          sectionsContained: sections.every((section) => {
            const rect = section.getBoundingClientRect();
            return rect.left >= -1 && rect.right <= window.innerWidth + 1;
          }),
          aboutVisible: Boolean(about && about.getBoundingClientRect().height > 0),
          contactVisible: Boolean(contact && contact.getBoundingClientRect().height > 0),
        };
      });

      expect(layout, `${width}px`).toEqual({
        noOverflow: true,
        sectionsContained: true,
        aboutVisible: true,
        contactVisible: true,
      });

      const contactAction = page.locator("#contact a");
      await contactAction.focus();
      await expect(contactAction).toBeFocused();
      await expect
        .poll(() => contactAction.evaluate((element) => getComputedStyle(element).outlineStyle))
        .not.toBe("none");
    }
  });

  test("uses a working Contact destination", async ({ page }) => {
    await expect(page.locator("#contact a")).toHaveAttribute("href", "/contact");
    const response = await page.goto("/contact", { waitUntil: "domcontentloaded" });

    expect(response?.ok()).toBe(true);
    await expect(page.locator("main#top")).toBeVisible();
    await expect(page.locator("main#top a[href='mailto:ajihmallekine@gmail.com']")).toHaveCount(1);
    await expect(page.locator("a[href='mailto:hello@example.com']")).toHaveCount(0);
  });
});
