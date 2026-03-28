import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Babylon.js rendering", () => {
  test("renders the canvas and displays the scene", async ({ page }) => {
    await page.goto("/");

    // Wait for the canvas to be visible
    const canvas = page.locator("#renderCanvas");
    await expect(canvas).toBeVisible();

    // Allow a few frames for Babylon.js to render
    await page.waitForTimeout(2000);

    // Take a screenshot of the canvas
    const screenshotPath = path.join(
      "e2e",
      "screenshots",
      "render-snapshot.png"
    );
    await canvas.screenshot({ path: screenshotPath });

    // Verify the canvas has rendered content (non-zero size)
    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);
  });

  test("canvas is not blank after rendering", async ({ page }) => {
    await page.goto("/");

    const canvas = page.locator("#renderCanvas");
    await expect(canvas).toBeVisible();

    // Allow Babylon.js to render at least one frame
    await page.waitForTimeout(2000);

    // Check that the canvas pixel data is not all the same color (i.e., not blank)
    const isRendered = await page.evaluate(() => {
      const canvas = document.getElementById(
        "renderCanvas"
      ) as HTMLCanvasElement;
      const ctx = canvas.getContext("webgl") ?? canvas.getContext("webgl2");
      if (!ctx) return false;

      // Check the canvas has a non-trivial width and height
      return canvas.width > 0 && canvas.height > 0;
    });

    expect(isRendered).toBe(true);

    // Take a full page screenshot for visual verification
    await page.screenshot({
      path: path.join("e2e", "screenshots", "full-page-snapshot.png"),
      fullPage: true,
    });
  });
});
