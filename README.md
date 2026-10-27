# PixelQuest

**Aventuras para Aprender · Adventures for Learning**

## English

PixelQuest is an educational 2D web adventure for children aged approximately 9
and up, with activities designed to support different learning levels. It develops
logical reasoning, reading, and computational thinking through exploration and
visual commands, without timers, punishment, or competition.

**Sprint 01 is playable locally:** an animated home screen, a world map, and three
Hero's Journey stages. Build and edit a command sequence, run it, collect a key,
and find the treasure. There is no backend, account system, or persistent progress.
Temple of Words remains planned.

## Português brasileiro

PixelQuest é uma aventura educativa 2D para crianças a partir de aproximadamente
9 anos, com atividades pensadas para diferentes níveis de aprendizagem. Estimula
raciocínio lógico, leitura e pensamento computacional com exploração e comandos
visuais, sem cronômetros, punições ou competição.

**A Sprint 01 é jogável localmente:** tela inicial animada, mapa dos mundos e três
fases de A Jornada do Herói. Monte e edite comandos, execute o plano, encontre uma
chave e chegue ao tesouro. Ainda não há backend, contas ou progresso persistente.
O Templo das Palavras continua planejado.

## Games / Jogos

### Hero's Journey — A Jornada do Herói (implementado)

1. **Primeiros Passos:** dois movimentos até o baú usando as setas.
2. **O Caminho da Floresta:** planejar uma rota com quatro direções e obstáculos.
3. **A Chave Perdida:** coletar a chave antes de acessar o tesouro.

As setas para frente, para trás, direita e esquerda movem Nilo uma casa na
direção escolhida. Selecione um passo para movê-lo ou retirá-lo. Cada execução começa do
ponto inicial; um erro mantém o plano para correção. Reiniciar limpa o plano.
Há dicas graduais, tentativas ilimitadas e repetição das fases concluídas.
O progresso dura apenas enquanto a página está aberta.

### Temple of Words — O Templo das Palavras (planejado)

A future language adventure: initial sounds, letter–sound associations, word
building, short sentences, and instruction comprehension. / Uma futura aventura
com sons iniciais, relações letra–som, formação de palavras, frases curtas e
compreensão de instruções. Ainda não é jogável.

## Technologies / Tecnologias

Implementadas: React 19, TypeScript, Vite 8, Phaser 3.90, Tailwind CSS 4, Vitest e
Playwright. Engineering OS permanece disponível nas sete skills e três adaptadores.
O lockfile fixa as versões instaladas. Os gráficos e sons são originais e gerados
em código; não há CDN de assets ou fontes.

Planejadas para outras sprints: API Node.js, SQLite, autenticação dos responsáveis,
persistência e histórico de aprendizagem. Node.js é usado nesta sprint apenas
pelas ferramentas de desenvolvimento.

## Run locally / Executar localmente

Requisitos: Node.js 22.12+ (validado com Node 24), npm e navegador moderno.
Na branch que contém a Sprint 01:

```bash
npm ci
npm run dev
```

Abra `http://127.0.0.1:5173`. O servidor aceita apenas conexões locais e não muda
de porta automaticamente. A sprint não foi publicada nem implantada automaticamente.

```bash
npm test                 # testes das regras
npm run build            # TypeScript + bundle em dist/
npm run preview          # build local em http://127.0.0.1:4173
npx playwright install chromium
npm run test:e2e         # inicia e encerra seu próprio Vite em loopback
```

Para E2E, encerre qualquer Vite que esteja usando a porta 5173. Chromium precisa
de suas bibliotecas de sistema no Linux; veja os limites e alternativas no
[guia da sprint](docs/sprint-01.md). Não há segredos ou `.env` obrigatórios.

**Servidor remoto/T3 Code:** veja o [procedimento com túnel SSH](docs/sprint-01.md#visualização-remota-segura).
Não exponha o Vite em `0.0.0.0` nem abra portas públicas no Lightsail.

## Accessibility and audio / Acessibilidade e áudio

Botões com símbolos e rótulos, foco visível, teclado e toque, descrição textual
do tabuleiro, ajuda modal e respeito a movimento reduzido. Música e efeitos são
opcionais, desligados por padrão. A narração em português brasileiro depende das
vozes disponíveis no navegador; instruções visuais funcionam sem ela. Não são
coletados dados de crianças. Validação de usabilidade com a criança ainda é necessária.

## Structure / Estrutura

```text
src/app/             Navegação e interface da sessão
src/games/hero/       Definições das fases, comandos, regras puras e testes
src/engine/          Cena Phaser, tabuleiro, animação e pixel art
src/components/      Canvas e ícones compartilhados
src/audio/           Música, efeitos e narração opcional
src/styles.css       Identidade visual e responsividade
src/main.tsx         Entrada React
tests/e2e/           Jornadas completas em navegador
.agents/skills/      Sete skills Engineering OS
.codex/agents/       Três adaptadores Codex
docs/                Proveniência, revisão inicial e guia da sprint
```

## Roadmap

- [x] Engineering OS, documentação bilíngue e licença MIT.
- [x] Tela inicial, mapa, personagem e floresta originais.
- [x] Três fases jogáveis com comandos, chave, dicas e feedback.
- [x] Testes de regras e jornadas em desktop/tablet; build de produção.
- [ ] Validar a Sprint 01 com o responsável e a criança.
- [ ] Expandir A Jornada do Herói com novos desafios e repetição.
- [ ] Implementar O Templo das Palavras.
- [ ] Persistência e área autenticada dos responsáveis.
- [ ] Ampliar acessibilidade e avaliação de aprendizagem com usuários.

## Contributing / Como contribuir

Read [AGENTS.md](AGENTS.md), discuss substantial changes in an issue, and work in
a focused branch. Submit a pull request with scope and checks actually performed.
Do not claim unrun tests passed. / Leia as instruções, discuta mudanças relevantes
e use uma branch por tarefa. Informe o escopo e as verificações reais no PR.

Run `npm test`, `npm run build` and relevant browser tests for gameplay changes.
Check local documentation links and `git diff --check`. Keep contributions
accessible, age-appropriate, and original. Do not submit credentials, `.env`,
databases, child data, or private logs. External assets require verified licenses.
No advertising, social chat, advertising trackers, or automated diagnoses.

## License / Licença

Original PixelQuest code is licensed under the [MIT License](LICENSE.md).
Copyright (c) 2026 Dheime Fernando de Oliveira Mocelin.

O código e os gráficos/sons originais do PixelQuest estão sob MIT. O material
Engineering OS mantém sua [licença MIT original](docs/engineering-os/LICENSE).
Veja [ASSET_LICENSES.md](ASSET_LICENSES.md) para origem e condições dos recursos.
