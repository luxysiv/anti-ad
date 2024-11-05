// ==UserScript==
// @name         Phimmoichill Block Ads
// @namespace    luxysiv
// @version      2.5
// @description  Hide ads on phimmoichill.biz and prevent loading of raw GitHub resources
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
        .hidemobile,
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

    // Function to block connections to 'raw.githubusercontent.com'
    const blockURL = 'raw.githubusercontent.com';

    // Intercept and block fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(url, ...args) {
        if (url.includes(blockURL)) {
            console.log('Blocking fetch request to:', url);
            return Promise.reject(new Error('Blocked URL')); // Block the request
        }
        return originalFetch.apply(this, arguments); // Allow other requests
    };

    // Intercept and block XMLHttpRequest
    const originalXHR = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url, ...args) {
        if (url.includes(blockURL)) {
            console.log('Blocking XMLHttpRequest to:', url);
            throw new Error('Blocked URL'); // Block the request
        }
        return originalXHR.apply(this, arguments); // Allow other requests
    };

    // Function to block media elements from loading
    function blockMediaElements() {
        document.querySelectorAll('video, audio, img').forEach(media => {
            if (media.src && media.src.includes(blockURL)) {
                console.log('Blocked media:', media.src);
                media.src = ''; // Clear the source
                media.pause && media.pause(); // Pause media if applicable
            }
        });
    }

    // Function to block script and link elements that may load raw.githubusercontent.com
    function blockScriptAndLinkElements() {
        document.querySelectorAll('script[src], link[href]').forEach(element => {
            if ((element.src && element.src.includes(blockURL)) || 
                (element.href && element.href.includes(blockURL))) {
                console.log('Blocking script or link to:', element.src || element.href);
                element.parentNode.removeChild(element); // Remove the element from the DOM
            }
        });
    }

    // Observe the document to block new elements
    const observer = new MutationObserver(() => {
        blockMediaElements();
        blockScriptAndLinkElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Run blocking immediately on script load
    blockMediaElements();
    blockScriptAndLinkElements();
})();
