# Engineering OS no PixelQuest

As skills são ferramentas de desenvolvimento. Não implementam funcionalidades dos
jogos nem adicionam dependências à aplicação.

## Origem e licença

- Repositório: https://github.com/dheimemocelin/skill
- Revisão atualizada: `c5a80af9762ac90b3436279b57d18fe4fdd815ec` (2026-10-28).
- [Instruções oficiais de instalação](https://github.com/dheimemocelin/skill/blob/c5a80af9762ac90b3436279b57d18fe4fdd815ec/README.md).
- [Adaptador Codex](https://github.com/dheimemocelin/skill/blob/c5a80af9762ac90b3436279b57d18fe4fdd815ec/adapters/codex/README.md).
- [Licença MIT original](LICENSE) e [atribuições da origem](SOURCES.md).

As sete skills foram atualizadas a partir da origem e os três adaptadores Codex
foram regenerados pelo script oficial da revisão indicada. A skill `git-quality`
inclui a referência opcional de entrega de PR publicada pela origem. A licença MIT
permite a redistribuição, preservados seu copyright e texto de permissão.

O Harness Lite v1 também está disponível na origem, mas é uma ferramenta CLI
Python separada, não uma skill, agente ou dependência do PixelQuest. Para usá-lo,
clone o repositório de skills e execute os comandos a partir da raiz desse clone,
apontando `--workspace` para o PixelQuest. Ele requer Python 3.11 ou superior,
usa somente a biblioteca padrão e grava o estado local em `.harness/`; não instala
dependências no app nem chama provedores de IA.

## Uso

As instruções do projeto ficam em `AGENTS.md`. Carregar somente as skills relevantes:

- Preferenciais: `engineering-os`, `software-engineering`, `ui-ux-design`,
  `git-quality` e `fde-delivery`.
- Disponíveis para necessidades futuras: `data-engineering` e `ai-engineering`.

Cada instrução está em `.agents/skills/<nome>/SKILL.md`. Os papéis gerados em
`.codex/agents/` são `software_engineer`, `ai_engineer` e `quality_reviewer`.
A disponibilidade desses papéis depende do cliente e da confiança do projeto.
O papel de revisão não impõe permissões somente leitura: isso depende do ambiente.

## Atualização e validação

Obter uma revisão explícita do repositório de origem e, a partir da raiz dessa
cópia, gerar em um diretório temporário vazio:

```bash
python3 scripts/build_agent_adapters.py --target codex --output ./staging-codex
python3 scripts/validate_skills.py
python3 -m unittest discover -s tests -v
```

Esses scripts pertencem ao repositório de origem; não estão incluídos no PixelQuest.
Usar Python 3.11 ou superior para executar também os testes TOML. Revisar o diff
antes de copiar `.agents/skills/` e `.codex/agents/` gerados. Preservar instruções
locais, licença e atribuições, e registrar a nova revisão. Não sobrescrever
configurações existentes nem instalar cópias globais duplicadas.

Na atualização de 2026-10-28, o validador oficial reconheceu as sete skills e os
38 testes da origem passaram com Python 3.12.3. O Harness também completou uma
verificação somente de leitura do README no workspace PixelQuest. Os arquivos de
skill e os três TOMLs de agente foram regenerados e revisados; a disponibilidade
em outros clientes ou a execução dos papéis como subagentes dependem do ambiente.
Essas verificações não substituem os testes do jogo.
