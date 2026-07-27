import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const standaloneHomepageUrl = pathToFileURL(
  resolve(process.cwd(), "homepage-updated.html")
).href;

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "phone", width: 390, height: 844 },
  { name: "narrow-phone", width: 320, height: 568 },
];

test.describe("ticket 06: evidence-to-contact homepage story", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(standaloneHomepageUrl, { waitUntil: "domcontentloaded" });
  });

  test("keeps the evidence-to-contact sections in story order", async ({ page }) => {
    await expect(page.locator("main > section")).toHaveCount(6);

    await expect
      .poll(() =>
        page.locator("main > section").evaluateAll((sections) =>
          sections.map((section) => section.id || section.classList[0])
        )
      )
      .toEqual(["hero", "work", "stack", "process", "services-preview", "contact"]);
  });

  test("uses the same right-aligned destination relationship for Stack and Services", async ({ page }) => {
    await expect(page.locator("#stack .section-heading")).toBeVisible();
    await expect(page.locator("#stack .section-heading [role='heading']")).toHaveText(
      "Technologies & Tools"
    );
    await expect(page.locator("#stack .section-heading > .see-all")).toHaveText(/View all/);
    await expect(page.locator("#stack .section-heading > .see-all")).toHaveAttribute("href", "/stack");

    await expect(page.locator("#services-preview .section-heading > .see-all")).toHaveText(
      /See all services/
    );

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      const layout = await page.evaluate(() => {
        const headingSelectors = ["#work .section-heading", "#stack .section-heading", "#services-preview .section-heading"];

        return headingSelectors.map((selector) => {
          const heading = document.querySelector(selector);
          const title = heading?.firstElementChild;
          const link = heading?.querySelector(":scope > a");
          const titleRect = title?.getBoundingClientRect();
          const linkRect = link?.getBoundingClientRect();

          return {
            sameRow:
              Boolean(titleRect && linkRect) &&
              titleRect!.bottom > linkRect!.top &&
              titleRect!.top < linkRect!.bottom,
            titleBeforeLink: Boolean(titleRect && linkRect) && titleRect!.right <= linkRect!.left + 1,
            contained:
              Boolean(titleRect && linkRect) &&
              titleRect!.left >= 0 &&
              linkRect!.right <= window.innerWidth &&
              titleRect!.right <= window.innerWidth,
          };
        });
      });

      expect(layout, viewport.name).toEqual([
        { sameRow: true, titleBeforeLink: true, contained: true },
        { sameRow: true, titleBeforeLink: true, contained: true },
        { sameRow: true, titleBeforeLink: true, contained: true },
      ]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });

  test("removes generic section dividers while retaining header and footer boundaries", async ({ page }) => {
    const boundaries = await page.evaluate(() => ({
      mainSectionBorders: [...document.querySelectorAll("main > section")].map((section) => ({
        top: getComputedStyle(section).borderTopWidth,
        bottom: getComputedStyle(section).borderBottomWidth,
      })),
      headerBottom: getComputedStyle(document.querySelector(".site-header")!).borderBottomWidth,
      footerTop: getComputedStyle(document.querySelector("footer")!).borderTopWidth,
    }));

    expect(boundaries.mainSectionBorders).toEqual(
      expect.arrayContaining([
        { top: "0px", bottom: "0px" },
      ])
    );
    expect(boundaries.mainSectionBorders.every(({ top }) => top === "0px")).toBe(true);
    expect(boundaries.headerBottom).not.toBe("0px");
    expect(boundaries.footerTop).not.toBe("0px");
  });

  test("keeps responsive spacing, Stack content, and reduced-motion behavior", async ({ page }) => {
    const spacing = [];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      spacing.push({
        name: viewport.name,
        values: await page.evaluate(() => {
          const styles = (selector: string) => {
            const element = document.querySelector(selector)!;
            const computed = getComputedStyle(element);
            return {
              top: Number.parseFloat(computed.paddingTop),
              bottom: Number.parseFloat(computed.paddingBottom),
            };
          };

          return {
            hero: styles(".hero"),
            ordinary: styles("#work"),
            contact: styles("#contact"),
            chips: document.querySelectorAll("#stack .stack-item").length,
            marqueeVisible: Boolean(document.querySelector("#stack .stack-marquee")),
          };
        }),
      });
    }

    for (const { name, values } of spacing) {
      expect(values.hero.top, name).toBeGreaterThan(values.ordinary.top);
      expect(values.contact.bottom, name).toBeGreaterThan(values.ordinary.bottom);
      expect(values.chips, name).toBeGreaterThan(0);
      expect(values.marqueeVisible, name).toBe(true);
    }

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => page.locator("#stack .stack-track").evaluate((track) => getComputedStyle(track).animationName))
      .toBe("none");
  });
});
