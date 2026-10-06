import { test, expect } from "@playwright/test";

for (const { device, width, hasTouch } of [
  { device: "desktop", width: 1440, hasTouch: false },
  { device: "tablet", width: 768, hasTouch: true },
  { device: "phone", width: 390, hasTouch: true },
]) {
  test.describe(`player profile on ${device}`, () => {
    test.use({ viewport: { width, height: 900 }, hasTouch });

    test("player switches between dino and uploaded photo with device input and keyboard", async ({ page }) => {
      await page.goto("/#about");
      const toggle = page.getByRole("button", { name: "Toggle player photo" });
      const pointerHint = page.locator(hasTouch ? ".profile-hint-touch" : ".profile-hint-mouse");
      const keyboardHint = page.locator(".profile-hint-keyboard");
      await expect(toggle).toHaveAttribute("aria-pressed", "false");
      await expect(toggle.locator(".pixel-character")).toBeVisible();
      await expect(pointerHint).toBeVisible();
      await expect(pointerHint).toHaveText(hasTouch ? "Tap the dino to meet me" : "Click the dino to meet me");
      if (hasTouch) await toggle.tap();
      else await toggle.click();
      await expect(toggle).toHaveAttribute("aria-pressed", "true");
      const photo = toggle.getByRole("img", { name: /Novian Affan Ashofah/ });
      await expect(photo).toBeVisible();
      await expect.poll(() => photo.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      await expect(toggle.locator(".pixel-character")).toHaveCount(0);
      await expect(pointerHint).toHaveText(hasTouch ? "Tap to return to the dino" : "Click to return to the dino");
      if (hasTouch) await toggle.tap();
      else await toggle.click();
      await expect(toggle).toHaveAttribute("aria-pressed", "false");
      await expect(toggle.locator(".pixel-character")).toBeVisible();

      await toggle.focus();
      await page.keyboard.press("Enter");
      await expect(toggle).toHaveAttribute("aria-pressed", "true");
      await expect(keyboardHint).toBeVisible();
      await expect(pointerHint).toBeHidden();
      await page.keyboard.press("Space");
      await expect(toggle).toHaveAttribute("aria-pressed", "false");
      await page.keyboard.press("Enter");
      await expect(toggle).toHaveAttribute("aria-pressed", "true");

      const language = page.getByRole("button", { name: "ID", exact: true });
      if (hasTouch) await language.tap();
      else await language.click();
      await expect(page.getByRole("button", { name: "Ganti tampilan player" })).toHaveAttribute("aria-pressed", "true");
      await expect(pointerHint).toBeVisible();
      await expect(pointerHint).toHaveText(hasTouch ? "Ketuk buat balik ke dino" : "Klik buat balik ke dino");
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  });
}
