# Sprint 01 — Primeira aventura jogável

## Escopo e direção visual

Público: crianças a partir de aproximadamente 9 anos, com atividades curtas e apoio
à leitura. Entrega: início, mapa e três fases de A Jornada do Herói. O Templo das
Palavras é apenas anunciado, sem botão de entrada. Sem backend ou autenticação.

Floresta ao entardecer, verde profundo, caminhos de areia e detalhes dourados.
Nilo é o companheiro original do jogador. Pixel art em código, ícones geométricos,
fontes do sistema e uma única paleta. Não há downloads de imagens, fontes ou áudio.

A jornada é início → mapa → fase → próxima fase ou mapa. As quatro setas movem Nilo
uma casa na direção selecionada. As fases introduzem rotas com obstáculos e uma chave. Sem contagem regressiva,
perda de pontos ou limite de tentativas. Dicas em três níveis permanecem disponíveis.

## Arquitetura

- `src/app/App.tsx`: navegação, estado da sessão, sequência editável e feedback.
- `src/games/hero/types.ts`: contratos das fases, comandos e estados.
- `src/games/hero/levels.ts`: três fases definidas por dados.
- `src/games/hero/rules.ts`: transições puras, colisões, chave e vitória.
- `src/engine/AdventureScene.ts`: tabuleiro e execução animada com Phaser 3.
- `src/engine/art.ts`: gráficos originais gerados em memória.
- `src/components/`: canvas e ícones compartilhados.
- `src/audio/audio.ts`: síntese sonora opcional e narração do navegador.
- `src/styles.css`: identidade visual, responsividade e movimento reduzido.
- `tests/e2e/`: navegação e conclusão das fases em navegador.

A lógica determina cada passo antes de animar. A interface destaca o comando em
execução e impede edições enquanto Nilo anda. Reiniciar e navegar cancelam a
execução atual. Toda execução começa no ponto inicial; um erro preserva o plano
para edição. Reiniciar limpa o plano. Viradas não deslocam o personagem.

A seta aos pés de Nilo e o texto de direção indicam sua orientação. O tabuleiro
visual tem descrição textual disponível. Botões nativos suportam teclado e toque;
a ajuda usa um diálogo modal com Escape. `prefers-reduced-motion` reduz deslocamentos
animados e desativa partículas. Não há autoplay de som.

## Dados, áudio e limites

O progresso fica somente em memória durante a sessão. Atualizar a página reinicia
as fases e as recompensas. Não são coletados nomes, dados infantis ou telemetria.

A música e os efeitos são síntese Web Audio original. A narração usa Web Speech
com `pt-BR`, dependendo das vozes e permissões do navegador/sistema operacional.
Não há garantia de voz em todos os dispositivos; um aviso informa indisponibilidade
detectada. Missão, setas, dicas e descrição do caminho continuam funcionais sem voz.
A qualidade sonora precisa ser confirmada por escuta em um dispositivo real.

Phaser fica em um chunk separado (~318 KB gzip). O bundler avisa que ele excede
500 KB antes de compressão. É a engine completa da sprint; não é erro de build.

## Verificação

- `npm test`: quatro direções, colisão, execução, chave, vitória e reset.
- `npm run build`: TypeScript estrito e bundle Vite.
- `npm run test:e2e`: Chromium, desktop 1440 × 1000 e tablet 820 × 1180.
- E2E: fases completas, bloqueio sem chave, edição e remoção de passos, dicas,
  reinício, repetição da fase atual, diálogo, áudio e alternativa à voz.
- Console e exceções são verificados no percurso completo. Capturas e traces ficam
  em `test-results/`, ignorado pelo Git. Isso não substitui validação com a criança.

O servidor de teste abre somente em `127.0.0.1` e é encerrado pelo Playwright.
Em Linux mínimo, o Chromium pode exigir bibliotecas gráficas adicionais. Não use
instaladores de dependências com privilégios no servidor compartilhado sem avaliar
seu impacto. É possível rodar os testes num computador de desenvolvimento com as
bibliotecas do Chromium, ou extrair pacotes oficiais em uma pasta local e usar
`LD_LIBRARY_PATH` somente para o processo de teste.

## Visualização remota segura

No terminal do projeto pelo T3 Code:

```bash
npm ci
npm run dev
```

O Vite escuta somente em `127.0.0.1:5173`, com porta estrita. Se já estiver ocupada,
o comando falha em vez de alterar outro serviço. Não usar `--host 0.0.0.0` nem
abrir portas no firewall do Lightsail.

Se o navegador integrado do T3 executar no mesmo servidor, abrir
`http://127.0.0.1:5173`. Se executar no seu computador, use um túnel SSH local em
outro terminal do seu computador, substituindo os placeholders:

```bash
ssh -N -L 127.0.0.1:5173:127.0.0.1:5173 USUARIO@SEU_SERVIDOR
```

Use a autenticação SSH já configurada. Abra `http://127.0.0.1:5173` no navegador
local. O túnel usa a conexão SSH existente, sem publicar a porta da aplicação.
Encerre Vite e túnel com Ctrl+C. Não confundir o localhost do computador com o do
servidor; a localização do navegador integrado depende da instalação do T3.
