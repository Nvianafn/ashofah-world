import { test, expect } from "@playwright/test";

test("dino waves, walks, jumps and keeps a visible frame with reduced motion", async ({ page }) => {
  await page.goto("/");
  const dino = page.locator(".game-player .pixel-character");
  await expect(dino).toHaveAttribute("data-pose", "wave");
  await page.getByRole("button", { name: "Start Adventure" }).click();
  await page.keyboard.down("ArrowRight");
  await expect(dino).toHaveAttribute("data-pose", "walk");
  await page.keyboard.press("Space");
  await expect(dino).toHaveAttribute("data-pose", "jump");
  await page.keyboard.up("ArrowRight");
  await expect(dino).toHaveAttribute("data-pose", "idle");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator(".world-choice").first().click();
  const greeting = page.locator(".console-screen .pixel-character");
  await expect(greeting).toHaveAttribute("data-pose", "wave");
  const visible = await greeting.locator(".dino-frame").evaluateAll((frames) =>
    frames.filter((frame) => getComputedStyle(frame).visibility === "visible").length,
  );
  expect(visible).toBe(1);
});
