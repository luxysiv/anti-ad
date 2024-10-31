// ==UserScript==
// @name         Phimnhanh Ad Blocker
// @namespace    luxysiv
// @version      3.1
// @description  Phimnhanh Ad Blocker & Remove Video Ads
// @match        *://phimnhanhz.com/*
// @match        *://linkads.xyz/*
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://raw.githubusercontent.com/luxysiv/favicon/refs/heads/main/phimnhanh.png
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS to immediately hide ads upon page load
    function addStyles() {
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
    }

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

    // Function to remove remaining ad elements
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

    // Immediately add styles and try to remove ads on document start
    addStyles();
    removeAds();

    // Call the redirect function if necessary
    redirectVideoLink();

    // Set up MutationObserver to watch for ad changes in the DOM
    const observer = new MutationObserver(removeAds);
    document.addEventListener('DOMContentLoaded', () => {
        removeAds(); // Remove ads when DOM is fully loaded
        observer.observe(document.body, { childList: true, subtree: true }); // Observe changes in the body
    });
})();
