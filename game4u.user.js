// ==UserScript==
// @name         Block pop-up game4u
// @namespace    luxysiv
// @version      1.2
// @description  Block pop-up game4u
// @author       Mạnh Dương
// @match        https://game4u.mobi/*
// @grant        none
// @run-at       document-start
// @icon         https://raw.githubusercontent.com/luxysiv/favicon/refs/heads/main/game4u.png
// ==/UserScript==


(function() {
    'use strict';

    // Block ads by removing elements with known ad IDs or classes
    function blockAds() {
        const adsContainers = document.querySelectorAll('#ads, .ad, .advertisement, iframe');
        adsContainers.forEach(ad => ad.remove());
    }

    // Block pop-ups by preventing new windows or tabs
    function blockPopUps() {
        const openBackup = window.open;
        window.open = function() {
            console.log('Blocked a pop-up');
            return null;
        };
    }

    // Block redirects by monitoring URL changes
    function blockRedirects() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                console.log('Blocked a redirect to: ' + url);
                history.pushState(null, '', lastUrl); // Ngăn chuyển hướng bằng cách quay lại URL cũ
            }
            lastUrl = url;
        }).observe(document, { subtree: true, childList: true });
    }

    // Run the functions
    blockAds();
    blockPopUps();
    blockRedirects();

    // Additional listener for dynamic content loading
    document.addEventListener('DOMNodeInserted', blockAds);
})();
