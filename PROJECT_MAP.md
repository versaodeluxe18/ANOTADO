# ANOTADO — mapa do projeto

Este documento é o ponto de entrada para pessoas e ferramentas de IA entenderem o projeto antes de alterar código.

## Decisão de arquitetura atual

O aplicativo permanece concentrado em `index.html`. Isso é intencional nesta etapa: a interface, os estilos e o JavaScript compartilham muitos elementos do DOM, estado global e funções. Separar tudo em módulos agora criaria risco de quebrar a ordem de inicialização e as dependências implícitas.

**Regra para futuras alterações:** manter a estrutura simples. Extrair CSS ou JavaScript para arquivos próprios somente quando houver um limite claro, dependências explícitas e ganho real de manutenção. Não fragmentar apenas para reduzir o tamanho do HTML.

## Estrutura atual

```text
/
├── index.html       # Aplicação completa: estrutura, estilos e lógica
└── PROJECT_MAP.md   # Este guia de arquitetura e manutenção
```

## Tecnologias e dependências observadas

- HTML, CSS e JavaScript nativos, sem etapa de build identificada.
- Tailwind CSS carregado pelo CDN no navegador.
- Fontes e ícones carregados do Google Fonts.
- IndexedDB para persistência dos projetos e anotações.
- localStorage para guardar preferências/identificação do projeto ativo.
- APIs do navegador usadas pela interface, como Canvas, Pointer Events, File API e animações.

Não foi identificado um backend ou serviço de sincronização remota no código atual. Os dados persistidos pelo aplicativo ficam no navegador do usuário; exportação/importação JSON é o mecanismo disponível para transportar cópias.

A pasta `plugin-store/` contém o catálogo e os arquivos de extensões estáticas. Ela ainda não está conectada ao `index.html`: o carregador da loja e a instalação de plugins dependem de uma integração manual futura.

## Mapa funcional

| Área | Responsabilidade | Onde procurar |
|---|---|---|
| Inicialização e estado | Estado em memória, referências aos elementos e inicialização da aplicação | Bloco JavaScript principal; `initApp()` |
| Área de trabalho | Folhas/estágios, dimensões, zoom, pan e expansão | `createNote()`, `updateStageTransform()`, `setZoom()`, `expandStage()`, `collapseExpandedStage()` |
| Notas e elementos | Notas adesivas, seleção, arrastar, redimensionar e duplicar | `addStickyNote()`, `selectElement()`, `makeDraggable()` |
| Desenho | Camada de desenho sobre a folha | `setupCanvasDrawing()` |
| Barra de ferramentas | Ações, menus, recolher/expandir e posicionamento | Seção de eventos da toolbar; `collapseToolbar()`, `expandToolbar()` |
| Inspetor e foco | Edição/ações do elemento selecionado e modo de foco | `openDeepNoteFocus()`, `closeDeepNoteFocus()` |
| Histórico | Desfazer ações e restaurar snapshots | `pushUndoAction()`, `undoLastAction()` |
| Conclusões e prazos | Notas concluídas, prazos, painéis e notificações | `completeStickyNote()`, `renderCompletedPanel()`, `renderDeadlinesPanel()` |
| Persistência | Abrir banco, ler/gravar projetos e migração | `openDatabase()`, `getAllProjectsFromDB()`, `saveProjectToDB()`, `checkAndMigrateLegacyDB()` |
| Projetos | Criar, trocar, renomear, duplicar e excluir projetos | `switchProject()`, `createNewProject()`, `renameProject()`, `duplicateProject()`, `deleteProject()` |
| Importação/exportação | Exportar e importar projetos em JSON | `exportAllProjectsJSON()`, `importProjectsJSON()` |
| Reinicialização | Limpar dados locais e reinicializar o aplicativo | `resetAllDatabaseAndSettings()` |

Os nomes acima são pontos de entrada para busca no arquivo, não uma promessa de que cada recurso esteja isolado em um módulo.

## Fluxo de dados simplificado

1. `initApp()` consulta o IndexedDB.
2. Se não houver projetos, verifica a possibilidade de migrar o banco legado; caso contrário, cria um projeto inicial.
3. O projeto ativo é escolhido usando a chave guardada no localStorage, com fallback para o primeiro projeto disponível.
4. `loadProjectData()` reconstrói o estado e a interface.
5. Alterações são refletidas no estado em memória e persistidas por `saveProjectToDB()` / mecanismo de salvamento automático.
6. Importação e exportação usam JSON para transferência entre navegadores/instalações.

## Orientações para agentes de IA

Antes de editar:

1. Leia este arquivo e depois o `index.html` completo ou as funções diretamente relacionadas à tarefa.
2. Localize todos os usos da função, estado, ID ou seletor que pretende alterar. A lógica está concentrada e há dependências entre funções.
3. Preserve os IDs do HTML: muitos são consultados diretamente pelo JavaScript.
4. Preserve a ordem de carregamento dos scripts e a ordem de inicialização.
5. Ao alterar persistência, considere projetos existentes, migração do banco legado, autosave, importação/exportação e histórico de desfazer.
6. Evite renomear chaves do IndexedDB, campos serializados ou estruturas JSON sem uma migração compatível.
7. Faça mudanças pequenas e valide os fluxos relacionados, não apenas a aparência inicial.

## Critérios para dividir arquivos no futuro

Uma extração só deve acontecer quando:

- o bloco tiver responsabilidade coesa;
- suas entradas e saídas puderem ser definidas claramente;
- dependências globais puderem ser substituídas por imports/exports explícitos;
- a ordem de inicialização ficar determinística;
- a alteração puder ser validada sem mudar o comportamento existente.

Quando esse momento chegar, uma divisão incremental provável é:

- `styles.css`: estilos atualmente dentro dos blocos `<style>`;
- `app.js`: ponto de entrada e composição;
- módulos JavaScript por domínio (persistência, projetos, notas, desenho e interface), apenas depois de explicitar as dependências.

Não faça essa extração em lote. Primeiro estabeleça limites e testes; depois mova um domínio por vez.

## Limitações conhecidas da estrutura

- O arquivo único é grande e concentra responsabilidades distintas.
- A lógica usa referências ao DOM e estado compartilhado; mudanças locais podem ter efeitos em outras áreas.
- Dependências via CDN exigem conexão e disponibilidade dos serviços externos para carregar estilos/fontes.
- Não há, no repositório neste momento, configuração de testes automatizados ou pipeline de build identificada.

Este mapa deve ser atualizado quando a arquitetura ou os principais fluxos mudarem.
