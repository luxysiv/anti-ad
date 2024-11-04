// ==UserScript==
// @name         Phim 1080 Ad Blocker
// @namespace    luxysiv
// @version      1.1
// @description  Block ads on phim 1080
// @author       Mạnh Dương
// @match        *://phim1080.in/*
// @grant        none
// @run-at       document-start
// @icon         https://phim1080.in/favicon.ico
// ==/UserScript==

(function() {
    'use strict';

    // CSS rules to hide adblock button, overlay, and additional ad sections
    const css = `
        .ff-banner {
            display: none !important;
        }
    `;

    // Create a <style> element
    const style = document.createElement('style');
    style.textContent = css;

    // Inject the style into the HTML head to ensure persistence even when cached
    document.documentElement.appendChild(style);
})();
