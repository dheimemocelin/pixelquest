# Engineering OS no PixelQuest

As skills são ferramentas de desenvolvimento. Não implementam funcionalidades dos
jogos nem adicionam dependências à aplicação.

## Origem e licença

- Repositório: https://github.com/dheimemocelin/skill
- Revisão: `ef73a8cd36134fe50be4c6077113f481faacca52`.
- [Instruções oficiais de instalação](https://github.com/dheimemocelin/skill/blob/ef73a8cd36134fe50be4c6077113f481faacca52/README.md).
- [Adaptador Codex](https://github.com/dheimemocelin/skill/blob/ef73a8cd36134fe50be4c6077113f481faacca52/adapters/codex/README.md).
- [Licença MIT original](LICENSE) e [atribuições da origem](SOURCES.md).

As sete skills foram copiadas sem alterações. Os três adaptadores foram gerados
pelo script oficial da mesma revisão, sem alterações manuais. A licença MIT da
origem permite redistribuição, preservados seu copyright e texto de permissão.
Ferramentas opcionais mencionadas pelas skills não estão incluídas.

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

Na integração, a validação oficial e os seis testes da origem passaram. A descoberta
pelo Codex reconheceu as sete skills no escopo do projeto. A execução dos papéis
como subagentes não foi testada. Essas verificações não substituem testes dos jogos,
que ainda não foram implementados.
