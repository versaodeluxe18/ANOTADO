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
                '--ac-ink: #191c1e;',
                '--ac-muted: #585f6c;',
                '--ac-line: #c6c6cd;',
                '--ac-card: #ffffff;',
                '--ac-soft: #f3f4f6;',
                '--ac-primary: #141b2b;',
                'width: 100%; max-width: 900px; margin: 0 auto;',
                'color: var(--ac-ink); font-family: Inter, ui-sans-serif, system-ui, sans-serif;',
                'font-size: 13px; line-height: 1.65;',
            '}',
            '.anotado-community *, .anotado-community *::before, .anotado-community *::after { box-sizing: border-box; }',
            '.anotado-community a { color: inherit; text-decoration: none; }',
            '.anotado-community a:focus-visible { outline: 2px solid var(--ac-muted); outline-offset: 3px; }',
            '.anotado-community .ac-shell { display: flex; flex-direction: column; gap: 22px; padding: 4px; }',
            '.anotado-community .ac-topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-bottom: 14px; border-bottom: 1px solid var(--ac-line); }',
            '.anotado-community .ac-brand { display: flex; align-items: center; gap: 9px; min-width: 0; }',
            '.anotado-community .ac-mark { display: grid; width: 34px; height: 34px; flex: 0 0 34px; place-items: center; border-radius: 8px; background: var(--ac-primary); color: #fff; font-size: 16px; font-weight: 800; letter-spacing: -.06em; }',
            '.anotado-community .ac-brand-copy { display: flex; flex-direction: column; line-height: 1.35; }',
            '.anotado-community .ac-brand-copy strong { font-size: 12px; font-weight: 700; letter-spacing: .02em; }',
            '.anotado-community .ac-brand-copy span { color: var(--ac-muted); font-size: 10px; }',
            '.anotado-community .ac-official { color: var(--ac-muted); font-size: 10px; font-weight: 600; white-space: nowrap; }',
            '.anotado-community .ac-intro { max-width: 690px; }',
            '.anotado-community .ac-eyebrow { margin: 0 0 7px; color: var(--ac-muted); font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }',
            '.anotado-community .ac-intro h1 { margin: 0; color: var(--ac-ink); font-size: clamp(25px, 4vw, 32px); font-weight: 700; letter-spacing: -.045em; line-height: 1.15; }',
            '.anotado-community .ac-intro-copy { max-width: 620px; margin: 10px 0 0; color: var(--ac-muted); font-size: 12px; line-height: 1.75; }',
            '.anotado-community .ac-section-title { margin: 0 0 11px; color: var(--ac-ink); font-size: 16px; font-weight: 700; letter-spacing: -.02em; }',
            '.anotado-community .ac-update-list { display: flex; flex-direction: column; gap: 8px; }',
            '.anotado-community .ac-update { border: 1px solid var(--ac-line); border-radius: 8px; padding: 13px 14px; background: var(--ac-card); }',
            '.anotado-community .ac-update-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; margin-bottom: 5px; color: var(--ac-muted); font-size: 10px; }',
            '.anotado-community .ac-update-category { font-weight: 700; }',
            '.anotado-community .ac-update h3 { margin: 0 0 4px; color: var(--ac-ink); font-size: 13px; font-weight: 700; }',
            '.anotado-community .ac-update p, .anotado-community .ac-empty { margin: 0; color: var(--ac-muted); font-size: 11px; line-height: 1.7; }',
            '.anotado-community .ac-about { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 18px; border: 1px solid var(--ac-line); border-radius: 8px; padding: 15px; background: var(--ac-soft); }',
            '.anotado-community .ac-about-copy h2 { margin: 0 0 5px; color: var(--ac-ink); font-size: 14px; font-weight: 700; }',
            '.anotado-community .ac-about-copy p:last-child { max-width: 570px; margin: 0; color: var(--ac-muted); font-size: 11px; line-height: 1.7; }',
            '.anotado-community .ac-creator { display: flex; align-items: center; gap: 9px; min-width: 150px; }',
            '.anotado-community .ac-monogram { display: grid; width: 34px; height: 34px; flex: 0 0 34px; place-items: center; border: 1px solid var(--ac-line); border-radius: 8px; background: var(--ac-card); color: var(--ac-ink); font-size: 11px; font-weight: 700; }',
            '.anotado-community .ac-creator-copy { display: flex; flex-direction: column; line-height: 1.4; }',
            '.anotado-community .ac-creator-copy strong { color: var(--ac-ink); font-size: 11px; font-weight: 700; }',
            '.anotado-community .ac-creator-copy span { color: var(--ac-muted); font-size: 10px; }',
            '.anotado-community .ac-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 2px; color: var(--ac-muted); font-size: 10px; }',
            '.anotado-community .ac-footer strong { color: var(--ac-ink); font-weight: 700; }',
            '.anotado-community .ac-repository-link { display: inline-flex; align-items: center; gap: 5px; color: var(--ac-ink); font-size: 10px; font-weight: 700; text-decoration: underline !important; text-underline-offset: 3px; }',
            '.anotado-community .ac-repository-link svg { width: 12px; height: 12px; }',
            'html.dark .anotado-community { --ac-ink: #f2f4f8; --ac-muted: #aab3c2; --ac-line: #343d4d; --ac-card: #202733; --ac-soft: #1a2230; --ac-primary: #edf2fb; }',
            'html.dark .anotado-community .ac-mark { color: #141b2b; }',
            '@media (max-width: 620px) {',
                '.anotado-community .ac-about { grid-template-columns: 1fr; gap: 13px; }',
                '.anotado-community .ac-creator { min-width: 0; }',
                '.anotado-community .ac-footer { align-items: flex-start; flex-direction: column; gap: 7px; }',
            '}',
            '@media (prefers-reduced-motion: reduce) { .anotado-community * { scroll-behavior: auto !important; } }'
        ].join('\\n');

        panel.innerHTML = [
            '<div class="ac-shell">',
                '<header class="ac-topline">',
                    '<div class="ac-brand">',
                        '<span class="ac-mark" aria-hidden="true">A.</span>',
                        '<span class="ac-brand-copy"><strong>ANOTADO</strong><span>Comunidade · Versão Deluxe</span></span>',
                    '</div>',
                    '<span class="ac-official">ESPAÇO OFICIAL</span>',
                '</header>',

                '<section class="ac-intro" aria-labelledby="ac-community-title">',
                    '<p class="ac-eyebrow">PARA QUEM FAZ PARTE</p>',
                    '<h1 id="ac-community-title">Um espaço para quem usa o ANOTADO.</h1>',
                    '<p class="ac-intro-copy">Aqui você acompanha os comunicados do projeto e conhece um pouco mais sobre a ideia por trás do aplicativo. Sem excesso de atalhos: o essencial, dentro do próprio ANOTADO.</p>',
                '</section>',

                '<section class="ac-updates" aria-labelledby="ac-updates-title">',
                    '<p class="ac-eyebrow">ACOMPANHE O PROJETO</p>',
                    '<h2 class="ac-section-title" id="ac-updates-title">Novidades</h2>',
                    '<div class="ac-update-list" data-role="updates"></div>',
                '</section>',

                '<section class="ac-about" aria-label="Sobre o ANOTADO">',
                    '<div class="ac-about-copy">',
                        '<p class="ac-eyebrow">SOBRE O PROJETO</p>',
                        '<h2>Organizar ideias com liberdade.</h2>',
                        '<p>O ANOTADO reúne anotações, projetos, notas adesivas e desenhos em um espaço visual e flexível. O projeto é desenvolvido pela Versão Deluxe para tornar a organização mais simples e pessoal.</p>',
                    '</div>',
                    '<div class="ac-creator">',
                        '<span class="ac-monogram" aria-hidden="true">WF</span>',
                        '<span class="ac-creator-copy"><strong>W. F. Fukuta</strong><span>Criador do ANOTADO</span></span>',
                    '</div>',
                '</section>',

                '<footer class="ac-footer">',
                    '<span><strong>ANOTADO</strong> · Versão Deluxe</span>',
                    '<a class="ac-repository-link" href="', REPOSITORY_URL, '" target="_blank" rel="noopener noreferrer">',
                        'Repositório oficial',
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>',
                    '</a>',
                '</footer>',
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
