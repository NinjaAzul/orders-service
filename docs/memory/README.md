# Memory

## Objetivo

Guardar notas temporárias durante planejamento e implementação.

Memory não é fonte de verdade permanente.

## Regra Principal

```txt
memory é temporário
spec é fonte da verdade
README é comunicação final
```

## Arquivos

- `decisions.md`: decisões temporárias ainda não promovidas para specs.
- `implementation-notes.md`: observações de execução, atalhos e contexto operacional.
- `open-questions.md`: dúvidas pendentes.

## Quando Promover Para Spec

Promover uma nota para spec quando:

- virou decisão técnica;
- impacta arquitetura;
- impacta contrato GraphQL;
- impacta banco;
- muda regra de negócio;
- muda teste, observabilidade ou qualidade.

## Quando Limpar

Limpar memory quando:

- a decisão já foi movida para spec;
- a dúvida foi resolvida;
- a nota perdeu contexto;
- o README final já absorveu o ponto.
