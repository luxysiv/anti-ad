// ==UserScript==
// @name         Phimmoichill Block Ads
// @namespace    luxysiv
// @version      2.3
// @description  Hide ads on phimmoichill.biz
// @author       Mạnh Dương
// @match        *://phimmoichill.biz/*
// @run-at       document-start
// @icon         https://raw.githubusercontent.com/luxysiv/favicon/refs/heads/main/phimmoichill.png
// ==/UserScript==

(function() {
    'use strict';

    // Set cookie with key 'popupOpened' and value 'true'
    document.cookie = "popupOpened=true; path=/;";

    // Inject CSS to hide ad elements
    const css = `
        .off-ads,
        .banner-ads,
        #mobiads,
        #an_catfish,
        #headermbads,
        #botplayeradsmb {
           display: none !important;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.documentElement.appendChild(style);

    // Function to block any connections to 'raw.githubusercontent.com'
    const blockURL = 'raw.githubusercontent.com';
    function interceptRequest(url) {
        if (url.includes(blockURL)) {
            console.log('Blocking connection to:', url);
            throw new Error('Blocked URL');
        }
    }

    // Block fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(url, ...args) {
        interceptRequest(url);
        return originalFetch.apply(this, arguments);
    };

    // Block XMLHttpRequest
    const originalXHR = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url, ...args) {
        interceptRequest(url);
        return originalXHR.apply(this, arguments);
    };

    // Block media elements and observe new ones
    function blockMediaAndObserve() {
        function blockMediaElements() {
            document.querySelectorAll('video, audio, img').forEach(media => {
                if (media.src && media.src.includes(blockURL)) {
                    console.log('Blocked media:', media.src);
                    media.src = '';
                    media.pause && media.pause();
                }
            });
        }

        blockMediaElements();

        // Observe new ad elements or media elements
        const observer = new MutationObserver(blockMediaElements);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Run block and observe on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', blockMediaAndObserve);
})();
