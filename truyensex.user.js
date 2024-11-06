// ==UserScript==
// @name         Truyen sex - Ad Block, Font Increase, and Indentation
// @namespace    luxysiv
// @version      1.8.1
// @description  Block ads, increase font size, and add indentation on truyensex.moe for better readability without dark mode styling enabled
// @author       Mạnh Dương
// @match        *://truyensex.moe/*
// @match        *://truyensextv1.com/*
// @grant        none
// @run-at       document-start
// @icon         https://truyensex.moe/favicon.ico
// ==/UserScript==

(function() {
    'use strict';

    // CSS rules to hide adblock button, overlay, and additional ad sections
    const css = `
        center,
        #qccat,
        #qctop,
        .dulieu {
            display: none !important;
        }
    `;

    // Create a <style> element
    const style = document.createElement('style');
    style.textContent = css;

    // Inject the style into the HTML head to ensure persistence even when cached
    document.documentElement.appendChild(style);
})();
