import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const homepageUrl = pathToFileURL(resolve(process.cwd(), "homepage-updated.html")).href;
const approvedTools = [
  "Excel",
  "Google Sheets",
  "Apps Script",
  "VBA",
  "Git",
  "GitHub",
  "HTML",
  "CSS",
  "JavaScript",
  "Python",
  "n8n",
  "Make",
];

test.describe("homepage Stack", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(homepageUrl, { waitUntil: "domcontentloaded" });
  });

  test("preserves the approved tool order and hides the loop copy from assistive technology", async ({
    page,
  }) => {
    const stack = page.locator("#stack");
    const primarySequence = stack.locator(".stack-sequence").first();
    const loopSequence = stack.locator('.stack-sequence[aria-hidden="true"]');

    await expect(stack.locator(".section-label")).toHaveText("Stack");
    await expect(stack.locator(".see-all")).toHaveAttribute("href", "/stack");
    await expect(primarySequence.locator(".stack-item span:last-child")).toHaveText(approvedTools);
    await expect(loopSequence).toHaveCount(1);
    await expect(loopSequence.locator(".stack-item")).toHaveCount(approvedTools.length);
  });

  test("stays compact and contained at every approved review width", async ({ page }) => {
    for (const width of [320, 768, 1279, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });

      const measurements = await page.locator("#stack").evaluate((section) => {
        const shell = section.querySelector(".reading-shell");
        const marquee = section.querySelector(".stack-marquee");
        const header = section.querySelector(".stack-header");
        const sectionStyle = getComputedStyle(section);
        const headerStyle = getComputedStyle(header!);

        return {
          shellWidth: shell!.getBoundingClientRect().width,
          marqueeWidth: marquee!.getBoundingClientRect().width,
          viewportWidth: document.documentElement.clientWidth,
          padding:
            Number.parseFloat(sectionStyle.paddingTop) +
            Number.parseFloat(sectionStyle.paddingBottom),
          headingGap: Number.parseFloat(headerStyle.marginBottom),
          hasPageOverflow:
            document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      });

      expect(measurements.shellWidth, `${width}px shell`).toBeLessThanOrEqual(768);
      expect(measurements.marqueeWidth, `${width}px marquee`).toBeLessThanOrEqual(
        measurements.viewportWidth,
      );
      expect(measurements.padding, `${width}px section padding`).toBeLessThanOrEqual(72);
      expect(measurements.headingGap, `${width}px heading gap`).toBeLessThanOrEqual(12);
      expect(measurements.hasPageOverflow, `${width}px page overflow`).toBe(false);
    }
  });

  test("becomes a stationary, keyboard-scrollable row when reduced motion is requested", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 320, height: 568 });

    const marquee = page.locator("#stack .stack-marquee");
    const track = marquee.locator(".stack-track");
    const duplicate = marquee.locator('.stack-sequence[aria-hidden="true"]');

    await expect(track).toHaveCSS("animation-name", "none");
    await expect(marquee).toHaveCSS("overflow-x", "auto");
    await expect(duplicate).toBeHidden();
    await expect(marquee).toHaveAttribute("tabindex", "0");

    const before = await marquee.evaluate((element) => ({
      left: element.scrollLeft,
      overflow: element.scrollWidth > element.clientWidth,
    }));
    expect(before.overflow).toBe(true);

    await marquee.focus();
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => marquee.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  });
});
