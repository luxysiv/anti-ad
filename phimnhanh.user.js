// ==UserScript==
// @name         Enhanced Ad Blocker & Video Redirector
// @namespace    luxysiv
// @version      3.0
// @description  Block ads, remove popups, and redirect video links efficiently
// @match        *://phimnhanhz.com/*
// @match        *://linkads.xyz/*
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://raw.githubusercontent.com/luxysiv/favicon/refs/heads/main/phimnhanh.png
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS to immediately hide ads upon page load
    GM_addStyle(`
        #popup-giua-man-hinh, 
        .banner-top, 
        #container-ads, 
        .ad-container, 
        .watch-banner-1, 
        .watch-banner-2 {
            display: none !important;
            visibility: hidden !important;
        }
    `);

    // Function to redirect to the video link if on linkads.xyz
    function redirectVideoLink() {
        if (window.location.hostname === "linkads.xyz") {
            const urlParams = new URLSearchParams(window.location.search);
            const videoLink = urlParams.get('link');
            if (videoLink) {
                window.location.href = decodeURIComponent(videoLink); // Redirect to the decoded video link
            }
        }
    }

    // Call the redirect function if necessary
    redirectVideoLink();

    // Function to remove remaining ad elements and observe for new ads
    function removeAds() {
        const adSelectors = [
            '#popup-giua-man-hinh', 
            '.banner-top', 
            '#container-ads', 
            '.ad-container', 
            '.watch-banner-1', 
            '.watch-banner-2'
        ];
        // Remove each ad element that matches the selectors
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(ad => ad.remove());
        });
    }

    // Set up MutationObserver to watch for ad changes in the DOM
    const observer = new MutationObserver(removeAds);
    document.addEventListener('DOMContentLoaded', () => {
        removeAds(); // Remove ads when DOM is fully loaded
        observer.observe(document.body, { childList: true, subtree: true }); // Observe changes in the body
    });
})();
