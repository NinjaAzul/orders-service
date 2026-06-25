# Feature Specs

## Objetivo

Guardar specs temporárias de features em desenvolvimento.

Use esta pasta quando uma feature ainda está sendo desenhada, validada ou implementada.

## Regra

```txt
foundation/ = decisões permanentes do projeto
quality/ = padrões permanentes de qualidade, testes, performance e observabilidade
process/ = processo e entrega
features/ = contexto temporário de feature
archive/ = histórico de specs substituídas
```

## Quando Criar Uma Feature Spec

Criar em `features/` quando:

- a feature ainda está em discussão;
- a regra de negócio ainda pode mudar;
- existem perguntas abertas;
- o contexto é útil só durante implementação;
- a decisão ainda não deve virar fundação do projeto.

## Estrutura Recomendada

```txt
features/
  YYYY-MM-DD-feature-name/
    spec.md
    notes.md
    decisions.md
```

## Ciclo de Vida

1. Criar a feature spec.
2. Implementar usando essa spec como contexto temporário.
3. Ao finalizar, decidir:
   - promover decisão permanente para `foundation/`, `quality/` ou `process/`;
   - arquivar a feature spec em `archive/`;
   - apagar se não tiver valor histórico.

## Regra de Promoção

Promover para specs permanentes quando a feature alterar:

- contrato GraphQL;
- tabela ou índice;
- regra transacional;
- cache;
- observabilidade;
- teste obrigatório;
- padrão de qualidade;
- documentação final.
