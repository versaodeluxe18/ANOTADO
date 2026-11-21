/*
 * ANOTADO Plugin: Comunidade ANOTADO
 * Version: 1.0.0
 *
 * Extensão institucional e informativa.
 * Não acessa projetos, anotações, armazenamento ou dados pessoais.
 */
(function registerCommunityPlugin(global) {
    'use strict';

    const PLUGIN_ID = 'comunidade-anotado';
    const PLUGIN_VERSION = '1.0.1';
    const REPOSITORY_URL = 'https://github.com/versaodeluxe18/ANOTADO';
    const COMMITS_URL = REPOSITORY_URL + '/commits/main/';
    const mountedInstances = new WeakMap();

    // Inclua novos comunicados no início desta lista ao publicar atualizações.
    // As datas e os textos são exibidos exatamente como definidos aqui.
    const UPDATES = [
        {
            date: '21 de novembro de 2026',
            category: 'Comunidade',
            title: 'O espaço da comunidade chegou',
            description: 'Esta primeira versão apresenta a história do ANOTADO e reúne em um só lugar os caminhos para acompanhar a evolução do projeto.'
        }
    ];

    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderUpdates() {
        if (!UPDATES.length) {
            return '<p class="ac-empty">Ainda não há comunicados publicados. Volte em uma próxima atualização.</p>';
        }

        return UPDATES.map(function (update) {
            return [
                '<article class="ac-update">',
                    '<div class="ac-update-meta">',
                        '<span class="ac-update-category">', escapeHTML(update.category), '</span>',
                        '<time>', escapeHTML(update.date), '</time>',
                    '</div>',
                    '<h3>', escapeHTML(update.title), '</h3>',
                    '<p>', escapeHTML(update.description), '</p>',
                '</article>'
            ].join('');
        }).join('');
    }

    function configureCommunityWindow(container) {
        const hostWindow = container && container.parentElement;
        if (!hostWindow) return function () {};

        // O host cria o contêiner ancorado no canto inferior.
        // A extensão assume a posição da própria janela para que todo o painel
        // comece visível, independentemente da altura do conteúdo.
        hostWindow.style.position = 'fixed';
        hostWindow.style.top = '16px';
        hostWindow.style.right = '16px';
        hostWindow.style.bottom = 'auto';
        hostWindow.style.left = 'auto';
        hostWindow.style.width = 'min(900px, calc(100vw - 32px))';
        hostWindow.style.maxWidth = 'calc(100vw - 16px)';
        hostWindow.style.maxHeight = 'calc(100vh - 32px)';
        hostWindow.style.overflow = 'hidden';
        hostWindow.style.display = 'flex';
        hostWindow.style.flexDirection = 'column';
        hostWindow.style.boxSizing = 'border-box';

        // O cabeçalho do host permanece visível; o conteúdo comprido rola por dentro.
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
        }

        function clampWindow() {
            if (!hostWindow.isConnected) return;

            const rect = hostWindow.getBoundingClientRect();
            const margin = 8;
            const maxLeft = Math.max(margin, window.innerWidth - rect.width - margin);
            const maxTop = Math.max(margin, window.innerHeight - rect.height - margin);
            const left = Math.min(maxLeft, Math.max(margin, rect.left));
            const top = Math.min(maxTop, Math.max(margin, rect.top));

            // Usar left/top e liberar right/bottom permite que o arraste nativo
            // do cabeçalho do ANOTADO continue funcionando sem conflito de âncoras.
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

        return function cleanupCommunityWindow() {
            window.removeEventListener('resize', clampWindow);
            if (frame !== null && window.cancelAnimationFrame) {
                window.cancelAnimationFrame(frame);
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
            '.anotado-community {',
                '--ac-ink: #141b2b;',
                '--ac-muted: #667085;',
                '--ac-line: #e4e8ef;',
                '--ac-card: #ffffff;',
                '--ac-soft: #f5f7fb;',
                '--ac-accent: #315fbd;',
                'width: 100%; max-width: 900px; margin: 0 auto;',
                'color: var(--ac-ink); font-family: Inter, ui-sans-serif, system-ui, sans-serif;',
                'font-size: 14px; line-height: 1.6;',
            '}',
            '.anotado-community *, .anotado-community *::before, .anotado-community *::after { box-sizing: border-box; }',
            '.anotado-community a { color: inherit; text-decoration: none; }',
            '.anotado-community a:focus-visible { outline: 3px solid rgba(49,95,189,.45); outline-offset: 3px; }',
            '.anotado-community .ac-shell { display: flex; flex-direction: column; gap: 26px; }',
            '.anotado-community .ac-topline { display: flex; align-items: center; justify-content: space-between; gap: 14px; }',
            '.anotado-community .ac-brand { display: flex; align-items: center; gap: 11px; min-width: 0; }',
            '.anotado-community .ac-mark { display: grid; width: 40px; height: 40px; flex: 0 0 40px; place-items: center; border-radius: 12px; background: #141b2b; color: #fff; font-size: 18px; font-weight: 800; letter-spacing: -.06em; }',
            '.anotado-community .ac-brand-copy { display: flex; flex-direction: column; line-height: 1.35; }',
            '.anotado-community .ac-brand-copy strong { font-size: 13px; font-weight: 800; letter-spacing: .02em; }',
            '.anotado-community .ac-brand-copy span { color: var(--ac-muted); font-size: 11px; }',
            '.anotado-community .ac-official { display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--ac-line); border-radius: 999px; padding: 5px 10px; color: var(--ac-muted); font-size: 10px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; white-space: nowrap; }',
            '.anotado-community .ac-dot { width: 6px; height: 6px; border-radius: 50%; background: #4b9a75; }',
            '.anotado-community .ac-hero { position: relative; display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(145px, .55fr); align-items: center; gap: 20px; overflow: hidden; border: 1px solid #dce3ef; border-radius: 22px; padding: clamp(22px, 4vw, 38px); background: linear-gradient(120deg, #f5f7fc 0%, #edf2fb 58%, #e2ebfb 100%); }',
            '.anotado-community .ac-kicker, .anotado-community .ac-eyebrow { margin: 0 0 8px; color: var(--ac-accent); font-size: 10px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }',
            '.anotado-community .ac-hero h1 { max-width: 590px; margin: 0; color: #141b2b; font-size: clamp(27px, 4vw, 42px); font-weight: 750; letter-spacing: -.055em; line-height: 1.08; }',
            '.anotado-community .ac-hero-copy { max-width: 560px; margin: 14px 0 20px; color: #586477; font-size: 13px; line-height: 1.75; }',
            '.anotado-community .ac-primary-link { display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-height: 42px; border-radius: 11px; padding: 0 15px; background: #141b2b; color: #fff; font-size: 12px; font-weight: 700; transition: transform .18s ease, background .18s ease; }',
            '.anotado-community .ac-primary-link:hover { transform: translateY(-1px); background: #263653; }',
            '.anotado-community .ac-primary-link svg, .anotado-community .ac-text-link svg { width: 15px; height: 15px; flex: 0 0 15px; }',
            '.anotado-community .ac-hero-art { display: grid; min-height: 155px; place-items: center; }',
            '.anotado-community .ac-orbit { position: relative; display: grid; width: 150px; height: 150px; place-items: center; border: 1px solid rgba(49,95,189,.18); border-radius: 50%; background: rgba(255,255,255,.42); }',
            '.anotado-community .ac-orbit::before, .anotado-community .ac-orbit::after { position: absolute; content: ""; border: 1px solid rgba(49,95,189,.17); border-radius: 50%; }',
            '.anotado-community .ac-orbit::before { inset: 15px; }',
            '.anotado-community .ac-orbit::after { inset: 31px; }',
            '.anotado-community .ac-orbit-mark { z-index: 1; display: grid; width: 58px; height: 58px; place-items: center; border-radius: 18px; background: #141b2b; box-shadow: 0 12px 30px rgba(20,27,43,.2); color: #fff; font-size: 27px; font-weight: 800; letter-spacing: -.08em; }',
            '.anotado-community .ac-section { display: flex; flex-direction: column; gap: 16px; }',
            '.anotado-community .ac-section-heading { max-width: 650px; }',
            '.anotado-community .ac-section-heading h2, .anotado-community .ac-updates h2, .anotado-community .ac-cta h2 { margin: 0; color: var(--ac-ink); font-size: clamp(21px, 3vw, 27px); font-weight: 750; letter-spacing: -.04em; line-height: 1.2; }',
            '.anotado-community .ac-section-heading > p:last-child { margin: 8px 0 0; color: var(--ac-muted); font-size: 12px; line-height: 1.7; }',
            '.anotado-community .ac-origin { display: grid; grid-template-columns: 190px minmax(0, 1fr); gap: 22px; align-items: center; border: 1px solid var(--ac-line); border-radius: 17px; padding: 20px; background: var(--ac-card); }',
            '.anotado-community .ac-signature { display: flex; align-items: center; gap: 11px; }',
            '.anotado-community .ac-monogram { display: grid; width: 44px; height: 44px; place-items: center; border-radius: 14px; background: var(--ac-soft); color: var(--ac-ink); font-size: 14px; font-weight: 800; letter-spacing: -.04em; }',
            '.anotado-community .ac-signature-copy { display: flex; flex-direction: column; line-height: 1.4; }',
            '.anotado-community .ac-signature-copy strong { color: var(--ac-ink); font-size: 12px; }',
            '.anotado-community .ac-signature-copy span { color: var(--ac-muted); font-size: 10px; }',
            '.anotado-community .ac-origin-text { margin: 0; color: var(--ac-muted); font-size: 12px; line-height: 1.8; }',
            '.anotado-community .ac-chapters { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }',
            '.anotado-community .ac-chapter { min-height: 145px; border: 1px solid var(--ac-line); border-radius: 15px; padding: 16px; background: var(--ac-card); }',
            '.anotado-community .ac-chapter-index { color: var(--ac-accent); font-size: 10px; font-weight: 800; letter-spacing: .12em; }',
            '.anotado-community .ac-chapter h3 { margin: 10px 0 6px; color: var(--ac-ink); font-size: 14px; font-weight: 750; letter-spacing: -.02em; }',
            '.anotado-community .ac-chapter p { margin: 0; color: var(--ac-muted); font-size: 11px; line-height: 1.65; }',
            '.anotado-community .ac-updates { display: flex; flex-direction: column; gap: 14px; border: 1px solid var(--ac-line); border-radius: 18px; padding: clamp(18px, 3vw, 24px); background: var(--ac-soft); }',
            '.anotado-community .ac-updates-head { display: flex; align-items: end; justify-content: space-between; gap: 14px; }',
            '.anotado-community .ac-updates-head p { margin: 0 0 6px; color: var(--ac-accent); font-size: 10px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }',
            '.anotado-community .ac-update-list { display: flex; flex-direction: column; gap: 10px; }',
            '.anotado-community .ac-update { border: 1px solid var(--ac-line); border-radius: 13px; padding: 15px 16px; background: var(--ac-card); }',
            '.anotado-community .ac-update-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 12px; margin-bottom: 7px; }',
            '.anotado-community .ac-update-category { border-radius: 999px; padding: 3px 8px; background: var(--ac-soft); color: var(--ac-accent); font-size: 9px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; }',
            '.anotado-community .ac-update time { color: var(--ac-muted); font-size: 10px; }',
            '.anotado-community .ac-update h3 { margin: 0 0 4px; color: var(--ac-ink); font-size: 13px; font-weight: 750; }',
            '.anotado-community .ac-update p, .anotado-community .ac-empty { margin: 0; color: var(--ac-muted); font-size: 11px; line-height: 1.7; }',
            '.anotado-community .ac-updates-note { margin: 0; color: var(--ac-muted); font-size: 10px; line-height: 1.65; }',
            '.anotado-community .ac-cta { display: flex; align-items: center; justify-content: space-between; gap: 18px; border-radius: 18px; padding: 21px 22px; background: #141b2b; color: #fff; }',
            '.anotado-community .ac-cta .ac-eyebrow { color: #a9c5ff; }',
            '.anotado-community .ac-cta h2 { color: #fff; font-size: 20px; }',
            '.anotado-community .ac-cta p:last-child { max-width: 570px; margin: 7px 0 0; color: #c7cfdd; font-size: 11px; line-height: 1.7; }',
            '.anotado-community .ac-text-link { display: inline-flex; align-items: center; gap: 7px; flex: 0 0 auto; border: 1px solid rgba(255,255,255,.3); border-radius: 10px; padding: 9px 12px; color: #fff; font-size: 11px; font-weight: 700; }',
            '.anotado-community .ac-text-link:hover { background: rgba(255,255,255,.1); }',
            '.anotado-community .ac-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 2px; color: var(--ac-muted); font-size: 10px; }',
            '.anotado-community .ac-footer strong { color: var(--ac-ink); font-weight: 750; }',
            'html.dark .anotado-community { --ac-ink: #f2f4f8; --ac-muted: #aab3c2; --ac-line: #343d4d; --ac-card: #202733; --ac-soft: #1a2230; --ac-accent: #a9c5ff; }',
            'html.dark .anotado-community .ac-hero { border-color: #34435d; background: linear-gradient(120deg, #202c40 0%, #1d2b43 60%, #22395b 100%); }',
            'html.dark .anotado-community .ac-hero h1 { color: #f4f6fb; }',
            'html.dark .anotado-community .ac-hero-copy { color: #c1cada; }',
            'html.dark .anotado-community .ac-primary-link { background: #f2f4f8; color: #141b2b; }',
            'html.dark .anotado-community .ac-primary-link:hover { background: #dce6f8; }',
            'html.dark .anotado-community .ac-mark, html.dark .anotado-community .ac-orbit-mark { background: #edf2fb; color: #141b2b; }',
            'html.dark .anotado-community .ac-cta { background: #101722; }',
            '@media (max-width: 620px) {',
                '.anotado-community .ac-hero { grid-template-columns: 1fr; }',
                '.anotado-community .ac-hero-art { display: none; }',
                '.anotado-community .ac-origin { grid-template-columns: 1fr; gap: 13px; }',
                '.anotado-community .ac-chapters { grid-template-columns: 1fr; }',
                '.anotado-community .ac-chapter { min-height: 0; }',
                '.anotado-community .ac-updates-head { align-items: start; flex-direction: column; }',
                '.anotado-community .ac-cta { align-items: start; flex-direction: column; }',
            '}',
            '@media (prefers-reduced-motion: reduce) { .anotado-community .ac-primary-link { transition: none; } }'
        ].join('\n');

        panel.innerHTML = [
            '<div class="ac-shell">',
                '<div class="ac-topline">',
                    '<div class="ac-brand">',
                        '<span class="ac-mark" aria-hidden="true">A.</span>',
                        '<span class="ac-brand-copy"><strong>ANOTADO</strong><span>Comunidade · Versão Deluxe</span></span>',
                    '</div>',
                    '<span class="ac-official"><span class="ac-dot" aria-hidden="true"></span> Espaço oficial</span>',
                '</div>',

                '<header class="ac-hero">',
                    '<div>',
                        '<p class="ac-kicker">PARA QUEM FAZ PARTE</p>',
                        '<h1>O ANOTADO também é feito por quem usa.</h1>',
                        '<p class="ac-hero-copy">Se o ANOTADO já faz parte da sua rotina, este espaço é seu. Conheça a origem do projeto, acompanhe as novidades e descubra os próximos passos dessa jornada.</p>',
                        '<a class="ac-primary-link" href="', COMMITS_URL, '" target="_blank" rel="noopener noreferrer">',
                            'Acompanhar novidades',
                            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
                        '</a>',
                    '</div>',
                    '<div class="ac-hero-art" aria-hidden="true"><div class="ac-orbit"><span class="ac-orbit-mark">A.</span></div></div>',
                '</header>',

                '<section class="ac-section" aria-labelledby="ac-origin-title">',
                    '<div class="ac-section-heading">',
                        '<p class="ac-eyebrow">DE ONDE VIEMOS</p>',
                        '<h2 id="ac-origin-title">Uma ideia que ganhou forma.</h2>',
                        '<p>Por trás do aplicativo existe uma história de criação, experimentação e vontade de construir um espaço próprio para organizar ideias.</p>',
                    '</div>',
                    '<div class="ac-origin">',
                        '<div class="ac-signature">',
                            '<span class="ac-monogram" aria-hidden="true">WF</span>',
                            '<span class="ac-signature-copy"><strong>W. F. Fukuta</strong><span>Criador · Versão Deluxe</span></span>',
                        '</div>',
                        '<p class="ac-origin-text">O ANOTADO foi criado por W. F. Fukuta, pela Versão Deluxe, para reunir em um só lugar anotações, projetos, notas adesivas, desenhos e ferramentas de organização visual. A proposta é oferecer liberdade para registrar pensamentos, estruturar ideias e desenvolver projetos do seu próprio jeito.</p>',
                    '</div>',
                    '<div class="ac-chapters">',
                        '<article class="ac-chapter"><span class="ac-chapter-index">01 / A IDEIA</span><h3>Registrar sem limitar.</h3><p>Um espaço flexível para escrever, desenhar e organizar pensamentos de diferentes maneiras.</p></article>',
                        '<article class="ac-chapter"><span class="ac-chapter-index">02 / A CONSTRUÇÃO</span><h3>Dar forma às ideias.</h3><p>O projeto ganhou ferramentas para reunir notas, páginas, desenhos e projetos em uma área de trabalho visual.</p></article>',
                        '<article class="ac-chapter"><span class="ac-chapter-index">03 / A COMUNIDADE</span><h3>A próxima etapa é compartilhada.</h3><p>Quem usa o ANOTADO ajuda a revelar o que funciona, o que faz falta e quais caminhos merecem ser explorados.</p></article>',
                    '</div>',
                '</section>',

                '<section class="ac-updates" aria-labelledby="ac-updates-title">',
                    '<div class="ac-updates-head">',
                        '<div><p>FIQUE POR DENTRO</p><h2 id="ac-updates-title">Novidades do ANOTADO</h2></div>',
                    '</div>',
                    '<div class="ac-update-list" data-role="updates"></div>',
                    '<p class="ac-updates-note">Os comunicados desta área são publicados junto às atualizações da extensão. Para acompanhar as alterações públicas do projeto no GitHub, use o link abaixo.</p>',
                    '<a class="ac-text-link" href="', COMMITS_URL, '" target="_blank" rel="noopener noreferrer" style="align-self:flex-start;background:var(--ac-card);color:var(--ac-ink);border-color:var(--ac-line);">',
                        'Ver histórico de atualizações',
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>',
                    '</a>',
                '</section>',

                '<section class="ac-cta" aria-labelledby="ac-cta-title">',
                    '<div>',
                        '<p class="ac-eyebrow">CONTINUE POR PERTO</p>',
                        '<h2 id="ac-cta-title">A história ainda está sendo escrita.</h2>',
                        '<p>Acompanhe o repositório oficial para conhecer o desenvolvimento do ANOTADO e descobrir as mudanças que estão sendo preparadas.</p>',
                    '</div>',
                    '<a class="ac-text-link" href="', REPOSITORY_URL, '" target="_blank" rel="noopener noreferrer">',
                        'Conhecer o projeto',
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>',
                    '</a>',
                '</section>',

                '<footer class="ac-footer"><span><strong>ANOTADO</strong> · Criado por W. F. Fukuta</span><span>Versão Deluxe</span></footer>',
            '</div>'
        ].join('');

        panel.insertBefore(style, panel.firstChild);
        container.appendChild(panel);

        const updatesElement = panel.querySelector('[data-role="updates"]');
        if (updatesElement) updatesElement.innerHTML = renderUpdates();

        const cleanupCommunityWindow = configureCommunityWindow(container);

        let disposed = false;

        function unmount() {
            if (disposed) return;
            disposed = true;
            cleanupCommunityWindow();
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
