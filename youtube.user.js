// ==UserScript==
// @name         YouTube Auto Skip and Fast-Forward Ads
// @namespace    luxysiv
// @version      2.1
// @description  Automatically skips and jumps to the end of ads on YouTube without affecting main videos
// @match        *://*.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Array of ad overlay CSS class selectors
    const adOverlayClasses = [
        '.ytp-ad-player-overlay',
        '.ytp-ad-player-overlay-layout__player-card-container'
    ];

    // Function to check and skip ads
    function checkAndSkipAds() {
        const video = document.querySelector('video'); // Selects the video element
        const skipButton = document.querySelector('.ytp-ad-skip-button'); // Selects the "Skip Ad" button
        const adOverlay = document.querySelector(adOverlayClasses.join(', ')); // Combines ad overlay selectors

        if (video) {
            // If either the ad overlay is visible or "Skip Ad" button is present, assume it’s an ad
            if ((adOverlay && adOverlay.style.display !== 'none') || skipButton) {
                // Skip the ad by jumping to the end of the ad video
                if (video.currentTime < video.duration) {
                    video.muted = true;  // Mute the ad video
                    video.currentTime = video.duration; // Jump to the end of the ad video
                }
            }
        }

        // Automatically click "Skip Ad" button if available
        if (skipButton) {
            skipButton.click();
        }
    }

    // Waits for <body> to load, then starts observing with MutationObserver
    function initObserver() {
        const body = document.body;
        if (body) {
            const observer = new MutationObserver(checkAndSkipAds);
            observer.observe(body, { childList: true, subtree: true });
        } else {
            // If <body> is not ready, set up an event listener on "DOMContentLoaded"
            document.addEventListener("DOMContentLoaded", initObserver);
        }
    }

    // Starts observer as soon as <body> is ready
    initObserver();

})();
