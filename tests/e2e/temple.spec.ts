import { expect, test, type Page } from "@playwright/test";

async function enterTemple(page: Page) {
  await page.goto("/");
  await page.locator(".home-stage button.primary.jumbo").click();
  await page.getByRole("button", { name: "Entrar no templo", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Os Sons Mágicos" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth && document.documentElement.scrollHeight <= window.innerHeight)).toBe(true);
  expect((await page.locator(".temple-board").boundingBox())?.height ?? 0).toBeGreaterThan(80);
}

test("complete all five language adventures", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await enterTemple(page);
  await page.screenshot({ path: info.outputPath("temple-stage-1.png") });
  await page.getByRole("button", { name: "Ouvir instrução" }).click();
  await page.getByRole("button", { name: "Escolher BOLA", exact: true }).click();
  await page.getByRole("button", { name: "Escolher BOCA", exact: true }).click();
  await page.getByRole("button", { name: "Conferir palavras", exact: true }).click();
  await page.getByRole("button", { name: "Continuar aventura" }).click();

  await expect(page.getByRole("heading", { name: "As Letras Perdidas" })).toBeVisible();
  await page.getByRole("button", { name: "Usar letra G", exact: true }).click();
  await page.getByRole("button", { name: "Usar letra T", exact: true }).click();
  await page.getByRole("button", { name: "Conferir", exact: true }).click();
  await page.getByRole("button", { name: "Continuar aventura" }).click();

  await expect(page.getByRole("heading", { name: "A Palavra Secreta" })).toBeVisible();
  for (const letter of ["B", "O", "L", "A"])
    await page.getByRole("button", { name: `Usar letra ${letter}`, exact: true }).click();
  await page.getByRole("button", { name: "Conferir", exact: true }).click();
  await page.getByRole("button", { name: "Continuar aventura" }).click();

  await expect(page.getByRole("heading", { name: "A Porta Encantada" })).toBeVisible();
  await page.getByRole("button", { name: "Escolher UMA PLANTA", exact: true }).click();
  await page.getByRole("button", { name: "Continuar aventura" }).click();

  await expect(page.getByRole("heading", { name: "O Enigma do Guardião" })).toBeVisible();
  await page.getByRole("button", { name: "CHAVE", exact: true }).click();
  await page.getByRole("button", { name: "PORTA", exact: true }).click();
  await page.getByRole("button", { name: "ESTRELA", exact: true }).click();
  await page.getByRole("button", { name: /^Concluir aventura/ }).click();
  await expect(page.getByText("5 de 5 selos encontrados")).toBeVisible();
  await page.getByRole("button", { name: "Entrar no templo", exact: true }).click();
  await page.getByRole("button", { name: "Desafio 2: As Letras Perdidas" }).click();
  await expect(page.getByRole("heading", { name: "As Letras Perdidas" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("offers visual support after a mistake and carries it into the next stage", async ({ page }) => {
  await enterTemple(page);
  await page.getByRole("button", { name: "Escolher SAPO", exact: true }).click();
  await page.getByRole("button", { name: "Conferir palavras", exact: true }).click();
  await expect(page.getByText("Compare o primeiro som de cada palavra.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Escolher LUA" })).toHaveCount(0);
  await page.getByRole("button", { name: "Escolher BOLA", exact: true }).click();
  await page.getByRole("button", { name: "Escolher BOCA", exact: true }).click();
  await page.getByRole("button", { name: "Conferir palavras", exact: true }).click();
  await page.getByRole("button", { name: "Continuar aventura" }).click();
  await expect(page.getByRole("heading", { name: "As Letras Perdidas" })).toBeVisible();
  await expect(page.getByText("Fale GATO devagar e escute os sons que faltam.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Usar letra R" })).toHaveCount(0);
});

test("arrow keys navigate temple answers and fullscreen can be toggled", async ({ page }) => {
  await enterTemple(page);
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("button", { name: "Escolher BOLA" })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("button", { name: "Escolher BOCA" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Escolher BOCA" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Ativar tela cheia" }).click();
  await expect(page.getByRole("button", { name: "Sair da tela cheia" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Sair da tela cheia" }).click();
  await expect(page.getByRole("button", { name: "Ativar tela cheia" })).toHaveAttribute("aria-pressed", "false");
});
