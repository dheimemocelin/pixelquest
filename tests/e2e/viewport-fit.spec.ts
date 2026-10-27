import { expect, test } from "@playwright/test";

test("opening, world map and adventures fit the viewport without page scrolling", async ({ page }) => {
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

    await page.locator(".home-stage button.primary.jumbo").click();
    await expect(page.getByRole("button", { name: "Entrar na floresta" })).toBeVisible();
    await expectNoPageScroll(page);
    if (viewport.width <= 760) {
      const forest = await page.locator(".forest-node").boundingBox();
      const temple = await page.locator(".temple-node").boundingBox();
      const back = await page.locator(".back-map").boundingBox();
      expect(forest && temple && back).toBeTruthy();
      expect(forest!.y + forest!.height).toBeLessThanOrEqual(temple!.y + 1);
      expect(temple!.y + temple!.height).toBeLessThanOrEqual(back!.y + 1);
    }

    await page.getByRole("button", { name: "Entrar na floresta" }).click();
    await expect(page.getByRole("heading", { name: "Primeiros Passos" })).toBeVisible();
    await expectNoPageScroll(page);

    await page.getByRole("button", { name: "Voltar ao mapa" }).click();
    await page.getByRole("button", { name: "Entrar no templo" }).click();
    await expect(page.getByRole("heading", { name: "Os Sons Mágicos" })).toBeVisible();
    await expectNoPageScroll(page);
  }
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
