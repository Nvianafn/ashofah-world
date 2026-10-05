import { test, expect, type Page } from "@playwright/test";

async function visitWorld(page: Page, index: number) {
  await page.locator(".world-choice").nth(index).click();
  await expect(page.locator(".world-panel:visible")).toHaveAttribute(
    "id",
    ["about", "stack", "projects", "contact"][index],
  );
}

test("direct navigation, unique progress, translations, and deep links", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".hero-hud")).toContainText("00/04");
  await expect(page.locator(".sound-toggle")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  for (let i = 0; i < 4; i++) await visitWorld(page, i);
  await expect(page.locator(".hero-hud")).toContainText("04/04");
  await visitWorld(page, 2);
  await expect(page.locator(".hero-hud")).toContainText("04/04");
  await expect(page.locator(".quest-card")).toHaveCount(6);
  await page.getByRole("button", { name: "ID", exact: true }).click();
  await expect(page.locator("#quests-title")).toHaveText("Quest Proyek");
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  await page.reload();
  await expect(page.locator("#projects")).toBeVisible();
  await expect(page.locator("#quests-title")).toHaveText("Quest Proyek");
  await expect(page.locator(".hero-hud")).toContainText("01/04");
  await page.goto("/#stack");
  await expect(page.locator("#stack")).toBeVisible();
  await expect(page.locator(".tech")).toHaveCount(14);
  expect(errors).toEqual([]);
});

test("project dialog, carousel, honest illustrations, focus trap and restoration", async ({
  page,
}) => {
  await page.goto("/#projects");
  const trigger = page.locator(".quest-cover").first();
  await trigger.click();
  const dialog = page.getByRole("dialog", {
    name: "YASU Project",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".project-image img")).toBeVisible();
  await dialog.getByRole("button", { name: "Next screenshot" }).click();
  await expect(dialog.locator(".carousel-count")).toHaveText(
    "Screenshot 2 / 3",
  );
  await dialog.getByRole("button", { name: "Previous screenshot" }).click();
  await expect(dialog.locator(".carousel-count")).toHaveText(
    "Screenshot 1 / 3",
  );
  await dialog.locator(".pm-links a").last().focus();
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(() =>
      document.activeElement?.closest("dialog")?.hasAttribute("open"),
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.locator(".quest-cover").nth(1).click();
  await expect(page.getByRole("dialog").locator(".pixel-cover")).toContainText(
    "Illustration · Screenshot coming soon",
  );
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.locator(".quest-cover").nth(1)).toBeFocused();
});

test("all four checkpoints open through actual movement and jump collision", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start Adventure" }).click();
  for (let i = 0; i < 4; i++) {
    const target = [23.5, 41, 58.5, 76][i];
    await page.locator(".game-arena").focus();
    await page.keyboard.down("ArrowRight");
    await expect
      .poll(
        async () =>
          page
            .locator(".game-player")
            .evaluate((el) => parseFloat((el as HTMLElement).style.left)),
        { intervals: [16], timeout: 6000 },
      )
      .toBeGreaterThanOrEqual(target - 1);
    await page.keyboard.up("ArrowRight");
    await page.keyboard.press("Space");
    await expect(page.locator(".world-panel:visible")).toHaveAttribute(
      "id",
      ["about", "stack", "projects", "contact"][i],
    );
    await expect(page.locator(".hero-hud")).toContainText(`0${i + 1}/04`);
  }
  await expect(page.locator(".question-block.collected")).toHaveCount(4);
});

test("terminal commands, history, autocomplete, project links, and contact checkpoint", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open secret terminal" });
  await trigger.click();
  const input = page.getByRole("textbox", { name: "Terminal command" });
  const output = page.locator(".term-body");
  for (const command of [
    "help",
    "ls",
    "cat about.txt",
    "tree",
    "cd projects",
  ]) {
    await input.fill(command);
    await input.press("Enter");
  }
  await expect(output).toContainText("Novian Affan Ashofah");
  await expect(output).toContainText("yasu-project/");
  await input.press("ArrowUp");
  await expect(input).toHaveValue("cd projects");
  await input.fill("cd yasu");
  await input.press("Tab");
  await expect(input).toHaveValue("cd yasu-project");
  const playerX = await page.locator(".game-player").getAttribute("style");
  await input.press("ArrowLeft");
  expect(await page.locator(".game-player").getAttribute("style")).toBe(
    playerX,
  );
  await input.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Close", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await input.fill("open yasu-project");
  await page.context().route("https://yasu-project.com/**", (route) =>
    route.fulfill({
      contentType: "text/plain",
      body: "Project link destination test",
    }),
  );
  const popupPromise = page.waitForEvent("popup");
  await input.press("Enter");
  const popup = await popupPromise;
  await expect.poll(() => popup.url()).toContain("yasu-project.com");
  await popup.close();
  await page
    .getByRole("button", { name: "$ sudo hire-me", exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.locator("#contact")).toBeVisible();
});

test("activity API failure never creates fake contributions; real results are summed", async ({
  page,
}) => {
  let success = false;
  await page.route("**/github-contributions-api.jogruber.de/**", (route) =>
    route.fulfill(
      success
        ? {
            json: {
              contributions: [
                { date: "2026-10-01", count: 2, level: 1 },
                { date: "2026-10-02", count: 5, level: 3 },
              ],
            },
          }
        : { status: 503, body: "Unavailable" },
    ),
  );
  await page.goto("/#projects");
  await expect(page.locator(".activity-message")).toContainText(
    "No estimated activity is shown",
  );
  await expect(page.locator(".graph")).toHaveCount(0);
  success = true;
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.locator(".contrib-head")).toContainText(
    "7 contributions in this period",
  );
  await expect(page.locator(".graph .cell")).toHaveCount(2);
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`all worlds fit ${width}px and reduced motion retains navigation`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    for (let i = 0; i < 4; i++) {
      await visitWorld(page, i);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
    if (width < 600) {
      const controls = page.locator(".touch-controls");
      await controls.getByRole("button", { name: "Move left" }).focus();
      const before = await page
        .locator(".game-player")
        .evaluate((el) => parseFloat((el as HTMLElement).style.left));
      await page.keyboard.down("Enter");
      await expect
        .poll(() =>
          page
            .locator(".game-player")
            .evaluate((el) => parseFloat((el as HTMLElement).style.left)),
        )
        .toBeLessThan(before);
      await page.keyboard.up("Enter");
    }
  });
}

test("mobile pointer controls, focus isolation, and opt-in sound", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const sound = page.locator(".sound-toggle");
  await expect(sound).toHaveAttribute("aria-pressed", "false");
  await sound.click();
  await expect(sound).toHaveAttribute("aria-pressed", "true");
  await sound.click();
  const button = page
    .locator(".touch-controls")
    .getByRole("button", { name: "Move right" });
  const rect = await button.boundingBox();
  if (!rect) throw new Error("Mobile controls are not visible");
  await button.scrollIntoViewIfNeeded();
  const visibleRect = (await button.boundingBox())!;
  await page.mouse.move(
    visibleRect.x + visibleRect.width / 2,
    visibleRect.y + visibleRect.height / 2,
  );
  await page.mouse.down();
  await expect
    .poll(() =>
      page
        .locator(".game-player")
        .evaluate((el) => parseFloat((el as HTMLElement).style.left)),
    )
    .toBeGreaterThan(12);
  await page.mouse.up();
  await page.locator(".world-choice").first().focus();
  const position = await page.locator(".game-player").getAttribute("style");
  await page.keyboard.press("ArrowRight");
  expect(await page.locator(".game-player").getAttribute("style")).toBe(
    position,
  );
});
