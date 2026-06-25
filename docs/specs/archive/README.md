# Archive

## Objetivo

Guardar specs antigas, substituídas ou mantidas apenas por histórico.

Arquivos nesta pasta não são fonte ativa de verdade.

## Quando Arquivar

Arquivar quando:

- uma feature spec foi concluída;
- uma decisão foi substituída;
- uma abordagem foi descartada, mas vale manter histórico;
- uma spec antiga foi consolidada em outra.

## Quando Apagar

Apagar quando:

- o arquivo é rascunho sem valor histórico;
- a informação já foi promovida para spec permanente;
- manter o arquivo causa confusão;
- o conteúdo é temporário e obsoleto.

## Nomenclatura Recomendada

```txt
YYYY-MM-DD-feature-name.md
YYYY-MM-DD-replaced-cache-strategy.md
YYYY-MM-DD-old-observability-plan.md
```

## Regra

Se uma informação em `archive/` conflitar com uma spec ativa, a spec ativa vence.
