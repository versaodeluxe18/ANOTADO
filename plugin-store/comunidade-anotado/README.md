# Comunidade ANOTADO

Extensão oficial com quatro áreas: **AJUDA**, **DEV**, **CHEFÃO** e **OBRIGADO**.

## AJUDA

Aulas interativas que destacam os controles reais do aplicativo e orientam o usuário enquanto ele executa as ações:

- Criar documento (arquivo local).
- Criar nota adesiva.
- Renomear folha.
- Aumentar o espaço da folha.
- Trabalhar em uma folha em foco.

O tour localiza os elementos existentes no `index.html`. A extensão não modifica o arquivo principal.

## Outras áreas

- **DEV:** resumo da arquitetura e acesso ao repositório.
- **CHEFÃO:** apresentação da Versão Deluxe.
- **OBRIGADO:** agradecimento aos desenvolvedores, lista pública de apoiadores e QR Code de doação embutido em Base64.

A lista de apoiadores é carregada da planilha pública em formato TSV definida em `script.js`. O QR Code contém o endereço de doação como imagem Base64.

## Arquivos

- `manifest.json`: metadados, ícone, versão e permissões.
- `script.js`: interface, aulas interativas, lista de apoiadores e QR Code.
- `README.md`: documentação da extensão.

## Integração

Depois que o host carregar `script.js`, a extensão fica disponível em:

```js
window.ANOTADO_PLUGINS["comunidade-anotado"]
```

Montagem:

```js
const plugin = window.ANOTADO_PLUGINS["comunidade-anotado"];
const instance = plugin.mount(containerElement, hostApi);
```

Desmontagem:

```js
instance.unmount();
```

## Privacidade e permissões

O manifesto declara `permissions: []`. A extensão não lê nem altera anotações, projetos, IndexedDB ou dados pessoais. A ajuda apenas consulta os elementos visuais do aplicativo para explicar seu uso.

## Compatibilidade

- Versão da extensão: `1.2.1`
- API declarada: `2.0.0`
- Versão mínima do ANOTADO: `2.0.0`
- Permissões declaradas: nenhuma
