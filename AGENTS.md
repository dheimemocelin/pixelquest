# PixelQuest — instruções de engenharia

## Produto e escopo

PixelQuest — Aventuras para Aprender: universo de aventuras educativas 2D em
português brasileiro para crianças a partir de aproximadamente 9 anos, com
atividades ajustáveis ao nível de aprendizagem. Priorizar autonomia, persistência, acessibilidade e privacidade.

Stack prevista: React, TypeScript, Vite, Phaser 3 e Tailwind CSS; Node.js, API HTTP
e SQLite. Não instalar dependências ou serviços antes de serem necessários.

Esta entrega configura somente o Engineering OS. A implementação da Etapa 1
aguarda solicitação do usuário. Depois dela, aguardar validação antes das demais
etapas: Jornada do Herói, Templo das Palavras, acompanhamento e qualidade.

## Skills

Antes de implementar, localizar e ler `.agents/skills/<nome>/SKILL.md`. Usar
`engineering-os` para planejamento transversal e carregar apenas as especialistas
relevantes. As instruções do usuário e os limites do ambiente prevalecem.

- `engineering-os`: descoberta, escopo, critérios de aceite e sequência de entrega.
- `software-engineering`: arquitetura, módulos, mecânicas, API, testes e manutenção.
- `ui-ux-design`: experiência infantil, pixel art original, navegação e acessibilidade.
- `git-quality`: branches, revisão de diferenças, validação e commits.
- `fde-delivery`: restrições do Lightsail, validação com responsável e entrega por etapas.
- `data-engineering`: disponível para futuras métricas e histórico de aprendizagem.
- `ai-engineering`: disponível para tarefas futuras que justifiquem IA; não adicionar
  modelos, APIs pagas ou chamadas externas por padrão.

Os papéis oficiais gerados ficam em `.codex/agents/`. A existência desses arquivos
não comprova disponibilidade no T3 Code. Trabalhar diretamente para tarefas pequenas;
respeitar as regras de delegação da sessão. O papel `quality_reviewer` não impõe
sandbox somente leitura por si só.

## Fluxo de trabalho

1. Inspecionar diretório, instruções, Git, dependências e alterações existentes.
2. Planejar antes de editar; definir escopo e critérios de aceite proporcionais.
3. Preferir o menor incremento funcional, módulos coesos e contratos explícitos.
4. Validar mecânicas com testes de sequência, colisão, conclusão, repetição,
   desbloqueio e persistência conforme forem implementadas. Não simular funcionalidades.
5. Executar verificações relevantes e revisar o diff; informar testes não executados.
6. Registrar mudanças e evidências em commits por tarefa, em branches isoladas.

Não sobrescrever trabalho existente nem modificar outros projetos ou serviços do
servidor. Não fazer merge, deploy, push, force-push ou criar remoto automaticamente.
Verificar autenticação e autorização antes de qualquer publicação. Commits locais
por tarefa estão autorizados. Nunca versionar credenciais, bancos, dados infantis,
logs privados ou `.env`; usar variáveis de ambiente e exemplos sem segredos.

## Qualidade educacional e segurança

- Interface infantil deve parecer um jogo: mapa visual, comandos grandes, pouco
  texto, áudio repetível, foco visível, teclado, contraste e movimento reduzido.
- Sem cronômetros, punição por erros ou comparação entre crianças; tentativas
  ilimitadas, dicas graduais e feedback positivo com estímulos moderados.
- Dificuldade deve considerar ajuda utilizada, além da conclusão das fases.
- Personagens, cenários e sons originais. Não adicionar publicidade, chat,
  funcionalidades sociais ou rastreamento publicitário.
- Usar apelido e coleta mínima; proteger a área dos responsáveis com autenticação.
  Não produzir diagnósticos médicos, psicológicos ou educacionais.

## Configuração e manutenção

Origem, versão, instalação e evidências: `docs/engineering-os/README.md`.
As skills são cópias versionadas da origem. Atualizar deliberadamente, revisar
diferenças e preservar a licença; não instalar outra cópia global desta coleção.
