import { expect, test } from "@playwright/test";
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
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("keeps every tool name available when external images fail", async ({ page }) => {
    await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort());
    await page.reload({ waitUntil: "domcontentloaded" });

    const primarySequence = page.locator("#stack .stack-sequence").first();
    await expect(primarySequence.locator(".stack-item span:last-child")).toHaveText(approvedTools);
  });

  test("preserves the approved tool order and hides the loop copy from assistive technology", async ({
    page,
  }) => {
    const stack = page.locator("#stack");
    const primarySequence = stack.locator(".stack-sequence").first();
    const loopSequence = stack.locator('.stack-sequence[aria-hidden="true"]');

    await expect(stack.locator(".section-label")).toHaveCount(1);
    await expect(stack.locator(".section-label")).toHaveText("Stack");
    await expect(stack).not.toContainText("Technologies & Tools");
    await expect(stack.locator(".see-all")).toHaveAttribute("href", "/stack");
    await expect(stack.locator(".see-all")).toHaveText("See full stack →");
    await expect(primarySequence.locator(".stack-item span:last-child")).toHaveText(approvedTools);
    await expect(loopSequence).toHaveCount(1);
    await expect(loopSequence.locator(".stack-item")).toHaveCount(approvedTools.length);

    const loopAlignment = await stack.locator(".stack-track").evaluate((track) => {
      const [primary, duplicate] = Array.from(track.querySelectorAll(".stack-sequence"));
      const primaryBox = primary.getBoundingClientRect();
      const duplicateBox = duplicate.getBoundingClientRect();

      return {
        sequenceWidth: primaryBox.width,
        duplicateOffset: duplicateBox.x - primaryBox.x,
      };
    });

    expect(Math.abs(loopAlignment.duplicateOffset - loopAlignment.sequenceWidth))
      .toBeLessThanOrEqual(0.5);
  });

  test("stays compact and contained at every approved review width", async ({ page }) => {
    const approvedGeometry = [
      { width: 320, shellWidth: 280, padding: 52, headingGap: 10, itemHeight: 36 },
      { width: 768, shellWidth: 706.56, padding: 48, headingGap: 12, itemHeight: 36 },
      { width: 1279, shellWidth: 768, padding: 72, headingGap: 12, itemHeight: 36 },
      { width: 1280, shellWidth: 768, padding: 72, headingGap: 12, itemHeight: 36 },
      { width: 1440, shellWidth: 768, padding: 72, headingGap: 12, itemHeight: 36 },
    ];

    for (const expected of approvedGeometry) {
      const { width } = expected;
      await page.setViewportSize({ width, height: 900 });

      const measurements = await page.locator("#stack").evaluate((section) => {
        const shell = section.querySelector(".reading-shell");
        const marquee = section.querySelector(".stack-marquee");
        const header = section.querySelector(".stack-header");
        const firstItem = section.querySelector(".stack-item");
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
          itemHeight: firstItem!.getBoundingClientRect().height,
          hasPageOverflow:
            document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      });

      expect(measurements.shellWidth, `${width}px shell`).toBeCloseTo(expected.shellWidth, 0);
      expect(measurements.marqueeWidth, `${width}px marquee`).toBeCloseTo(
        expected.shellWidth,
        0,
      );
      expect(measurements.padding, `${width}px section padding`).toBeCloseTo(
        expected.padding,
        0,
      );
      expect(measurements.headingGap, `${width}px heading gap`).toBeCloseTo(
        expected.headingGap,
        0,
      );
      expect(measurements.itemHeight, `${width}px item height`).toBeCloseTo(
        expected.itemHeight,
        0,
      );
      expect(measurements.marqueeWidth).toBeLessThanOrEqual(measurements.viewportWidth);
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
