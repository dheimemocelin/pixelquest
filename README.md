# PixelQuest

**Adventures for Learning · Aventuras para Aprender**

## English

PixelQuest is an educational web game project designed to help children develop
logical reasoning, reading, and computational thinking through original 2D
adventures. The initial audience is children aged approximately 9 and up, with
activities intended to adapt to each child's learning level.

The planned experience combines exploration, visual commands, puzzles, and gentle
feedback to support independence and persistence, including for children who need
additional reading support. No timers, punishment, or competition are planned.

**Current status: repository preparation.** Engineering instructions and skills
are configured. There is no runnable application, playable game, backend,
authentication, or progress tracking yet. Planned features remain on the roadmap.

## Português brasileiro

PixelQuest é um projeto de jogos educativos para a web que pretende desenvolver
raciocínio lógico, leitura e pensamento computacional por meio de aventuras 2D
originais. O público inicial são crianças a partir de aproximadamente 9 anos,
com atividades ajustáveis ao nível de aprendizagem.

A experiência planejada combina exploração, comandos visuais, enigmas e feedback
acolhedor para estimular autonomia e persistência, inclusive para crianças que
precisam de apoio na leitura, sem cronômetros, punições ou competição.

**Estado atual: preparação do repositório.** As instruções e skills de engenharia
estão configuradas. Ainda não existem aplicação executável, jogos funcionais,
backend, autenticação ou acompanhamento de progresso. Os recursos abaixo são
planejados, não implementados.

## Planned games / Jogos planejados

### Hero's Journey — A Jornada do Herói

Build visual command sequences to guide a hero through paths, obstacles, keys,
and doors. Five planned stages introduce movement, longer sequences, debugging,
route selection, and repetition.

Construa sequências de comandos visuais para guiar um herói por caminhos,
obstáculos, chaves e portas. As cinco fases previstas introduzem movimentos,
sequências maiores, correção de comandos, escolha de caminhos e repetição.

### Temple of Words — O Templo das Palavras

Explore a temple through five planned language challenges: initial sounds,
letter–sound associations, word building, short sentences, and interpreting a
guardian's instruction. Repeatable Brazilian Portuguese audio and gradual hints
are planned; support needs should inform difficulty alongside completion.

Explore um templo em cinco desafios previstos: sons iniciais, relações entre
letras e sons, formação de palavras, frases curtas e interpretação de uma
instrução do guardião. Estão previstos áudio repetível em português brasileiro,
dicas graduais e dificuldade ajustada também à necessidade de ajuda.

## Technology / Tecnologias

Already present / Já disponível:

- Git repository, Markdown documentation, and project instructions in `AGENTS.md`.
- Seven Engineering OS skills in `.agents/skills/` and three generated Codex
  role definitions in `.codex/agents/`; see the [integration notes](docs/engineering-os/README.md).

Planned, not installed / Planejado, ainda não instalado:

- Frontend: React, TypeScript, Vite, Phaser 3, Tailwind CSS.
- Backend: Node.js, a simple HTTP API, SQLite.
- Independent game modules sharing navigation, audio, authentication, and progress.
- Automated tests for game rules, persistence, accessibility, and integration.

## Local setup / Preparação local

Git is sufficient to inspect the current repository. Obtain it with:

Git é suficiente para inspecionar o repositório atual. Obtenha o projeto com:

```bash
git clone https://github.com/dheimemocelin/pixelquest.git
cd pixelquest
git status
```

If you already have the checkout, use its existing directory instead of cloning
again. This branch has no `package.json`, dependency lockfile, application scripts,
or local server. There are currently no install, dev, build, or game-test commands.
Do not run `npm install` or `npm run dev` yet. Actual commands and environment
requirements will be documented when the application foundation is implemented.

Se você já tem o checkout, use a pasta existente. Esta branch não possui
`package.json`, lockfile, scripts da aplicação ou servidor local. Ainda não há
comandos de instalação, desenvolvimento, build ou testes dos jogos. Não execute
`npm install` ou `npm run dev` nesta etapa. Os comandos reais e requisitos de
ambiente serão documentados na implementação da fundação.

## Repository structure / Estrutura atual

```text
.agents/skills/          Engineering OS skill instructions (7)
.codex/agents/          Generated Codex role definitions (3)
docs/engineering-os/    Integration notes and upstream MIT notice
AGENTS.md               Project engineering instructions
ASSET_LICENSES.md       Asset provenance and licensing policy
LICENSE.md              MIT license for original project code
README.md               Project overview and current status
.gitignore              Local data, credentials, and build exclusions
```

## Roadmap

- [x] Configure Engineering OS skills and project instructions.
- [x] Prepare bilingual documentation and licensing for publication.
- [ ] Stage 1 — Foundation: React/TypeScript/Phaser setup, navigation, home screen,
  original hero, and visual world map. / Fundação e mapa dos mundos.
- [ ] Stage 2 — Hero's Journey: five playable stages and tested command mechanics.
  / Cinco fases funcionais e mecânicas de comandos testadas.
- [ ] Stage 3 — Temple of Words: five language stages, audio, and answer validation.
  / Cinco atividades de linguagem com áudio e validação.
- [ ] Stage 4 — Persistence, caregiver authentication, learning history, and manual
  difficulty settings. / Persistência e acompanhamento pelos responsáveis.
- [ ] Stage 5 — Broader automated tests, responsiveness, accessibility, performance,
  and validation with users. / Qualidade e validação com usuários.

Each stage requires review before advancing. Accessibility and testing apply from
the first implementation, not only at the final stage. / Cada etapa deve ser
validada antes da seguinte; acessibilidade e testes começam na implementação inicial.

## Contributing / Como contribuir

Read [AGENTS.md](AGENTS.md) before making changes. Discuss substantial features in
an issue, work in a focused branch, and submit a pull request with the problem,
scope, and checks actually performed. Do not describe unrun tests as passing.
For documentation changes, check local links and run `git diff --check`.
For future game changes, add tests for the relevant rules and failure cases.

Leia [AGENTS.md](AGENTS.md), discuta mudanças relevantes em uma issue e trabalhe em
uma branch por tarefa. No pull request, explique o problema, o escopo e as
verificações realizadas. Não afirme que testes não executados passaram. Para
documentação, confira links locais e execute `git diff --check`; para futuras
mecânicas, inclua testes das regras e casos de falha.

Keep contributions accessible, age-appropriate, and original. Do not submit
credentials, `.env` files, databases, child data, or private activity logs. The
product is intended to have no advertising, social chat, advertising trackers,
or automated medical, psychological, or educational diagnoses. External assets
require verified redistribution terms before inclusion.

Preserve acessibilidade, adequação à idade e originalidade. Não envie credenciais,
arquivos `.env`, bancos, dados de crianças ou registros privados. O produto não
prevê publicidade, chat social, rastreamento publicitário ou diagnósticos
automáticos. Recursos externos precisam de licença de redistribuição verificada.

## License / Licença

Original PixelQuest code is licensed under the [MIT License](LICENSE.md).
Copyright (c) 2026 Dheime Fernando de Oliveira Mocelin.

O código original do PixelQuest está sob a [licença MIT](LICENSE.md).
The bundled Engineering OS material retains its [upstream MIT notice](docs/engineering-os/LICENSE).
Assets are documented separately in [ASSET_LICENSES.md](ASSET_LICENSES.md);
the code license does not grant rights over unverified third-party resources.
