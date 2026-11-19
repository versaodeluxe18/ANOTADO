/*
 * ANOTADO Plugin: Temporizador de foco
 * Version: 1.0.0
 *
 * Contrato:
 *   window.ANOTADO_PLUGINS["temporizador-foco"].mount(container, api)
 *   -> { unmount() }
 *
 * Este plugin é autocontido. Não lê nem altera os dados do ANOTADO.
 */
(function registerFocusTimer(global) {
    'use strict';

    const PLUGIN_ID = 'temporizador-foco';
    const PLUGIN_VERSION = '1.0.0';
    const PRESETS = {
        focus: {
            label: 'Foco',
            duration: 25 * 60 * 1000,
            description: 'Um período para trabalhar com atenção.'
        },
        break: {
            label: 'Pausa',
            duration: 5 * 60 * 1000,
            description: 'Uma pausa curta para recuperar a atenção.'
        }
    };

    const mountedInstances = new WeakMap();

    function mount(container, api) {
        if (!container || typeof container.appendChild !== 'function') {
            throw new TypeError('O temporizador precisa de um elemento HTML como contêiner.');
        }

        // Evita duplicar a interface caso o host monte o plugin duas vezes.
        const previousUnmount = mountedInstances.get(container);
        if (previousUnmount) previousUnmount();

        const panel = document.createElement('section');
        panel.className = 'anotado-focus-timer';
        panel.setAttribute('aria-label', 'Temporizador de foco');
        panel.innerHTML = `
            <style>
                .anotado-focus-timer {
                    box-sizing: border-box;
                    width: 100%;
                    max-width: 420px;
                    color: #191c1e;
                    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
                }
                .anotado-focus-timer *,
                .anotado-focus-timer *::before,
                .anotado-focus-timer *::after { box-sizing: border-box; }
                .anotado-focus-timer .aft-card {
                    overflow: hidden;
                    border: 1px solid #d8d9de;
                    border-radius: 16px;
                    background: #ffffff;
                    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
                }
                .anotado-focus-timer .aft-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    padding: 16px 18px;
                    border-bottom: 1px solid #eceef1;
                }
                .anotado-focus-timer .aft-eyebrow {
                    margin: 0 0 3px;
                    color: #717782;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: .12em;
                    text-transform: uppercase;
                }
                .anotado-focus-timer .aft-title {
                    margin: 0;
                    font-size: 15px;
                    font-weight: 700;
                }
                .anotado-focus-timer .aft-version {
                    padding: 4px 7px;
                    border: 1px solid #e5e7eb;
                    border-radius: 999px;
                    color: #606875;
                    font-size: 10px;
                    white-space: nowrap;
                }
                .anotado-focus-timer .aft-body {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    padding: 22px 18px 20px;
                }
                .anotado-focus-timer .aft-modes {
                    display: flex;
                    gap: 6px;
                    padding: 4px;
                    border-radius: 999px;
                    background: #f1f2f4;
                }
                .anotado-focus-timer button {
                    font: inherit;
                    cursor: pointer;
                }
                .anotado-focus-timer button:focus-visible {
                    outline: 3px solid rgba(59, 130, 246, .45);
                    outline-offset: 2px;
                }
                .anotado-focus-timer .aft-mode {
                    border: 0;
                    border-radius: 999px;
                    padding: 8px 14px;
                    background: transparent;
                    color: #606875;
                    font-size: 12px;
                    font-weight: 600;
                }
                .anotado-focus-timer .aft-mode[aria-pressed="true"] {
                    background: #ffffff;
                    color: #191c1e;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, .10);
                }
                .anotado-focus-timer .aft-time {
                    margin: 0;
                    font-variant-numeric: tabular-nums;
                    font-size: clamp(48px, 12vw, 66px);
                    line-height: 1;
                    font-weight: 650;
                    letter-spacing: -.055em;
                }
                .anotado-focus-timer .aft-description {
                    min-height: 18px;
                    margin: -7px 0 0;
                    color: #737b87;
                    font-size: 12px;
                    text-align: center;
                }
                .anotado-focus-timer .aft-track {
                    width: 100%;
                    height: 6px;
                    overflow: hidden;
                    border-radius: 999px;
                    background: #eceef1;
                }
                .anotado-focus-timer .aft-progress {
                    width: 0;
                    height: 100%;
                    border-radius: inherit;
                    background: #202733;
                    transition: width .2s linear;
                }
                .anotado-focus-timer .aft-status {
                    min-height: 16px;
                    margin: -5px 0 0;
                    color: #626b77;
                    font-size: 11px;
                    text-align: center;
                }
                .anotado-focus-timer .aft-actions {
                    display: flex;
                    width: 100%;
                    gap: 8px;
                }
                .anotado-focus-timer .aft-action {
                    min-height: 40px;
                    border: 1px solid #d9dce2;
                    border-radius: 10px;
                    padding: 0 14px;
                    background: #ffffff;
                    color: #252a32;
                    font-size: 12px;
                    font-weight: 650;
                }
                .anotado-focus-timer .aft-action:disabled {
                    cursor: not-allowed;
                    opacity: .42;
                }
                .anotado-focus-timer .aft-action-primary {
                    flex: 1;
                    border-color: #202733;
                    background: #202733;
                    color: #ffffff;
                }
                .anotado-focus-timer .aft-footer {
                    padding: 11px 18px;
                    border-top: 1px solid #eceef1;
                    color: #828995;
                    font-size: 10px;
                    text-align: center;
                }
                @media (prefers-reduced-motion: reduce) {
                    .anotado-focus-timer .aft-progress { transition: none; }
                }
            </style>
            <div class="aft-card">
                <header class="aft-header">
                    <div>
                        <p class="aft-eyebrow">Extensão ANOTADO</p>
                        <h2 class="aft-title">Temporizador de foco</h2>
                    </div>
                    <span class="aft-version">v${PLUGIN_VERSION}</span>
                </header>
                <div class="aft-body">
                    <div class="aft-modes" role="group" aria-label="Tipo de sessão">
                        <button class="aft-mode" type="button" data-action="mode-focus" aria-pressed="true">Foco · 25 min</button>
                        <button class="aft-mode" type="button" data-action="mode-break" aria-pressed="false">Pausa · 5 min</button>
                    </div>
                    <p class="aft-time" data-role="time" role="timer" aria-live="off">25:00</p>
                    <p class="aft-description" data-role="description">Um período para trabalhar com atenção.</p>
                    <div class="aft-track" role="progressbar" aria-label="Progresso da sessão" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-role="track">
                        <div class="aft-progress" data-role="progress"></div>
                    </div>
                    <p class="aft-status" data-role="status" aria-live="polite">Pronto para começar.</p>
                    <div class="aft-actions">
                        <button class="aft-action aft-action-primary" type="button" data-action="start">Iniciar</button>
                        <button class="aft-action" type="button" data-action="pause" disabled>Pausar</button>
                        <button class="aft-action" type="button" data-action="reset">Zerar</button>
                    </div>
                </div>
                <footer class="aft-footer">O temporizador funciona localmente nesta página.</footer>
            </div>
        `;

        container.appendChild(panel);

        const timeElement = panel.querySelector('[data-role="time"]');
        const descriptionElement = panel.querySelector('[data-role="description"]');
        const statusElement = panel.querySelector('[data-role="status"]');
        const progressElement = panel.querySelector('[data-role="progress"]');
        const trackElement = panel.querySelector('[data-role="track"]');
        const startButton = panel.querySelector('[data-action="start"]');
        const pauseButton = panel.querySelector('[data-action="pause"]');
        const focusButton = panel.querySelector('[data-action="mode-focus"]');
        const breakButton = panel.querySelector('[data-action="mode-break"]');

        let mode = 'focus';
        let remainingMs = PRESETS[mode].duration;
        let endAt = null;
        let intervalId = null;
        let statusMessage = 'Pronto para começar.';
        let disposed = false;

        function formatTime(milliseconds) {
            const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
        }

        function clearClock() {
            if (intervalId !== null) {
                global.clearInterval(intervalId);
                intervalId = null;
            }
            endAt = null;
        }

        function render() {
            const preset = PRESETS[mode];
            const progress = Math.min(100, Math.max(0,
                ((preset.duration - remainingMs) / preset.duration) * 100
            ));
            const isRunning = intervalId !== null;

            timeElement.textContent = formatTime(remainingMs);
            descriptionElement.textContent = preset.description;
            statusElement.textContent = statusMessage;
            progressElement.style.width = progress + '%';
            trackElement.setAttribute('aria-valuenow', String(Math.round(progress)));

            focusButton.setAttribute('aria-pressed', String(mode === 'focus'));
            breakButton.setAttribute('aria-pressed', String(mode === 'break'));

            startButton.disabled = isRunning;
            pauseButton.disabled = !isRunning;

            if (isRunning) {
                startButton.textContent = 'Em andamento';
            } else if (remainingMs <= 0) {
                startButton.textContent = 'Iniciar novamente';
            } else {
                startButton.textContent = 'Iniciar';
            }
        }

        function tick() {
            if (disposed || endAt === null) return;

            remainingMs = Math.max(0, endAt - Date.now());
            if (remainingMs <= 0) {
                remainingMs = 0;
                clearClock();
                statusMessage = mode === 'focus'
                    ? 'Sessão concluída. Faça uma pausa.'
                    : 'Pausa concluída. Pronto para voltar?';
            }
            render();
        }

        function start() {
            if (intervalId !== null) return;

            if (remainingMs <= 0) {
                remainingMs = PRESETS[mode].duration;
            }

            endAt = Date.now() + remainingMs;
            statusMessage = mode === 'focus' ? 'Foco em andamento.' : 'Pausa em andamento.';
            intervalId = global.setInterval(tick, 250);
            render();
        }

        function pause() {
            if (intervalId === null) return;

            remainingMs = Math.max(0, endAt - Date.now());
            clearClock();
            statusMessage = remainingMs <= 0 ? 'Sessão concluída.' : 'Temporizador pausado.';
            if (remainingMs <= 0) remainingMs = 0;
            render();
        }

        function reset() {
            clearClock();
            remainingMs = PRESETS[mode].duration;
            statusMessage = 'Temporizador zerado.';
            render();
        }

        function selectMode(nextMode) {
            if (!PRESETS[nextMode] || nextMode === mode) return;

            clearClock();
            mode = nextMode;
            remainingMs = PRESETS[mode].duration;
            statusMessage = mode === 'focus' ? 'Pronto para focar.' : 'Pausa pronta.';
            render();
        }

        function handleClick(event) {
            const button = event.target.closest('button[data-action]');
            if (!button || !panel.contains(button)) return;

            switch (button.dataset.action) {
                case 'start':
                    start();
                    break;
                case 'pause':
                    pause();
                    break;
                case 'reset':
                    reset();
                    break;
                case 'mode-focus':
                    selectMode('focus');
                    break;
                case 'mode-break':
                    selectMode('break');
                    break;
            }
        }

        panel.addEventListener('click', handleClick);
        render();

        function unmount() {
            if (disposed) return;
            disposed = true;
            clearClock();
            panel.removeEventListener('click', handleClick);
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
        apiVersion: '1.0.0',
        mount: mount
    };
})(window);
