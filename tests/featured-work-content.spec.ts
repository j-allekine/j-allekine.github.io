import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const approvedProjects = [
  {
    title: "Pharmacy Inventory System",
    summary:
      "Centralizes medicine movement, expiry monitoring, FIFO handling, reordering, sales, and reporting in one operational system.",
    tags: ["Excel", "Inventory", "Healthcare"],
  },
  {
    title: "Hospital OCR Automation Pipeline",
    summary:
      "Turns uploaded hospital forms into structured records while keeping human review inside the workflow for faster, cleaner processing.",
    tags: ["Apps Script", "OCR", "Google APIs"],
  },
  {
    title: "LGU Inventory & Asset System",
    summary:
      "Creates one source of truth for consumable supplies, semi-expendable property, and fixed assets from receipt through disposal.",
    tags: ["Web App", "Government", "Assets"],
  },
];

for (const route of ["/", "/work"]) {
  test(`${route} presents the approved project facts in featured order`, async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });

    const cards = page.locator(route === "/" ? "#work .work-card" : "#work-page .work-card");
    await expect(cards).toHaveCount(approvedProjects.length);

    for (const [index, project] of approvedProjects.entries()) {
      const card = cards.nth(index);
      await expect(card.getByRole("heading", { level: 3 })).toHaveText(project.title);
      await expect(card.locator(".work-body > p")).toHaveText(project.summary);
      await expect(card.locator(".work-type span")).toHaveText(project.tags);
    }

    await expect(cards.getByRole("link", { name: /View case study/ })).toHaveCount(0);
    await expect(cards.locator('a[href="#"]')).toHaveCount(0);
  });
}

test("Featured work preserves approved selection behavior and accessibility state", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const work = page.locator("#work");
  const track = work.locator("[data-work-track]");
  const cards = work.locator(".work-card");
  const status = work.locator("[data-deck-status]");

  await expect(cards.nth(0)).toHaveAttribute("aria-current", "true");
  await expect(cards.nth(0)).toHaveAttribute("aria-label", /selected/);
  await expect(work.locator("[data-work-dots] button")).toHaveCount(0);

  await work.locator("[data-work-prev]").click();
  await expect(cards.nth(2)).toHaveAttribute("aria-current", "true");
  await expect(status).toContainText("3 of 3: LGU Inventory & Asset System");

  await track.press("ArrowRight");
  await expect(track).toBeFocused();
  await expect(cards.nth(0)).toHaveAttribute("aria-current", "true");

  await track.press("ArrowLeft");
  await expect(cards.nth(2)).toHaveAttribute("aria-current", "true");

  await track.press("ArrowRight");
  await cards.nth(1).click();
  await expect(cards.nth(1)).toHaveAttribute("aria-current", "true");
  await expect(status).toContainText("2 of 3: Hospital OCR Automation Pipeline");

  await track.press("ArrowRight");
  await expect(cards.nth(2)).toHaveAttribute("aria-current", "true");
  await expect(status).toContainText("3 of 3: LGU Inventory & Asset System");

  await page.setViewportSize({ width: 320, height: 700 });
  await expect(cards.nth(2)).toHaveAttribute("aria-current", "true");
});

test("Featured work uses the approved responsive composition", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const work = page.locator("#work");

  for (const expected of [
    { width: 320, cards: 1, controls: 0 },
    { width: 768, cards: 2, controls: 2 },
    { width: 1279, cards: 2, controls: 2 },
    { width: 1280, cards: 3, controls: 0 },
    { width: 1440, cards: 3, controls: 0 },
  ]) {
    await page.setViewportSize({ width: expected.width, height: 900 });
    await expect(work.locator(".work-card.is-active")).toHaveCSS("opacity", "1");

    const visibleCards = await work.locator(".work-card").evaluateAll((cards) =>
      cards.filter((card) => {
        const style = getComputedStyle(card);
        return style.display !== "none" && Number.parseFloat(style.opacity) > 0.5;
      }).length,
    );

    expect(visibleCards, `${expected.width}px visible cards`).toBe(expected.cards);
    await expect(work.locator(".work-carousel__control:visible")).toHaveCount(expected.controls);
    if (expected.controls) {
      const controlSizes = await work.locator(".work-carousel__control:visible").evaluateAll(
        (controls) => controls.map((control) => control.getBoundingClientRect().width),
      );
      expect(Math.min(...controlSizes), `${expected.width}px control target`).toBeGreaterThanOrEqual(40);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      `${expected.width}px horizontal overflow`,
    ).toBeLessThanOrEqual(expected.width);
  }

  await expect(work.getByRole("link", { name: /See all work/ })).toHaveAttribute("href", "/work");
  await expect(work.locator(".work-body > p").first()).toHaveCSS("-webkit-line-clamp", "3");
});

test("Featured work matches the restored homepage reference layout", async ({ page }) => {
  const captureLayout = async (url: string, width: number) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url, { waitUntil: "domcontentloaded" });

    return page.locator("#work").evaluate((work) => {
      const carousel = work.querySelector<HTMLElement>(".work-carousel")!;
      const carouselWidth = carousel.getBoundingClientRect().width;

      return {
        cards: [...work.querySelectorAll<HTMLElement>(".work-card")].map((card) => {
          const style = getComputedStyle(card);
          const box = card.getBoundingClientRect();
          return {
            display: style.display,
            position: style.position,
            opacity: style.opacity,
            transform: style.transform,
            widthRatio: box.width / carouselWidth,
          };
        }),
        controls: [...work.querySelectorAll<HTMLElement>(".work-carousel__control")]
          .filter((control) => getComputedStyle(control).display !== "none").length,
        dots: getComputedStyle(work.querySelector<HTMLElement>("[data-work-dots]")!).display,
      };
    });
  };

  const referenceUrl = pathToFileURL(resolve("homepage-updated.html")).href;

  for (const width of [320, 768, 1279, 1280, 1440]) {
    const reference = await captureLayout(referenceUrl, width);
    const astro = await captureLayout("/", width);

    expect(astro.controls, `${width}px controls`).toBe(reference.controls);
    expect(astro.dots, `${width}px dots`).toBe(reference.dots);

    for (const [index, card] of astro.cards.entries()) {
      expect(card.display, `${width}px card ${index + 1} display`).toBe(
        reference.cards[index].display,
      );
      expect(card.position, `${width}px card ${index + 1} position`).toBe(
        reference.cards[index].position,
      );
      expect(card.opacity, `${width}px card ${index + 1} opacity`).toBe(
        reference.cards[index].opacity,
      );
      expect(card.transform, `${width}px card ${index + 1} transform`).toBe(
        reference.cards[index].transform,
      );
      expect(card.widthRatio, `${width}px card ${index + 1} width`).toBeCloseTo(
        reference.cards[index].widthRatio,
        1,
      );
    }
  }
});

test("Featured work wraps horizontal swipes and ignores vertical gestures", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const work = page.locator("#work");
  const track = work.locator("[data-work-track]");
  const selectedCard = work.locator(".work-card[aria-current='true'] h3");

  const swipe = async (start: { x: number; y: number }, end: { x: number; y: number }) => {
    await track.dispatchEvent("pointerdown", {
      pointerId: 1,
      isPrimary: true,
      clientX: start.x,
      clientY: start.y,
    });
    await track.dispatchEvent("pointerup", {
      pointerId: 1,
      isPrimary: true,
      clientX: end.x,
      clientY: end.y,
    });
  };

  await swipe({ x: 250, y: 200 }, { x: 150, y: 205 });
  await expect(selectedCard).toHaveText("Hospital OCR Automation Pipeline");

  await swipe({ x: 180, y: 150 }, { x: 175, y: 260 });
  await expect(selectedCard).toHaveText("Hospital OCR Automation Pipeline");

  await swipe({ x: 250, y: 200 }, { x: 150, y: 205 });
  await swipe({ x: 250, y: 200 }, { x: 150, y: 205 });
  await expect(selectedCard).toHaveText("Pharmacy Inventory System");
});

test("Featured work keeps selection feedback understandable with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const work = page.locator("#work");
  await work.locator("[data-work-next]").click();

  await expect(work.locator(".work-card").nth(1)).toHaveAttribute("aria-current", "true");
  await expect(work.locator("[data-deck-status]")).toContainText(
    "2 of 3: Hospital OCR Automation Pipeline",
  );
  expect(
    await work.locator(".work-card").first().evaluate((card) =>
      Number.parseFloat(getComputedStyle(card).transitionDuration),
    ),
  ).toBeLessThan(0.1);
});
