// ==UserScript==
// @name         YouTube Auto Skip, Mute Ads
// @namespace    luxysiv
// @version      2.6.5
// @description  Automatically skips, mutes ads on YouTube
// @author       Mạnh Dương
// @match        *://*.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://m.youtube.com/static/logos/favicon.ico
// ==/UserScript==

(function() {
    'use strict';

    // List of CSS selectors for ad elements on YouTube
    const cssSelectors = [
        '.html5-video-player.ad-showing',
        '.html5-video-player.ad-interrupting',
        '.video-ads.ytp-ad-module',
        '.ytp-ad-overlay-container',
        'ytd-ad-slot-renderer',
        '#masthead-ad',
        'ytd-rich-item-renderer:has(.ytd-ad-slot-renderer)',
        'ytd-rich-section-renderer:has(.ytd-statement-banner-renderer)',
        'tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)',
        'ytd-popup-container:has(a[href="/premium"])',
        'yt-mealbar-promo-renderer',
        '#related #player-ads',
        '#related ytd-ad-slot-renderer',
        'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',
        'ytm-companion-ad-renderer',
        'ad-slot-renderer'
    ];

    const skipButtonSelectors = [
        '.ytp-ad-skip-button', '.ytp-ad-skip-button-modern', '.ytp-ad-skip-button-container'
    ];

    // Inject CSS to instantly hide ad elements
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = cssSelectors.join(', ') + ' { display: none !important; }';
        document.documentElement.appendChild(style);
    }

    injectCSS(); // Inject CSS as soon as the script runs

    // Function to check and handle ads based on the 'ad-showing' status of the video player
    function checkAndHandleAds() {
        const player = document.querySelector('.html5-video-player');
        const video = document.querySelector('video');
        const skipButton = document.querySelector(skipButtonSelectors.join(', '));

        if (player && video) {
            const isAdPlaying = player.classList.contains('ad-showing');

            if (isAdPlaying) {
                video.muted = true; // Mute audio when an ad is playing
                video.currentTime = video.duration || 9999; // Fast-forward to the end of the ad

                if (skipButton) skipButton.click(); // Click the "Skip Ad" button if it exists
            }
        }
    }

    // Set up MutationObserver to watch for page changes
    function initObserver() {
        const observer = new MutationObserver(checkAndHandleAds);
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    initObserver(); // Start the observer immediately
})();
