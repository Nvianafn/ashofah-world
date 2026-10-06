import { test, expect } from "@playwright/test";

test("returning to the visible arena resumes keyboard controls without Continue", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Start Adventure" }).click();
  await page.locator(".question-block").nth(2).click();
  await expect(page.locator("#projects")).toBeFocused();
  const arena = page.locator(".game-arena");
  await arena.scrollIntoViewIfNeeded();
  const player = page.locator(".game-player");
  const before = await player.evaluate((el) => parseFloat((el as HTMLElement).style.left));
  await page.keyboard.down("ArrowRight");
  await expect.poll(() => player.evaluate((el) => parseFloat((el as HTMLElement).style.left))).toBeGreaterThan(before + 1);
  await page.keyboard.up("ArrowRight");
  await expect(arena).toBeFocused();
});

test("blocks release one coin each and repeated visits do not duplicate rewards", async ({ page }) => {
  await page.goto("/");
  const block = page.locator(".question-block").first();
  await block.click();
  await expect(page.locator(".coin-counter")).toContainText("1/04");
  await expect(page.locator(".coin-burst")).toBeVisible();
  await expect(block).toHaveClass(/collected/);
  await expect(page.locator(".coin-burst")).toHaveCount(0);
  await block.click();
  await expect(page.locator(".coin-counter")).toContainText("1/04");
  await expect(page.locator(".coin-burst")).toHaveCount(0);
  for (let i = 1; i < 4; i++) await page.locator(".question-block").nth(i).click();
  await expect(page.locator(".coin-counter")).toContainText("4/04");
});

for (const width of [1440, 390]) {
  test(`pipe blocks walking, supports landing and jumping, and allows entry at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: "Start Adventure" }).click();
    const arena = page.locator(".game-arena");
    const player = page.locator(".game-player");
    const x = () => player.evaluate((el) => parseFloat((el as HTMLElement).style.left) * 10);
    const y = () => player.evaluate((el) => parseFloat((el as HTMLElement).style.bottom));
    const bounds = await page.evaluate(() => {
      const inner = document.querySelector<HTMLElement>(".arena-inner")!;
      const pipe = document.querySelector<HTMLElement>(".secret-pipe")!;
      const player = document.querySelector<HTMLElement>(".game-player")!;
      const center = parseFloat(pipe.style.left) * 10;
      return { center, edge: center - (pipe.offsetWidth + player.offsetWidth) / inner.clientWidth * 500, top: 48 + pipe.offsetHeight };
    });
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await page.keyboard.down("ArrowRight");
    await expect.poll(x, { timeout: 7000, intervals: [16] }).toBeGreaterThanOrEqual(bounds.edge - 0.1);
    // Keep holding against the wall: the character cannot walk through the pipe.
    await expect.poll(x).toBeLessThanOrEqual(bounds.edge + 0.1);
    await page.keyboard.press("Space");
    await expect.poll(x, { timeout: 3000, intervals: [16] }).toBeGreaterThanOrEqual(bounds.center - 2);
    await page.keyboard.up("ArrowRight");
    await expect.poll(y, { intervals: [16] }).toBe(bounds.top);
    await expect(player.locator(".pixel-character")).toHaveAttribute("data-pose", "idle");
    // A grounded player on the pipe can jump again, rather than being stuck airborne.
    await page.keyboard.press("Space");
    await expect.poll(y, { intervals: [16] }).toBeGreaterThan(bounds.top + 10);
    await expect.poll(y, { intervals: [16] }).toBe(bounds.top);
    if (width === 390) {
      await page.locator(".touch-controls").getByRole("button", { name: "Enter pipe" }).click();
    } else {
      await arena.focus();
      await page.keyboard.press("ArrowDown");
    }
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await arena.focus();
    await page.keyboard.down("ArrowLeft");
    await expect.poll(x, { intervals: [16] }).toBeLessThan(bounds.edge - 10);
    await page.keyboard.up("ArrowLeft");
    await expect.poll(y, { intervals: [16] }).toBe(48);
  });
}
