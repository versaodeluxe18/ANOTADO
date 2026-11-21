# Comunidade ANOTADO

Extensão oficial para quem já usa o ANOTADO e quer conhecer a origem do projeto, acompanhar comunicados e permanecer próximo da evolução do aplicativo.

Criada para apresentar o trabalho de **W. F. Fukuta**, pela **Versão Deluxe**, em um espaço próprio dentro do ANOTADO.

## O que a extensão oferece

- Apresentação da origem e da proposta do ANOTADO.
- Pequena narrativa em capítulos: a ideia, a construção e a comunidade.
- Mural de comunicados oficiais.
- Acesso ao repositório e ao histórico público de alterações.

## Arquivos

- \`manifest.json\`: identificação, metadados, ícone em Base64, compatibilidade e permissões.
- \`script.js\`: interface, conteúdo institucional e lista de comunicados.
- \`README.md\`: documentação da extensão.

## Publicação de novidades

Os comunicados são definidos no início de \`script.js\), no array \`UPDATES\`. Para publicar uma novidade, adicione um objeto no início da lista com:

- \`date\`: data apresentada ao usuário;
- \`category\`: categoria do comunicado;
- \`title\`: título;
- \`description\`: resumo.

A extensão não consulta um servidor de notícias nem busca atualizações automaticamente. O mural é atualizado quando uma nova versão do \`script.js\) é publicada. Para acompanhar alterações no código entre essas publicações, a interface oferece um link direto para o histórico de commits do repositório.

## Contrato de integração

Depois que o host carregar \`script.js\), a implementação fica disponível em:

\`\`\`js
window.ANOTADO_PLUGINS["comunidade-anotado"]
\`\`\`

Montagem:

\`\`\`js
const plugin = window.ANOTADO_PLUGINS["comunidade-anotado"];
const instance = plugin.mount(containerElement, hostApi);
\`\`\`

Desmontagem:

\`\`\`js
instance.unmount();
\`\`\`

O argumento \`hostApi\` é reservado para a API controlada do ANOTADO. Esta extensão não precisa utilizá-lo.

## Privacidade e permissões

O manifesto declara \`permissions: []\). A extensão não lê nem altera anotações, projetos, IndexedDB, preferências ou dados pessoais. Os únicos destinos externos são links públicos do GitHub, abertos quando o próprio usuário escolhe acessá-los.

Essa declaração de permissões descreve o comportamento da extensão; não substitui o isolamento técnico que deverá ser aplicado pelo carregador de plugins.

## Compatibilidade

- Versão da extensão: \`1.0.0\`
- API declarada: \`2.0.0\`
- Versão mínima declarada do ANOTADO: \`2.0.0\`
- Dependências externas: nenhuma


## Janela e posicionamento

A extensão configura a janela hospedeira durante a montagem: posiciona-a no canto superior direito dentro da área visível, limita a altura ao viewport e habilita rolagem interna para o conteúdo longo. O cabeçalho de arraste fornecido pelo ANOTADO continua sendo utilizado para reposicionar a janela. Ao redimensionar a tela, a extensão ajusta os limites sem reiniciar a posição escolhida pelo usuário.
