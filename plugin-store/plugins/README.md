# Plugins

Diretório reservado aos plugins que poderão ser disponibilizados para instalação no ANOTADO.

## Organização

Cada plugin deve ficar em uma pasta própria, identificada por um ID único. Exemplo:

```
plugins/
├── nome-do-plugin/
│   ├── manifest.json
│   └── script.js
└── outro-plugin/
    ├── manifest.json
    └── script.js
```

O `manifest.json` deverá descrever, no mínimo, o ID, nome, versão e compatibilidade do plugin.

Os scripts ainda não são carregados ou executados automaticamente pelo aplicativo. A integração com o ANOTADO deverá definir uma API explícita e permissões para cada plugin antes de habilitar sua execução.
