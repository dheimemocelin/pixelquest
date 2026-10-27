import { expect, test, type Page } from "@playwright/test";
const names = { U: "Para frente", D: "Para trás", L: "Esquerda", R: "Direita" };
async function add(page: Page, sequence: string) {
  for (const c of sequence)
    await page
      .getByRole("button", {
        name: `Adicionar ${names[c as keyof typeof names]}`,
        exact: true,
      })
      .click();
}
async function enter(page: Page) {
  await page.goto("/");
  await page
    .getByRole("button", { name: "JOGAR", exact: false })
    .filter({ hasText: "JOGAR" })
    .first()
    .click();
  await page.getByRole("button", { name: "Entrar na floresta" }).click();
  await expect(page.locator("canvas")).toHaveCount(1);
}
test("complete the three adventures through the real interface", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Pequeno herói/ }),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath("home.png"), fullPage: true });
  await page
    .getByRole("button", { name: "JOGAR", exact: false })
    .filter({ hasText: "JOGAR" })
    .first()
    .click();
  await expect(page.getByText("EM BREVE")).toBeVisible();
  await page.getByRole("button", { name: "Entrar na floresta" }).click();
  await expect(
    page.getByRole("button", { name: "Fase 2:", exact: false }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Fase 1: Primeiros Passos", exact: true })
    .click();
  await add(page, "RR");
  await page.getByRole("button", { name: "EXECUTAR", exact: true }).click();
  await expect(
    page.getByText("Você encontrou o tesouro!", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Próxima aventura" }).click();
  await add(page, "RRUURR");
  await page.getByRole("button", { name: "EXECUTAR", exact: true }).click();
  await expect(
    page.getByText("Você encontrou o tesouro!", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Próxima aventura" }).click();
  // A shortcut cannot skip the key.
  await add(page, "RRR");
  await page.getByRole("button", { name: "EXECUTAR", exact: true }).click();
  await expect(
    page.getByText("A chave vem primeiro. Vamos procurá-la?"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reiniciar", exact: true }).click();
  await add(page, "UURRRDD");
  await page.screenshot({ path: info.outputPath("game.png"), fullPage: true });
  await page.getByRole("button", { name: "EXECUTAR", exact: true }).click();
  await expect(
    page.getByText("Chave encontrada", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Você encontrou o tesouro!", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Voltar ao mapa", exact: true })
    .last()
    .click();
  await expect(page.getByText("3 de 3 tesouros encontrados")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
test("editing, hints, restart during playback, help and narration fallback", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enter(page);
  await page.getByRole("button", { name: "Uma dica" }).click();
  await expect(page.getByText("Dica 1 de 3")).toBeVisible();
  await page.getByRole("button", { name: "Uma dica" }).click();
  await expect(page.getByText("Dica 2 de 3")).toBeVisible();
  await add(page, "UUU");
  await page
      .getByRole("button", { name: "Passo 2: Para frente", exact: true })
    .click();
  await page.getByRole("button", { name: "Mover passo para antes" }).click();
  await page.getByRole("button", { name: "Retirar", exact: true }).click();
  await expect(
    page
      .getByRole("list", { name: "Sequência de comandos" })
      .getByRole("button"),
  ).toHaveCount(2);
  await page.getByRole("button", { name: "EXECUTAR", exact: true }).click();
  await page.getByRole("button", { name: "Reiniciar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "EXECUTAR", exact: true }),
  ).toBeDisabled();
  await expect(page.getByText("Um novo começo. Vamos tentar?")).toBeVisible();
  await add(page, "R");
  await page.getByRole("button", { name: "EXECUTAR", exact: true }).click();
  await expect(
    page.getByText("Quase lá! Você pode acrescentar ou mudar comandos."),
  ).toBeVisible();
  await add(page, "R");
  await page.getByRole("button", { name: "EXECUTAR", exact: true }).click();
  await expect(
    page.getByText("Você encontrou o tesouro!", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Como jogar", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(window, "speechSynthesis", {
      value: { getVoices: () => [{ lang: "en-US" }], cancel: () => {} },
      configurable: true,
    });
  });
  await page.getByRole("button", { name: "Ouvir instrução" }).click();
  await expect(page.getByText(/A voz não está disponível/)).toBeVisible();
  await page.getByRole("button", { name: "Ativar música e efeitos" }).click();
  await expect(
    page.getByRole("button", { name: "Desativar música e efeitos" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Desativar música e efeitos" })
    .click();
});
