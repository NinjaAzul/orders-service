# Spec Workflow

## Objetivo

Guiar agentes a trabalhar com specs gastando menos contexto e mantendo decisões rastreáveis.

Este guia é agnóstico à IDE e pode ser usado por Cursor, Claude Code ou qualquer outro agente.

## Entrada Obrigatória

Comece por:

- `docs/specs/00-index.md`

Não abra todas as specs por padrão.

## Workflow

1. Ler `docs/specs/00-index.md`.
2. Identificar o tipo de tarefa.
3. Selecionar de 2 a 4 specs relevantes.
4. Ler só as seções necessárias.
5. Para feature nova, criar contexto temporário em `docs/specs/features/`.
6. Implementar ou planejar com base nessas specs.
7. Registrar dúvidas em `docs/memory/open-questions.md` quando necessário.
8. Registrar decisões temporárias em `docs/memory/decisions.md`.
9. Promover decisões estáveis para a spec responsável.
10. Arquivar ou apagar feature specs concluídas.
11. Atualizar README apenas no final.

## Paralelismo

Para tarefas grandes, dividir leitura por área:

- agente de arquitetura: `01`, `02`;
- agente de dados/regras: `03`, `05`;
- agente de API: `04`;
- agente de testes: `07`, `08`;
- agente de observabilidade: `09`;
- agente de qualidade: `10`;
- agente de entrega: `12`.

Cada agente deve retornar:

- specs lidas;
- decisões relevantes;
- riscos;
- próximos passos.

## Controle de Tokens

- Ler índice antes das specs.
- Não reler specs que já foram resumidas na mesma tarefa.
- Preferir trechos específicos a arquivos inteiros.
- Usar `docs/memory` para notas temporárias.
- Usar `docs/specs/features` para contexto temporário de feature.
- Promover notas estáveis para specs.

## Regras

- Specs são fonte de verdade.
- Memory é temporário.
- Feature specs são temporárias até promoção, arquivamento ou remoção.
- README é entrega final.
- Se houver conflito entre spec e memory, a spec vence.
- Se houver conflito entre specs, parar e pedir decisão ou atualizar a spec correta.
