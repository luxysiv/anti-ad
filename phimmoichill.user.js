// ==UserScript==
// @name         Phimmoichill Block Ads
// @namespace    luxysiv
// @version      2.0
// @description  Hide ads phimmoichill
// @author       Mạnh Dương
// @match        *://phimmoichill.io/*
// @grant        none
// @run-at       document-start
// @icon         https://raw.githubusercontent.com/luxysiv/favicon/refs/heads/main/phimmoichill.png
// ==/UserScript==

(function() {
    'use strict';

    // Set cookie with key 'popupOpened' and value 'true'
    document.cookie = "popupOpened=true; path=/;";

    // List of selectors for ad elements to be hidden and removed from the DOM
    const adSelectors = [
        '.hidedesktop > center > a',
        '#botplayeradsmb',
        '#pcads',
        '#chilladv',
        '[href="javascript:an_catfish()"]',
        '#mobiads',
        '#download',
        '.off-ads',
        '#headermbads',
        '#headerpcads',
        '#pmadv',
        'div[id="chilladv"]'
    ];

    // Function to hide and remove ad elements
    function hideAndRemoveAds() {
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(adElement => {
                adElement.style.display = 'none';
                adElement.style.visibility = 'hidden';
                adElement.style.height = '0';
                adElement.style.width = '0';
                adElement.style.overflow = 'hidden';
                console.log(`Hidden and removed ad element: ${selector}`);
            });
        });
    }

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

    // Block the creation of <video>, <audio>, <img> elements with URLs from raw.githubusercontent.com
    function blockMediaElements() {
        document.querySelectorAll('video, audio, img').forEach(media => {
            if (media.src && media.src.includes(blockURL)) {
                console.log('Blocked media:', media.src);
                media.src = '';  // Clear the URL
                media.pause && media.pause();
            }
        });
    }

    // Use MutationObserver to monitor for new ad elements
    function startObservingAds() {
        const observer = new MutationObserver(() => {
            hideAndRemoveAds();
            blockMediaElements();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initial actions at document-start
    hideAndRemoveAds();
    blockMediaElements();

    // Deferred actions for document-idle
    document.addEventListener('DOMContentLoaded', () => {
        hideAndRemoveAds();
        blockMediaElements();
        startObservingAds();
    });

    // Extra triggers for complete blocking on load and cache reloads
    window.addEventListener('load', () => {
        hideAndRemoveAds();
        blockMediaElements();
    });
    window.addEventListener('pageshow', () => {
        hideAndRemoveAds();
        blockMediaElements();
    });

})();
