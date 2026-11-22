/*
 * ANOTADO Plugin: Comunidade ANOTADO
 * Version: 1.1.0
 *
 * Central minimalista de ajuda, informações e agradecimentos.
 * O modo AJUDA destaca ferramentas existentes no index.html.
 */
(function registerCommunityPlugin(global) {
    'use strict';

    const PLUGIN_ID = 'comunidade-anotado';
    const PLUGIN_VERSION = '1.2.0';
    const REPOSITORY_URL = 'https://github.com/versaodeluxe18/ANOTADO';
    const SUPPORTERS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSTfsdOYawlg9uvFxtguMaUuNMfK7yMHoxi7l38kM3IrOQPG81BOPidwgqpIIWH0lV6cKBodK-WtryQ/pub?gid=1741040537&single=true&output=tsv';
    const DONATION_QR_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAREAAAERCAIAAADT9gTZAAAE9ElEQVR42u3dTW4TQRCAUYx8AnbcgPufhhuw4wrDFmUsUVK5fjq8t05ie+xPbVVaPY/rur4AYV9dAtAMaAY0A5oBzQCaAc2AZkAzoBnQDKAZ0AxoBjQDmgE0A5oBzcA6z+Tvf/v+Y9tL+v3r59tf0cu/WfGTFVd+9sl/vk+IdQY0A5oBzYBmQDPA3bPijyZneXEVc8z4k0/+ZHJYnHyghX/zlE+IdQY0A5oBzYBmQDPA3bPtkZJTv9ldwPG/OTtWTl6Q2WHx7CfEOgOaAc2AZkAzgGYg4+kSfNC2Vzr5QPFhccX03DoDaAY0A5oBzYBmgL+ZNX/UNhdO/mTFicltm7KtM+C7GaAZ0AxoBjQDn0zfrHnhIHL2yIiKYXHyWI+KU0GO/oRYZ0AzoBnQDGgGNAMElcyaKwaRbZLz1rZjlNt+0ifEOgOaAc2AZkAzoBngn7Kz5qOPTVg4hK14RRU/Obsl3DoDmgHNAJoBzYBmYJvsrHnhuLbi/njxB6p4mQu3Wrf9evJ9t86A72agGdAMoBnQDPQo2decHC+2zUaTm3Nnb5rXtjG5TfIit70d1hnQDGgGNAOaAc0Ad8/Zh2873XhWxV7ptvl18oGSO8oXTvmtM6AZ0AxoBjQDmgHuSs7QaFMxiJzdqd22W7niZIzZ7dvWGfDdDDQDmgE0A5qBQX1naFTMhU85HPmUQ0XaLl3bp846A76bgWZAM4BmQDPQ43Fd19v/aMWW29mjGOIWvsyFTnmPrDPguxloBjQDmgHNAEHZWfPsGbsLD1iIv6K2KerCndrJ9z35UbTOgO9moBnQDGgG0Ay83TFnaFQ8+ktHz1vbrlLbU5q9dNYZ0AxoBjQDmgHNAEHP2Yev2MK8cLQa17b7u+0qLbzXojM0wHcz0AxoBjQDaAberuQMjZdOOUo4+dpnt2+3mf0nQduTt86A72agGdAMaAY0AwQN72uuOO9i4Stqc8pBJckPw+wudesMaAY0A5oBzYBmgLvsvua4tkMw2rZaz+5rbns7kk9p4f8D7GsG381AM6AZ0AygGXi7Y85rfqltjtn2QG1nU1Q8UMXG5IWbna0zoBnQDGgGNAOaAe6OOa+5bTpZYeH98WYdfdqGdQY0A5oBzYBmQDPAXcm+5oU3jlu4kXZ2Z3HS7Iko9jWD72agGUAzoBnQDGzTd4ZG24HLbbetm71KbU8+eQRH0uyGdOsMaAY0A5oBzYBmgKC+WfPs7tpT7kx49AbqtnezbdJtnQHNgGZAM6AZ0AwQlJ01V0z9ZqeoFWanvQtvbBh/nrNHXVtnwHcz0AxoBjQDmgGCsrPmU+47VzGynP31Uwa7bccoV1wl6wxoBjQDmgHNgGaAoOF7Aya13Rsw/jJn73Y4+3ZUPPrCSbd1BjQDmgHNgGZAM8Dd8L0B49qOe46PgE85myL5N4++IBVPyToDmgHNgGZAM6AZ4O7pEkxp22odf/S4insYLjyB2joDmgHNgGZAM6AZIOi/njUnB6Zt9/GbPYai4nq2/bp1Bnw3A82AZgDNgGagR9+seeGpwW3HPVfsAo4/z9n3KLmvueJ2hdYZ0AxoBjQDmgE0A29XMmueHQVWPKWK040rnnzbTu0KC2f31hnQDGgGNAOaAc0AQY/rulwFsM6AZkAzoBnQDKAZ0AxoBjQDmgHNAJoBzYBmQDOgGUAzoBnQDGgGTvYHxuPUtxlsjukAAAAASUVORK5CYII=';
    const mountedInstances = new WeakMap();

    const TUTORIALS = {
        document: {
            label: 'Criar documento',
            description: 'Crie um novo arquivo para organizar suas ideias.',
            steps: [
                { selector: '#topbar-add-project-btn', title: 'Abra o menu de arquivos', text: 'Toque no botão + no alto da tela para criar ou abrir um documento.', trigger: 'click' },
                { selector: '#btn-choice-create-local', title: 'Crie um arquivo local', text: 'Escolha “Criar arquivo local” para começar um novo documento.', trigger: 'click' },
                { selector: '#new-project-name-input', title: 'Dê um nome ao documento', text: 'Digite o nome que deseja usar. Quando terminar, toque em PRÓXIMO.', trigger: 'manual' },
                { selector: '#new-project-confirm-btn', title: 'Confirme a criação', text: 'Toque no botão de confirmação. O ANOTADO vai criar seu documento e abrir a primeira folha.', trigger: 'click', delay: 850 }
            ],
            success: 'Documento criado! Sua primeira folha já está pronta para receber anotações.'
        },
        sticky: {
            label: 'Criar nota',
            description: 'Adicione um post-it e escreva nele.',
            steps: [
                { selector: '#quick-add-note', title: 'Adicione uma nota', text: 'Toque no botão de nota rápida, no canto inferior esquerdo.', trigger: 'click', delay: 180 },
                { selector: '.sticky-content', lastMatch: true, title: 'Escreva sua ideia', text: 'Clique dentro do post-it e digite. O ANOTADO salva o texto automaticamente.', trigger: 'input', requireChange: true }
            ],
            success: 'Muito bem! Sua nota foi criada e o texto é salvo automaticamente.'
        },
        rename: {
            label: 'Renomear folha',
            description: 'Dê um nome próprio para cada folha.',
            steps: [
                { selector: '.note-title-wrapper', firstMatch: true, title: 'Escolha a folha', text: 'Toque no título de uma folha para editar o nome.', trigger: 'click', scrollIntoView: true },
                { selector: '.note-title-input', firstMatch: true, title: 'Digite o novo nome', text: 'Escreva o nome que deseja usar. Depois toque em PRÓXIMO.', trigger: 'manual' },
                { selector: '.note-title-save-btn', firstMatch: true, title: 'Salve o nome', text: 'Toque no botão de confirmação para aplicar o novo título.', trigger: 'click', delay: 250 }
            ],
            success: 'Nome atualizado! Sua folha ficou mais fácil de identificar.'
        },
        expand: {
            label: 'Aumentar espaço da folha',
            description: 'Amplie a área de trabalho quando precisar.',
            steps: [
                { selector: '.stage-expand-bar', firstMatch: true, title: 'Amplie sua folha', text: 'Toque na barra “+300px” abaixo da folha para aumentar o espaço disponível.', trigger: 'click', scrollIntoView: true, delay: 300 }
            ],
            success: 'Pronto! Sua folha ganhou mais espaço para anotações.'
        },
        focus: {
            label: 'Trabalhar em uma folha',
            description: 'Abra uma folha em foco para trabalhar nela.',
            steps: [
                { selector: '.stage-expand-btn', firstMatch: true, title: 'Abra a folha em foco', text: 'Toque em TRABALHAR NESSE no centro da folha.', trigger: 'click', scrollIntoView: true, delay: 350 },
                { selector: '#close-deep-note-btn', title: 'Volte ao quadro', text: 'A folha está em foco. Quando terminar, use este botão para minimizar e voltar ao quadro.', trigger: 'click', delay: 250 }
            ],
            success: 'Você já sabe abrir uma folha em foco e retornar ao quadro.'
        }
    };

    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function isVisible(element) {
        if (!element || !element.isConnected) return false;
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            rect.width > 0 &&
            rect.height > 0;
    }

    function configureCommunityWindow(container) {
        const hostWindow = container && container.parentElement;
        if (!hostWindow) {
            return { hostWindow: null, cleanup: function () {} };
        }

        hostWindow.style.position = 'fixed';
        hostWindow.style.top = '16px';
        hostWindow.style.right = '16px';
        hostWindow.style.bottom = 'auto';
        hostWindow.style.left = 'auto';
        hostWindow.style.width = 'min(560px, calc(100vw - 32px))';
        hostWindow.style.maxWidth = 'calc(100vw - 16px)';
        hostWindow.style.maxHeight = 'calc(100vh - 32px)';
        hostWindow.style.overflow = 'hidden';
        hostWindow.style.display = 'flex';
        hostWindow.style.flexDirection = 'column';
        hostWindow.style.boxSizing = 'border-box';

        container.style.width = '100%';
        container.style.minWidth = '0';
        container.style.minHeight = '0';
        container.style.flex = '1 1 auto';
        container.style.maxWidth = '100%';
        container.style.maxHeight = 'calc(100vh - 72px)';
        container.style.overflowY = 'auto';
        container.style.overflowX = 'hidden';
        container.style.overscrollBehavior = 'contain';
        container.style.boxSizing = 'border-box';

        const dragHandle = hostWindow.querySelector('.plugin-drag-handle');
        if (dragHandle) {
            dragHandle.style.touchAction = 'none';
            dragHandle.style.display = 'flex';
            dragHandle.style.flex = '1 1 100%';
            dragHandle.style.width = '100%';
            dragHandle.style.justifyContent = 'center';
            dragHandle.style.alignItems = 'center';
            dragHandle.style.paddingLeft = '0';
            dragHandle.style.paddingRight = '0';
            dragHandle.style.textAlign = 'center';

            dragHandle.querySelectorAll('span').forEach(function (span) {
                if (!span.classList.contains('material-symbols-outlined')) {
                    span.style.display = 'none';
                } else {
                    span.style.margin = '0 auto';
                }
            });

            const dragBar = dragHandle.parentElement;
            if (dragBar) {
                dragBar.style.position = 'relative';
                dragBar.style.justifyContent = 'center';
                const closeButton = dragBar.querySelector('.plugin-close-btn');
                if (closeButton) {
                    closeButton.style.position = 'absolute';
                    closeButton.style.right = '4px';
                    closeButton.style.top = '50%';
                    closeButton.style.transform = 'translateY(-50%)';
                }
            }
        }

        function clampWindow() {
            if (!hostWindow.isConnected) return;

            const rect = hostWindow.getBoundingClientRect();
            const margin = 8;
            const maxLeft = Math.max(margin, window.innerWidth - rect.width - margin);
            const maxTop = Math.max(margin, window.innerHeight - rect.height - margin);
            const left = Math.min(maxLeft, Math.max(margin, rect.left));
            const top = Math.min(maxTop, Math.max(margin, rect.top));

            hostWindow.style.left = left + 'px';
            hostWindow.style.top = top + 'px';
            hostWindow.style.right = 'auto';
            hostWindow.style.bottom = 'auto';
        }

        clampWindow();
        const frame = window.requestAnimationFrame
            ? window.requestAnimationFrame(clampWindow)
            : null;
        window.addEventListener('resize', clampWindow);

        return {
            hostWindow: hostWindow,
            cleanup: function () {
                window.removeEventListener('resize', clampWindow);
                if (frame !== null && window.cancelAnimationFrame) {
                    window.cancelAnimationFrame(frame);
                }
            }
        };
    }

    function mount(container) {
        if (!container || typeof container.appendChild !== 'function') {
            throw new TypeError('A Comunidade ANOTADO precisa de um elemento HTML como contêiner.');
        }

        const previousUnmount = mountedInstances.get(container);
        if (previousUnmount) previousUnmount();

        const panel = document.createElement('section');
        panel.className = 'anotado-community';
        panel.setAttribute('aria-label', 'Comunidade oficial do ANOTADO');

        const style = document.createElement('style');
        style.textContent = [
            '.anotado-community { --ac-ink:#191c1e; --ac-muted:#626a76; --ac-line:#d7dbe1; --ac-card:#fff; --ac-soft:#f5f6f8; --ac-primary:#171d2a; width:100%; max-width:560px; margin:0 auto; color:var(--ac-ink); font-family:Inter,ui-sans-serif,system-ui,sans-serif; font-size:13px; line-height:1.55; }',
            '.anotado-community *, .anotado-community *::before, .anotado-community *::after { box-sizing:border-box; }',
            '.anotado-community button, .anotado-community a { font:inherit; }',
            '.anotado-community button:focus-visible, .anotado-community a:focus-visible { outline:2px solid #64748b; outline-offset:3px; }',
            '.anotado-community .ac-shell { display:flex; flex-direction:column; gap:19px; padding:4px; }',
            '.anotado-community .ac-kicker { margin:0 0 5px; color:var(--ac-muted); font-size:10px; font-weight:700; letter-spacing:.12em; }',
            '.anotado-community .ac-home h1, .anotado-community .ac-detail h1 { margin:0; color:var(--ac-ink); font-size:clamp(22px,4vw,28px); font-weight:700; letter-spacing:-.045em; line-height:1.18; }',
            '.anotado-community .ac-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:11px; margin-top:16px; }',
            '.anotado-community .ac-choice { display:flex; min-height:118px; flex-direction:column; align-items:flex-start; justify-content:space-between; gap:12px; padding:16px; border:1px solid var(--ac-line); border-radius:13px; background:var(--ac-card); color:var(--ac-ink); text-align:left; cursor:pointer; transition:border-color .15s,background .15s,transform .15s; }',
            '.anotado-community .ac-choice:hover { border-color:var(--ac-muted); background:var(--ac-soft); transform:translateY(-1px); }',
            '.anotado-community .ac-choice-icon { display:grid; place-items:center; width:35px; height:35px; border:1px solid var(--ac-line); border-radius:10px; background:var(--ac-soft); color:var(--ac-ink); font-size:16px; font-weight:800; }',
            '.anotado-community .ac-choice strong { font-size:13px; font-weight:800; letter-spacing:.06em; }',
            '.anotado-community .ac-footer { padding-top:2px; color:var(--ac-muted); font-size:10px; }',
            '.anotado-community .ac-detail { display:flex; flex-direction:column; gap:13px; }',
            '.anotado-community .ac-back { align-self:flex-start; min-height:36px; margin-top:5px; padding:0 13px; border:1px solid var(--ac-line); border-radius:9px; background:var(--ac-soft); color:var(--ac-ink); font-size:11px; font-weight:700; cursor:pointer; transition:background .15s,border-color .15s; }',
            '.anotado-community .ac-back:hover { border-color:var(--ac-muted); background:var(--ac-card); }',
            '.anotado-community .ac-tutorial-list { display:grid; gap:8px; margin-top:3px; }',
            '.anotado-community .ac-tutorial-choice { display:flex; align-items:center; justify-content:space-between; gap:12px; width:100%; min-height:58px; padding:11px 13px; border:1px solid var(--ac-line); border-radius:10px; background:var(--ac-card); color:var(--ac-ink); text-align:left; cursor:pointer; transition:border-color .15s,background .15s; }',
            '.anotado-community .ac-tutorial-choice:hover { border-color:var(--ac-muted); background:var(--ac-soft); }',
            '.anotado-community .ac-tutorial-choice span { display:block; }',
            '.anotado-community .ac-tutorial-choice strong { font-size:12px; font-weight:800; }',
            '.anotado-community .ac-tutorial-choice small { display:block; margin-top:2px; color:var(--ac-muted); font-size:10px; }',
            '.anotado-community .ac-tutorial-arrow { flex:0 0 auto; color:var(--ac-muted); font-size:17px; }',
            '.anotado-community .ac-copy { margin:0; color:var(--ac-muted); font-size:12px; line-height:1.75; }',
            '.anotado-community .ac-facts { display:grid; gap:7px; margin:2px 0 0; padding:0; list-style:none; }',
            '.anotado-community .ac-facts li { padding:10px 12px; border:1px solid var(--ac-line); border-radius:9px; background:var(--ac-soft); color:var(--ac-ink); font-size:11px; }',
            '.anotado-community .ac-link { display:inline-flex; align-items:center; justify-content:center; align-self:flex-start; min-height:38px; padding:0 14px; border:1px solid var(--ac-primary); border-radius:9px; background:var(--ac-primary); color:#fff !important; font-size:11px; font-weight:700; text-decoration:none; }',
            '.anotado-community .ac-link:hover { opacity:.88; }',
            '.anotado-community .ac-supporters { padding:13px; border:1px solid var(--ac-line); border-radius:11px; background:var(--ac-soft); }',
            '.anotado-community .ac-supporters h2, .anotado-community .ac-donation h2 { margin:0 0 4px; color:var(--ac-ink); font-size:13px; font-weight:800; }',
            '.anotado-community .ac-supporters ul { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:5px 14px; margin:10px 0 0; padding:0; list-style:none; }',
            '.anotado-community .ac-supporters li { overflow-wrap:anywhere; color:var(--ac-muted); font-size:11px; }',
            '.anotado-community .ac-donation { display:flex; align-items:center; justify-content:space-between; gap:14px; padding:13px; border:1px solid var(--ac-line); border-radius:11px; }',
            '.anotado-community .ac-donation-copy { min-width:0; }',
            '.anotado-community .ac-donation-copy p, .anotado-community .ac-qr-caption { margin:0; color:var(--ac-muted); font-size:11px; }',
            '.anotado-community .ac-donate-btn { margin-top:9px; min-height:34px; padding:0 13px; border:1px solid var(--ac-line); border-radius:9px; background:var(--ac-soft); color:var(--ac-ink); font-size:11px; font-weight:800; cursor:pointer; }',
            '.anotado-community .ac-qr-panel { display:flex; flex-direction:column; align-items:center; gap:7px; margin-top:12px; padding:12px; border-radius:10px; background:#fff; }',
            '.anotado-community .ac-qr-panel[hidden] { display:none; }',
            '.anotado-community .ac-qr-panel img { display:block; width:190px; height:190px; max-width:100%; image-rendering:pixelated; }',
            '.anotado-community [hidden] { display:none !important; }',
            '.ac-tour-backdrop { position:fixed; inset:0; z-index:2147483000; background:rgba(12,16,24,.16); pointer-events:none; }',
            '.ac-tour-bubble { position:fixed; z-index:2147483001; width:320px; max-width:calc(100vw - 24px); padding:14px; border:1px solid #d8dde5; border-radius:13px; background:#fff; color:#171b23; box-shadow:0 16px 48px rgba(0,0,0,.22); font-family:Inter,ui-sans-serif,system-ui,sans-serif; }',
            '.ac-tour-count { margin:0 0 6px; color:#64748b; font-size:9px; font-weight:800; letter-spacing:.13em; }',
            '.ac-tour-bubble h2 { margin:0 0 5px; color:#171b23; font-size:15px; font-weight:800; }',
            '.ac-tour-bubble p.ac-tour-text { margin:0; color:#5b6472; font-size:11px; line-height:1.6; }',
            '.ac-tour-footer { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:13px; }',
            '.ac-tour-footer-group { display:flex; gap:6px; }',
            '.ac-tour-footer button { min-height:30px; padding:0 10px; border:1px solid #d8dde5; border-radius:8px; background:#fff; color:#303846; font-size:10px; font-weight:800; cursor:pointer; }',
            '.ac-tour-footer button.ac-tour-next { border-color:#171d2a; background:#171d2a; color:#fff; }',
            '.ac-tour-hint { color:#64748b; font-size:10px; font-weight:700; }',
            '.ac-tour-footer button:disabled { opacity:.35; cursor:not-allowed; }',
            'html.dark .anotado-community { --ac-ink:#f2f4f8; --ac-muted:#aab3c2; --ac-line:#364050; --ac-card:#202733; --ac-soft:#1a2230; --ac-primary:#edf2fb; }',
            'html.dark .anotado-community .ac-mark { color:#141b2b; }',
            'html.dark .anotado-community .ac-link { color:#141b2b !important; }',
            'html.dark .ac-tour-bubble { border-color:#394455; background:#202733; color:#f2f4f8; }',
            'html.dark .ac-tour-bubble h2 { color:#f2f4f8; }',
            'html.dark .ac-tour-bubble p.ac-tour-text { color:#b7c0ce; }',
            'html.dark .ac-tour-footer button { border-color:#465164; background:#273242; color:#f2f4f8; }',
            'html.dark .ac-tour-footer button.ac-tour-next { border-color:#edf2fb; background:#edf2fb; color:#141b2b; }',
            '@media (max-width:480px) { .anotado-community .ac-grid { grid-template-columns:1fr; } .anotado-community .ac-choice { min-height:88px; flex-direction:row; align-items:center; } .anotado-community .ac-supporters ul { grid-template-columns:1fr; } .anotado-community .ac-donation { align-items:flex-start; flex-direction:column; } }'
        ].join('\n');

        panel.innerHTML = [
            '<div class="ac-shell">',
                '<section class="ac-home" data-view="home">',
                    '<p class="ac-kicker">COMUNIDADE ANOTADO</p>',
                    '<h1>O que você procura?</h1>',
                    '<div class="ac-grid">',
                        '<button type="button" class="ac-choice" data-action="help"><span class="ac-choice-icon" aria-hidden="true">?</span><strong>AJUDA</strong></button>',
                        '<button type="button" class="ac-choice" data-action="dev"><span class="ac-choice-icon" aria-hidden="true">&lt;/&gt;</span><strong>DEV</strong></button>',
                        '<button type="button" class="ac-choice" data-action="deluxe"><span class="ac-choice-icon" aria-hidden="true">VD</span><strong>CHEFÃO</strong></button>',
                        '<button type="button" class="ac-choice" data-action="thanks"><span class="ac-choice-icon" aria-hidden="true">♥</span><strong>OBRIGADO</strong></button>',
                    '</div>',
                    '<footer class="ac-footer">Versão Deluxe · ANOTADO</footer>',
                '</section>',
                '<section class="ac-detail" data-view="detail" hidden></section>',
            '</div>'
        ].join('');

        panel.insertBefore(style, panel.firstChild);
        container.appendChild(panel);

        const windowConfig = configureCommunityWindow(container);
        const homeView = panel.querySelector('[data-view="home"]');
        const detailView = panel.querySelector('[data-view="detail"]');

        let disposed = false;
        let tourState = null;
        let supportersPromise = null;

        function showHome() {
            detailView.hidden = true;
            detailView.innerHTML = '';
            homeView.hidden = false;
        }

        function loadSupporters(listElement) {
            if (!listElement) return;

            if (!supportersPromise) {
                supportersPromise = fetch(SUPPORTERS_URL, { cache: 'no-store' })
                    .then(function (response) {
                        if (!response.ok) throw new Error('Não foi possível consultar a lista.');
                        return response.text();
                    })
                    .then(function (text) {
                        const rows = text.replace(/^\uFEFF/, '').split(/\r?\n/)
                            .map(function (line) {
                                return line.split('\t').map(function (cell) {
                                    return cell.trim().replace(/^"(.*)"$/, '$1').replace(/""/g, '"');
                                });
                            })
                            .filter(function (row) {
                                return row.some(function (cell) { return cell.length > 0; });
                            });

                        let headerRow = -1;
                        let nameColumn = -1;
                        const headerPattern = /(nome|name|apoiador|apoiadora|contribuidor|supporter|usuário|usuario)/i;

                        for (let i = 0; i < Math.min(rows.length, 6); i += 1) {
                            const column = rows[i].findIndex(function (cell) {
                                return headerPattern.test(cell);
                            });
                            if (column >= 0) {
                                headerRow = i;
                                nameColumn = column;
                                break;
                            }
                        }

                        const startAt = headerRow >= 0 ? headerRow + 1 : 0;
                        const names = [];
                        const seen = new Set();

                        rows.slice(startAt).forEach(function (row) {
                            let name = nameColumn >= 0
                                ? row[nameColumn]
                                : row.find(function (cell) {
                                    return cell &&
                                        !/^(\d{1,4}[\/.-]\d{1,2}[\/.-]\d{1,4}|\d{1,2}:\d{2})$/.test(cell) &&
                                        !/^[R$€]?\s*[\d.,]+(?:\s*[R$€])?$/.test(cell) &&
                                        !/@/.test(cell) &&
                                        !/^https?:\/\//i.test(cell);
                                });

                            name = String(name || '').trim();
                            if (!name || headerPattern.test(name) || /^(total|anônimo|anonimo|—|-|n\/a)$/i.test(name)) return;
                            if (/@/.test(name) || /^https?:\/\//i.test(name)) return;

                            const key = name.toLocaleLowerCase('pt-BR');
                            if (!seen.has(key)) {
                                seen.add(key);
                                names.push(name);
                            }
                        });

                        return names;
                    })
                    .catch(function () {
                        return null;
                    });
            }

            listElement.innerHTML = '<li>Carregando...</li>';
            supportersPromise.then(function (names) {
                if (!listElement.isConnected) return;

                if (names === null) {
                    listElement.innerHTML = '<li>Lista indisponível no momento.</li>';
                    return;
                }
                if (!names.length) {
                    listElement.innerHTML = '<li>Ainda não há nomes publicados.</li>';
                    return;
                }

                listElement.innerHTML = names.map(function (name) {
                    return '<li>' + escapeHTML(name) + '</li>';
                }).join('');
            });
        }

        function showHome() {
            detailView.hidden = true;
            detailView.innerHTML = '';
            homeView.hidden = false;
        }

        function showHelpMenu() {
            homeView.hidden = true;
            detailView.hidden = false;
            detailView.innerHTML = [
                '<p class="ac-kicker">AJUDA</p>',
                '<h1>O que você quer aprender?</h1>',
                '<div class="ac-tutorial-list">',
                    Object.keys(TUTORIALS).map(function (key) {
                        const item = TUTORIALS[key];
                        return '<button type="button" class="ac-tutorial-choice" data-tutorial="' + key + '">' +
                            '<span><strong>' + escapeHTML(item.label) + '</strong><small>' + escapeHTML(item.description) + '</small></span>' +
                            '<span class="ac-tutorial-arrow" aria-hidden="true">›</span>' +
                        '</button>';
                    }).join(''),
                '</div>',
                '<button type="button" class="ac-back" data-action="back">← VOLTAR</button>'
            ].join('');
        }

        function showDetail(kind) {
            homeView.hidden = true;
            detailView.hidden = false;

            const backButton = '<button type="button" class="ac-back" data-action="back">← VOLTAR</button>';
            let content = '';

            if (kind === 'dev') {
                content = [
                    '<p class="ac-kicker">DEV</p>',
                    '<h1>Como o projeto funciona.</h1>',
                    '<p class="ac-copy">O ANOTADO é um aplicativo web. O núcleo fica no index.html e os dados de trabalho são guardados localmente no navegador.</p>',
                    '<ul class="ac-facts">',
                        '<li><strong>index.html</strong> — interface e funcionamento principal.</li>',
                        '<li><strong>IndexedDB</strong> — armazenamento local dos projetos.</li>',
                        '<li><strong>plugin-store/</strong> — extensões separadas, com manifest.json e script.js.</li>',
                    '</ul>',
                    '<p class="ac-copy">As extensões são registradas em ANOTADO_PLUGINS e montadas pelo aplicativo.</p>',
                    '<a class="ac-link" href="' + REPOSITORY_URL + '" target="_blank" rel="noopener noreferrer">Abrir repositório ↗</a>',
                    backButton
                ].join('');
            } else if (kind === 'deluxe') {
                content = [
                    '<p class="ac-kicker">CHEFÃO</p>',
                    '<h1>Versão Deluxe.</h1>',
                    '<p class="ac-copy">Fundada por W. F. Fukuta, a Versão Deluxe reúne pessoas que buscam desenvolver a melhor versão de si mesmas por meio de projetos coletivos e individuais.</p>',
                    '<p class="ac-copy">A empresa coordena o trabalho e gerencia o repositório do ANOTADO.</p>',
                    backButton
                ].join('');
            } else if (kind === 'thanks') {
                content = [
                    '<p class="ac-kicker">OBRIGADO</p>',
                    '<h1>Este projeto é feito em conjunto.</h1>',
                    '<p class="ac-copy">W. F. Fukuta criou sozinho a estrutura e a base do aplicativo. Nosso agradecimento também a todos os desenvolvedores que contribuem com ideias, código e melhorias.</p>',
                    '<a class="ac-link" href="' + REPOSITORY_URL + '" target="_blank" rel="noopener noreferrer">Ver projeto no GitHub ↗</a>',
                    '<section class="ac-supporters">',
                        '<h2>Apoiadores</h2>',
                        '<p class="ac-copy">Obrigado a quem ajuda a manter o projeto.</p>',
                        '<ul data-role="supporters" aria-live="polite"><li>Carregando...</li></ul>',
                    '</section>',
                    '<section class="ac-donation">',
                        '<div class="ac-donation-copy">',
                            '<h2>Apoie o ANOTADO</h2>',
                            '<p>Uma contribuição ajuda o projeto a continuar.</p>',
                            '<button type="button" class="ac-donate-btn" id="ac-donate-toggle" aria-expanded="false">DOAR</button>',
                        '</div>',
                        '<div class="ac-qr-panel" id="ac-qr-panel" hidden>',
                            '<p class="ac-qr-caption">Escaneie o QR Code para contribuir.</p>',
                            '<img src="' + DONATION_QR_DATA + '" alt="QR Code de doação para o ANOTADO" width="190" height="190">',
                        '</div>',
                    '</section>',
                    backButton
                ].join('');
            }

            detailView.innerHTML = content;

            if (kind === 'thanks') {
                loadSupporters(detailView.querySelector('[data-role="supporters"]'));

                const donateButton = detailView.querySelector('#ac-donate-toggle');
                const qrPanel = detailView.querySelector('#ac-qr-panel');
                donateButton.addEventListener('click', function () {
                    const isOpening = qrPanel.hidden;
                    qrPanel.hidden = !isOpening;
                    donateButton.textContent = isOpening ? 'FECHAR QR CODE' : 'DOAR';
                    donateButton.setAttribute('aria-expanded', String(isOpening));
                });
            }
        }

        function clearTourHighlight() {
            if (!tourState) return;

            if (tourState.target && tourState.originalStyles) {
                tourState.target.style.outline = tourState.originalStyles.outline;
                tourState.target.style.outlineOffset = tourState.originalStyles.outlineOffset;
                tourState.target.style.boxShadow = tourState.originalStyles.boxShadow;
            }
            if (tourState.target && tourState.targetListener) {
                tourState.target.removeEventListener('click', tourState.targetListener, true);
            }
            if (tourState.target && tourState.inputListener) {
                tourState.target.removeEventListener('input', tourState.inputListener);
            }
            if (tourState.pendingTimer) window.clearTimeout(tourState.pendingTimer);

            tourState.target = null;
            tourState.originalStyles = null;
            tourState.targetListener = null;
            tourState.inputListener = null;
            tourState.pendingTimer = null;
        }

        function positionTourBubble() {
            if (!tourState || !tourState.bubble) return;

            const bubbleRect = tourState.bubble.getBoundingClientRect();
            const margin = 12;
            if (!tourState.target) {
                tourState.bubble.style.top = Math.max(margin, (window.innerHeight - bubbleRect.height) / 2) + 'px';
                tourState.bubble.style.left = Math.max(margin, (window.innerWidth - bubbleRect.width) / 2) + 'px';
                return;
            }

            const targetRect = tourState.target.getBoundingClientRect();
            const below = targetRect.bottom + 14;
            const top = below + bubbleRect.height <= window.innerHeight - margin
                ? below
                : Math.max(margin, targetRect.top - bubbleRect.height - 14);
            const left = Math.max(margin, Math.min(
                window.innerWidth - bubbleRect.width - margin,
                targetRect.left + targetRect.width / 2 - bubbleRect.width / 2
            ));
            tourState.bubble.style.top = top + 'px';
            tourState.bubble.style.left = left + 'px';
        }

        function finishHelpTour(returnToHelp) {
            if (!tourState) return;
            clearTourHighlight();
            window.removeEventListener('resize', tourState.reposition);
            window.removeEventListener('scroll', tourState.reposition, true);
            if (tourState.backdrop) tourState.backdrop.remove();
            if (tourState.bubble) tourState.bubble.remove();
            if (tourState.hiddenElement) {
                tourState.hiddenElement.style.visibility = tourState.previousVisibility;
            }
            tourState = null;
            if (returnToHelp !== false && !disposed) showHelpMenu();
        }

        function resolveTutorialTarget(step) {
            const matches = Array.from(document.querySelectorAll(step.selector)).filter(isVisible);
            if (!matches.length) return null;
            if (step.lastMatch) return matches[matches.length - 1];
            return matches[0];
        }

        function renderTutorialStep() {
            if (!tourState || disposed) return;
            clearTourHighlight();

            const tutorial = tourState.tutorial;
            if (tourState.index >= tutorial.steps.length) {
                tourState.target = null;
                tourState.bubble.innerHTML = [
                    '<p class="ac-tour-count">AULA CONCLUÍDA</p>',
                    '<h2>Você conseguiu!</h2>',
                    '<p class="ac-tour-text">' + escapeHTML(tutorial.success) + '</p>',
                    '<div class="ac-tour-footer"><span></span><button type="button" class="ac-tour-next" data-tour-done>VOLTAR À AJUDA</button></div>'
                ].join('');
                tourState.bubble.querySelector('[data-tour-done]').addEventListener('click', function () {
                    finishHelpTour(true);
                });
                positionTourBubble();
                return;
            }

            const step = tutorial.steps[tourState.index];
            const target = resolveTutorialTarget(step);

            if (!target) {
                tourState.target = null;
                tourState.bubble.innerHTML = [
                    '<p class="ac-tour-count">ETAPA ' + (tourState.index + 1) + ' / ' + tutorial.steps.length + '</p>',
                    '<h2>Ferramenta não encontrada</h2>',
                    '<p class="ac-tour-text">Não encontrei esse controle na tela. Volte ao quadro do ANOTADO e tente novamente.</p>',
                    '<div class="ac-tour-footer"><button type="button" data-tour-exit>SAIR</button><button type="button" class="ac-tour-next" data-tour-retry>TENTAR NOVAMENTE</button></div>'
                ].join('');
                tourState.bubble.querySelector('[data-tour-exit]').addEventListener('click', function () {
                    finishHelpTour(true);
                });
                tourState.bubble.querySelector('[data-tour-retry]').addEventListener('click', renderTutorialStep);
                positionTourBubble();
                return;
            }

            tourState.target = target;
            tourState.originalStyles = {
                outline: target.style.outline,
                outlineOffset: target.style.outlineOffset,
                boxShadow: target.style.boxShadow
            };

            if (step.scrollIntoView) {
                try { target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }); } catch (_) {}
            }

            target.style.outline = '2px solid #64748b';
            target.style.outlineOffset = '5px';
            target.style.boxShadow = '0 0 0 8px rgba(100,116,139,.18)';

            const manual = step.trigger === 'manual' || step.trigger === 'input';
            tourState.bubble.innerHTML = [
                '<p class="ac-tour-count">ETAPA ' + (tourState.index + 1) + ' / ' + tutorial.steps.length + '</p>',
                '<h2>' + escapeHTML(step.title) + '</h2>',
                '<p class="ac-tour-text">' + escapeHTML(step.text) + '</p>',
                '<div class="ac-tour-footer">',
                    '<button type="button" data-tour-exit>SAIR</button>',
                    manual
                        ? '<button type="button" class="ac-tour-next" data-tour-next>PRÓXIMO</button>'
                        : '<span class="ac-tour-hint">Toque no item destacado</span>',
                '</div>'
            ].join('');

            tourState.bubble.querySelector('[data-tour-exit]').addEventListener('click', function () {
                finishHelpTour(true);
            });

            if (manual) {
                const nextButton = tourState.bubble.querySelector('[data-tour-next]');
                if (step.trigger === 'input' && step.requireChange) {
                    const initialValue = target.isContentEditable ? target.innerText : target.value;
                    nextButton.disabled = true;
                    tourState.inputListener = function () {
                        const nextValue = target.isContentEditable ? target.innerText : target.value;
                        nextButton.disabled = nextValue.trim().length === 0 || nextValue === initialValue;
                    };
                    target.addEventListener('input', tourState.inputListener);
                }
                nextButton.addEventListener('click', function () {
                    if (!tourState || nextButton.disabled) return;
                    tourState.index += 1;
                    renderTutorialStep();
                });
            } else if (step.trigger === 'click') {
                tourState.targetListener = function () {
                    if (!tourState) return;
                    tourState.pendingTimer = window.setTimeout(function () {
                        if (!tourState || disposed) return;
                        tourState.index += 1;
                        renderTutorialStep();
                    }, Number(step.delay) || 180);
                };
                target.addEventListener('click', tourState.targetListener, true);
            }

            positionTourBubble();
        }

        function startTutorial(key) {
            const tutorial = TUTORIALS[key];
            if (!tutorial) return;
            if (tourState) finishHelpTour(false);

            const hostWindow = windowConfig.hostWindow || panel;
            const previousVisibility = hostWindow.style.visibility;
            hostWindow.style.visibility = 'hidden';

            const backdrop = document.createElement('div');
            backdrop.className = 'ac-tour-backdrop';
            backdrop.setAttribute('aria-hidden', 'true');

            const bubble = document.createElement('div');
            bubble.className = 'ac-tour-bubble';
            bubble.setAttribute('role', 'dialog');
            bubble.setAttribute('aria-label', 'Aula interativa: ' + tutorial.label);
            document.body.appendChild(backdrop);
            document.body.appendChild(bubble);

            tourState = {
                index: 0,
                tutorial: tutorial,
                target: null,
                originalStyles: null,
                targetListener: null,
                inputListener: null,
                pendingTimer: null,
                backdrop: backdrop,
                bubble: bubble,
                hiddenElement: hostWindow,
                previousVisibility: previousVisibility,
                reposition: positionTourBubble
            };

            window.addEventListener('resize', positionTourBubble);
            window.addEventListener('scroll', positionTourBubble, true);
            renderTutorialStep();
        }

        panel.querySelectorAll('[data-action]').forEach(function (button) {
            button.addEventListener('click', function () {
                const action = button.getAttribute('data-action');
                if (action === 'help') {
                    showHelpMenu();
                } else if (action === 'dev' || action === 'deluxe' || action === 'thanks') {
                    showDetail(action);
                }
            });
        });

        detailView.addEventListener('click', function (event) {
            const tutorialButton = event.target.closest('[data-tutorial]');
            if (tutorialButton) {
                startTutorial(tutorialButton.getAttribute('data-tutorial'));
                return;
            }
            if (event.target.closest('[data-action="back"]')) showHome();
        });

        function unmount() {
            if (disposed) return;
            disposed = true;
            finishHelpTour(false);
            windowConfig.cleanup();
            panel.remove();

            if (mountedInstances.get(container) === unmount) {
                mountedInstances.delete(container);
            }
        }

        mountedInstances.set(container, unmount);
        return { unmount: unmount };
    }

    global.ANOTADO_PLUGINS = global.ANOTADO_PLUGINS || Object.create(null);
    global.ANOTADO_PLUGINS[PLUGIN_ID] = {
        id: PLUGIN_ID,
        version: PLUGIN_VERSION,
        apiVersion: '2.0.0',
        mount: mount
    };
})(window);
