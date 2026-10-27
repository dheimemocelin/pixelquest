import { expect, test, type Page } from "@playwright/test";

async function enterTemple(page: Page) {
  await page.goto("/");
  await page.locator(".home-stage button.primary.jumbo").click();
  await page.getByRole("button", { name: "Entrar no templo", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Os Sons Mágicos" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test("complete all five language adventures", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await enterTemple(page);
  await page.getByRole("button", { name: "Ouvir instrução" }).click();
  await page.getByRole("button", { name: "Escolher BOLA", exact: true }).click();
  await page.getByRole("button", { name: "Continuar aventura" }).click();

  await expect(page.getByRole("heading", { name: "As Letras Perdidas" })).toBeVisible();
  await page.getByRole("button", { name: "Escolher G", exact: true }).click();
  await page.getByRole("button", { name: "Continuar aventura" }).click();

  await expect(page.getByRole("heading", { name: "A Palavra Secreta" })).toBeVisible();
  for (const letter of ["B", "O", "L", "A"])
    await page.getByRole("button", { name: `Usar letra ${letter}`, exact: true }).click();
  await page.getByRole("button", { name: "Conferir", exact: true }).click();
  await page.getByRole("button", { name: "Continuar aventura" }).click();

  await expect(page.getByRole("heading", { name: "A Porta Encantada" })).toBeVisible();
  await page.getByRole("button", { name: "Escolher DORME", exact: true }).click();
  await page.getByRole("button", { name: "Continuar aventura" }).click();

  await expect(page.getByRole("heading", { name: "O Enigma do Guardião" })).toBeVisible();
  await page.getByRole("button", { name: "CHAVE", exact: true }).click();
  await page.getByRole("button", { name: "PORTA", exact: true }).click();
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
  await expect(page.getByText("Escute o primeiro som de cada palavra.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Escolher LUA" })).toHaveCount(0);
  await page.getByRole("button", { name: "Escolher BOLA", exact: true }).click();
  await page.getByRole("button", { name: "Continuar aventura" }).click();
  await expect(page.getByRole("heading", { name: "As Letras Perdidas" })).toBeVisible();
  await expect(page.getByText("Diga “gato” devagar e preste atenção ao primeiro som.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Escolher P" })).toHaveCount(0);
});
