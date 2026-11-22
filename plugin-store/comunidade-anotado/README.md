# Comunidade ANOTADO

Extensão oficial com quatro entradas: **AJUDA**, **DEV**, **CHEFÃO** e **OBRIGADO**.

## Recursos

- **AJUDA:** tour com balões ancorados nas ferramentas do `index.html`. Não altera o arquivo principal.
- **DEV:** resumo da arquitetura e acesso ao repositório.
- **CHEFÃO:** apresentação da Versão Deluxe.
- **OBRIGADO:** agradecimentos, lista pública de apoiadores e QR Code de doação em Base64.

## Arquivos

- `manifest.json`: metadados, ícone, versão e permissões.
- `script.js`: interface, tour de ajuda, lista de apoiadores e QR Code.
- `README.md`: documentação da extensão.

## Apoiadores e doações

A lista de apoiadores é carregada da planilha pública em formato TSV definida em `script.js`. O código exibe apenas os nomes encontrados na coluna de identificação. O QR Code contém o endereço de doação da Stripe como imagem Base64; o endereço não é exibido como link na interface.

A extensão não lê anotações, projetos ou outros dados pessoais do usuário.

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

O modo AJUDA localiza elementos já existentes no aplicativo por seus seletores de DOM. O tour não cria nem modifica ferramentas no `index.html`.

## Compatibilidade

- Versão da extensão: `1.1.0`
- API declarada: `2.0.0`
- Versão mínima do ANOTADO: `2.0.0`
- Permissões declaradas: nenhuma
