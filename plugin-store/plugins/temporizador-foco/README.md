# Temporizador de foco

Plugin de teste da loja do ANOTADO. Ele adiciona um temporizador Pomodoro com dois modos:

- **Foco:** 25 minutos.
- **Pausa:** 5 minutos.

O plugin é autocontido e não consulta, altera ou salva anotações, projetos ou dados do IndexedDB. Seu objetivo inicial é validar o fluxo de descoberta, leitura do manifesto, carregamento do script e montagem/desmontagem de uma extensão.

## Arquivos

- `manifest.json`: metadados, versão, arquivo de entrada e permissões declaradas.
- `script.js`: implementação do temporizador.
- `README.md`: documentação do plugin.

## Contrato de integração

Depois que o host carregar `script.js`, o plugin registra sua implementação em:

```js
window.ANOTADO_PLUGINS["temporizador-foco"]
```

O host deverá fornecer um elemento HTML para a interface:

```js
const plugin = window.ANOTADO_PLUGINS["temporizador-foco"];
const instance = plugin.mount(containerElement, hostApi);
```

A montagem retorna uma instância com um método `unmount()`, que deve ser chamado quando o usuário fechar ou desinstalar a extensão:

```js
instance.unmount();
```

O segundo argumento (`hostApi`) fica reservado à API controlada do ANOTADO. Esta versão não precisa dele.

## Segurança

O manifesto declara `permissions: []` porque este plugin não solicita acesso aos dados ou funções do aplicativo. Isso é uma declaração de capacidade, não uma sandbox: um script carregado como JavaScript comum na página ainda executa com as permissões dessa página. O carregador definitivo deverá aplicar isolamento e validação de origem/integridade antes de aceitar plugins de terceiros.

## Compatibilidade

- API de plugin: `1.0.0`
- Versão mínima declarada do ANOTADO: `1.0.0`
- Dependências externas: nenhuma
