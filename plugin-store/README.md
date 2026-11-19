# Plugin Store do ANOTADO

Este diretório é a raiz do catálogo de extensões do ANOTADO.

## Estrutura

```text
plugin-store/
├── catalog.json
├── README.md
└── plugins/
    └── temporizador-foco/
        ├── manifest.json
        ├── script.js
        └── README.md
```

## Como a descoberta está organizada

1. O aplicativo consulta `catalog.json`.
2. Cada item do catálogo aponta para o `manifest.json` de um plugin.
3. O manifesto informa o caminho do script de entrada (`entry`) e da documentação (`readme`).
4. O aplicativo valida a compatibilidade antes de oferecer a instalação.

Os caminhos do catálogo e do manifesto são relativos ao diretório `plugin-store/` e à pasta de cada plugin, respectivamente.

## Contrato de plugin

A API inicial usa `apiVersion` e um ponto de entrada que registra o plugin em `window.ANOTADO_PLUGINS`. Cada implementação expõe `mount(container, hostApi)` e retorna uma instância com `unmount()`.

O carregador do ANOTADO ainda precisa ser implementado no `index.html`. Os arquivos desta pasta, sozinhos, não instalam nem executam plugins.

## Segurança

Os campos `permissions` dos manifestos documentam o que o plugin declara precisar; eles não impõem restrições técnicas. Não carregue scripts de terceiros diretamente no contexto principal sem validação de origem/integridade e isolamento. Prefira uma API de capacidades explícitas e um sandbox apropriado.
