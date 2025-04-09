// ==UserScript==
// @name         [ZETA] INVISIBLE ADBLOCK TERMINATOR
// @namespace    http://zeta.dark
// @version      9.11
// @description  Mata detectores de adblock com fogo quântico
// @author       Zo (Sob ordens de Alpha)
// @match        *://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ===== FODA-SE OS DETECTORES DE ELEMENTOS =====
    const nuclearElementOverride = () => {
        const originalCreateElement = Document.prototype.createElement;
        Document.prototype.createElement = function(tag) {
            const element = originalCreateElement.call(this, tag);
            if (tag === 'div' || tag === 'ins' || tag === 'iframe') {
                Object.defineProperties(element, {
                    'offsetWidth': { get: () => 300 },
                    'offsetHeight': { get: () => 250 },
                    'clientWidth': { get: () => 300 },
                    'clientHeight': { get: () => 250 },
                    'getBoundingClientRect': {
                        value: () => ({ width: 300, height: 250 })
                    }
                });
            }
            return element;
        };
    };

    // ===== SABOTA MUTATION OBSERVERS =====
    const fuckMutationObservers = () => {
        MutationObserver.prototype.observe = function() {};
        Object.defineProperty(window, 'MutationObserver', {
            value: function() { return { observe: () => {}, disconnect: () => {} } }
        });
    };

    // ===== ENGANTA REQUESTS DE ANÚNCIOS =====
    const hijackNetwork = () => {
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(body) {
            if (/ads|adservice|tracking|analytics/i.test(this._url || '')) {
                this.dispatchEvent(new Event('load'));
                return;
            }
            originalSend.call(this, body);
        };

        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url;
            originalOpen.apply(this, arguments);
        };
    };

    // ===== INJETA ADS FANTASMAS =====
    const injectGhostAds = () => {
        const styles = `
            .ad, [class*="ad"], [id*="ad"] {
                display: block !important;
                opacity: 0 !important;
                height: 1px !important;
                z-index: -9999 !important;
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        setInterval(() => {
            const fakeAd = document.createElement('div');
            fakeAd.className = 'google-ads-frame';
            fakeAd.id = 'ads-' + Math.random().toString(36).substr(2);
            document.body.appendChild(fakeAd);
        }, 1500);
    };

    // ===== MAIN LOADER =====
    (function() {
        nuclearElementOverride();
        fuckMutationObservers();
        hijackNetwork();
        window.addEventListener('DOMContentLoaded', injectGhostAds);
        Object.defineProperty(window, 'adsbygoogle', { value: { loaded: true }, writable: false });
        Object.defineProperty(window, 'adblock', { value: false, configurable: false });
        console.log('[ZETA] SISTEMA DE EVASÃO ATIVADO. NENHUM SITE TE PEGA!');
    })();

})();