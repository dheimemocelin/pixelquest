import { expect, test } from "@playwright/test";

test("adventure and temple screens fit the viewport without page scrolling", async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 667 },
    { width: 390, height: 844 },
    { width: 820, height: 1180 },
    { width: 1440, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Pequeno herói/ })).toBeVisible();
    await expectNoPageScroll(page);
    const playButton = await page.locator(".home-stage button.primary.jumbo").boundingBox();
    expect(playButton).toBeTruthy();
    expect(playButton!.y + playButton!.height).toBeLessThanOrEqual(viewport.height);

    await page.locator(".home-stage button.primary.jumbo").click();
    await expect(page.getByRole("button", { name: "Entrar na floresta" })).toBeVisible();

    await page.getByRole("button", { name: "Entrar na floresta" }).click();
    await expect(page.getByRole("heading", { name: "Primeiros Passos" })).toBeVisible();
    await expectNoPageScroll(page);
    if (viewport.width <= 760) {
      expect((await page.locator(".board-wrap").boundingBox())?.height ?? 0).toBeGreaterThan(110);
    }

    await page.getByRole("button", { name: "Voltar ao mapa" }).click();
    await page.getByRole("button", { name: "Entrar no templo" }).click();
    await expect(page.getByRole("heading", { name: "Os Sons Mágicos" })).toBeVisible();
    await expectNoPageScroll(page);
    if (viewport.width <= 760) {
      expect((await page.locator(".temple-board").boundingBox())?.height ?? 0).toBeGreaterThan(110);
    }
  }
});

test("mobile expand control enlarges the board when native fullscreen is unavailable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(Element.prototype, "requestFullscreen", {
      configurable: true,
      value: undefined,
    });
  });
  await page.goto("/");
  await page.locator(".home-stage button.primary.jumbo").click();
  await page.getByRole("button", { name: "Entrar na floresta" }).click();

  const board = page.locator(".board-wrap");
  const initialHeight = (await board.boundingBox())!.height;
  await page.getByRole("button", { name: "Ampliar área do jogo" }).click();
  await expect(page.locator(".app.page-game")).toHaveClass(/focus-mode/);
  expect((await board.boundingBox())!.height).toBeGreaterThan(initialHeight + 50);
  await expectNoPageScroll(page);

  await page.getByRole("button", { name: "Reduzir área do jogo" }).click();
  await expect(page.locator(".app.page-game")).not.toHaveClass(/focus-mode/);
});

async function expectNoPageScroll(page: import("@playwright/test").Page) {
  const dimensions = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    documentWidth: document.documentElement.scrollWidth,
    documentHeight: document.documentElement.scrollHeight,
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  expect(dimensions.documentHeight).toBeLessThanOrEqual(dimensions.viewportHeight);
}
