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

test.describe("issue #5 standalone footer", () => {
  test("keeps all footer items readable in one non-overlapping row", async ({ page }, testInfo) => {
    await page.goto(standaloneHomepageUrl, { waitUntil: "domcontentloaded" });

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      const footer = page.locator("footer");
      const footerInner = footer.locator(".footer-inner");
      const items = footerInner.locator(":scope > *");

      await expect(footer).toBeVisible();
      await expect(items).toHaveCount(3);
      for (let index = 0; index < 3; index += 1) {
        await expect(items.nth(index)).toBeVisible();
      }

      const layout = await footerInner.evaluate((inner) => {
        const innerRect = inner.getBoundingClientRect();
        const itemRects = [...inner.children].map((child) => {
          const rect = child.getBoundingClientRect();
          const range = document.createRange();
          range.selectNodeContents(child);
          const contentRect = range.getBoundingClientRect();

          return {
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
            width: rect.width,
            contentLeft: contentRect.left,
            contentRight: contentRect.right,
            contentTop: contentRect.top,
            contentBottom: contentRect.bottom,
          };
        });

        return {
          inner: {
            left: innerRect.left,
            right: innerRect.right,
            top: innerRect.top,
            bottom: innerRect.bottom,
          },
          items: itemRects,
          fontSize: Number.parseFloat(getComputedStyle(inner).fontSize),
          noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth,
        };
      });

      expect(layout.noHorizontalOverflow, viewport.name).toBe(true);
      expect(layout.items, viewport.name).toHaveLength(3);
      expect(layout.fontSize, viewport.name).toBeGreaterThanOrEqual(8.96);

      const rowTop = Math.round(layout.items[0].top);
      for (const [index, item] of layout.items.entries()) {
        expect(item.width, `${viewport.name} item ${index}`).toBeGreaterThan(0);
        expect(item.left, `${viewport.name} item ${index}`).toBeGreaterThanOrEqual(
          layout.inner.left
        );
        expect(item.right, `${viewport.name} item ${index}`).toBeLessThanOrEqual(
          layout.inner.right
        );
        expect(Math.round(item.top), `${viewport.name} item ${index}`).toBe(rowTop);
        expect(item.contentLeft, `${viewport.name} content ${index}`).toBeGreaterThanOrEqual(
          item.left
        );
        expect(item.contentRight, `${viewport.name} content ${index}`).toBeLessThanOrEqual(
          item.right
        );
        expect(item.contentTop, `${viewport.name} content ${index}`).toBeGreaterThanOrEqual(
          item.top
        );
        expect(item.contentBottom, `${viewport.name} content ${index}`).toBeLessThanOrEqual(
          item.bottom
        );

        if (index > 0) {
          expect(item.left, `${viewport.name} gap before item ${index}`).toBeGreaterThanOrEqual(
            layout.items[index - 1].right + 1
          );
        }
      }

      if (viewport.width === 320) {
        await footer.scrollIntoViewIfNeeded();
        await page.screenshot({
          path: testInfo.outputPath("footer-320x568.png"),
        });
      }

      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, document.body.scrollHeight);
      });
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

      const backToTop = footer.getByRole("link", { name: /Back to top/ });
      await expect(backToTop).toHaveText(/Back to top/);
      await backToTop.click();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(4);
    }
  });
});
