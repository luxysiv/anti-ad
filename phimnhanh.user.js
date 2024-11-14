// ==UserScript==
// @name         Phimnhanh Ad Blocker
// @namespace    luxysiv
// @version      3.2.1
// @description  Phimnhanh Ad Blocker & Remove Video Ads
// @match        *://phimnhanhz.com/*
// @match        *://linkads.xyz/*
// @run-at       document-start
// @icon         https://phimnhanhz.com/wp-content/themes/phimnhanh/img/favicon.ico
// ==/UserScript==

(function() {
    'use strict';
    
    // CSS rules to hide ads and ad-related elements
    const css = `
        .banner-top,
        .ad-container,
        #popup-giua-man-hinh,
        .jwplayer .jw-plugin-vast.jw-plugin,
        .jwplayer .jw-plugin-vast.jw-plugin *,
        .jwplayer .jw-plugin-vast .jw-ad-icon-container,
        .jw-plugin-vast .jw-vast-nonlinear-close-button,
        .jw-plugin-vast .jw-vast-nonlinear-open-button,
        .jw-plugin-vast.jw-vast-nonlinear-active .jw-banner,
        .jw-plugin-vast.jw-vast-nonlinear-collapsed .jw-banner,
        .jwplayer .jw-plugin-vast .jw-ad-icon-container iframe {
            display: none !important;
            pointer-events: none !important;
        }
    `;

    // Function to create and inject the <style> element to apply CSS rules
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = css;
        document.documentElement.appendChild(style);
    }

    // Function to mute and skip video ads if an ad is detected in JWPlayer
    function checkAndHandleAds() {
        const jwPlayer = document.querySelector('.jwplayer');
        if (jwPlayer) {
            const video = jwPlayer.querySelector('video');
            if (video) {
                const isAdPlaying = jwPlayer.classList.contains('jw-flag-ads');
                if (isAdPlaying) {
                    // Mute and skip the ad
                    video.muted = true;
                    video.currentTime = video.duration || 9999; // Skip to the end of ad video
                    video.remove(); // Remove ad video
                    console.log("Skipping the ad!");
                }
            }
        }
    }

    // Initialize a MutationObserver to monitor and handle ads in real-time
    function initObserver() {
        const observer = new MutationObserver(checkAndHandleAds);
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    // Run functions to block and manage ads
    injectCSS();
    initObserver();
})();
