import { expect, test } from "@playwright/test";

const viewports = [
  { width: 320, visibleCards: 1, controls: false },
  { width: 768, visibleCards: 2, controls: true },
  { width: 1279, visibleCards: 2, controls: true },
  { width: 1280, visibleCards: 3, controls: false },
  { width: 1440, visibleCards: 3, controls: false },
];

test.describe("Issue #15 Featured Work responsive composition", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  for (const viewport of viewports) {
    test(`${viewport.width}px shows ${viewport.visibleCards} cards with the approved controls`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: 900 });
      const carousel = page.locator("[data-work-carousel]");
      await carousel.scrollIntoViewIfNeeded();

      await expect(page.locator("#work .section-label")).toHaveText("FEATURED PROJECTS");
      await expect(page.locator("#work h2")).toHaveText("Selected work.");
      await expect(page.locator("#work .see-all")).toHaveAttribute("href", "/work");
      await expect(page.locator("[data-work-track] .work-card")).toHaveCount(3);

      await expect.poll(() =>
        page.locator("[data-work-track] .work-card").evaluateAll((cards) =>
          cards.filter((card) => {
            const style = getComputedStyle(card);
            return style.visibility !== "hidden" && style.display !== "none" && Number(style.opacity) > 0;
          }).length
        )
      ).toBe(viewport.visibleCards);

      const controls = page.locator("[data-work-prev], [data-work-next]");
      if (viewport.controls) {
        await expect(controls).toHaveCount(2);
        await expect(controls.first()).toBeVisible();
        const sizes = await controls.evaluateAll((items) =>
          items.map((item) => {
            const rect = item.getBoundingClientRect();
            return { width: rect.width, height: rect.height };
          })
        );
        expect(sizes.every(({ width, height }) => width >= 44 && height >= 44)).toBe(true);
      } else {
        await expect(controls.first()).toBeHidden();
      }

      const dots = page.locator("[data-work-dots] [data-deck-index]");
      if (viewport.width < 1280) {
        await expect(dots).toHaveCount(3);
        await expect(dots.first()).toBeVisible();
        expect(await dots.evaluateAll((items) =>
          items.every((item) => item.tagName === "SPAN" && (item as HTMLElement).tabIndex === -1)
        )).toBe(true);
      } else {
        await expect(page.locator("[data-work-dots]")).toBeHidden();
      }
    });
  }

  test("descriptions are clamped to three lines and cards omit deferred destinations", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await expect(page.locator("[data-work-track] .work-link")).toHaveCount(0);
    await expect(page.locator("[data-work-track] .work-body > p").first()).toHaveCSS("-webkit-line-clamp", "3");
  });
});
