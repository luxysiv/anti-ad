// ==UserScript==
// @name         Phimnhanh Ad Blocker
// @namespace    luxysiv
// @version      2.1
// @description  Phimnhanh Ad Blocker & Remove Video Ads
// @author       Mạnh Dương
// @match        *://phimnhanhz.com/*
// @match        *://linkads.xyz/*
// @grant        none
// @run-at       document-start
// @icon         https://raw.githubusercontent.com/luxysiv/favicon/refs/heads/main/phimnhanh.png
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove all target="_blank" links
    function removeBlankLinks() {
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            link.remove();
        });
    }

    // Ad selectors to target on phimnhanhz.com
    const adSelectors = [
        "#popup-giua-man-hinh",
        ".banner-top",
        "#container-ads",
    ];

    // Function to hide ads by applying inline styles
    function hideAds() {
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(ad => {
                ad.style.display = 'none';
                ad.style.visibility = 'hidden';
                ad.style.height = '0';
                ad.style.width = '0';
                ad.style.overflow = 'hidden';
                console.log(`Ad hidden: ${selector}`);
            });
        });
    }

    // Set up MutationObserver to detect dynamically added ad elements
    function startObservingAds() {
        const observer = new MutationObserver(() => {
            hideAds();
            removeBlankLinks();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Redirect to video link on linkads.xyz if present
    function extractVideoLink() {
        if (window.location.hostname === "linkads.xyz") {
            const urlParams = new URLSearchParams(window.location.search);
            const videoLink = urlParams.get('link');
            if (videoLink) {
                console.log("Redirecting to video link...");
                window.location.href = decodeURIComponent(videoLink);
            } else {
                console.log("Video link not found.");
            }
        }
    }

    // Run functions immediately at document-start
    hideAds();
    removeBlankLinks();
    extractVideoLink();

    // Set up MutationObserver after DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        hideAds();
        removeBlankLinks();
        extractVideoLink();
        startObservingAds();  // Begin observing DOM changes
    });

    // Extra triggers to ensure functions run on load and cache reloads
    window.addEventListener('load', () => {
        hideAds();
        removeBlankLinks();
        extractVideoLink();
    });
    window.addEventListener('pageshow', () => {
        hideAds();
        removeBlankLinks();
        extractVideoLink();
    });

})();
