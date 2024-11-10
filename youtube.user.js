// ==UserScript==
// @name         YouTube Auto Skip and Fast-Forward Ads
// @namespace    luxysiv
// @version      1.6
// @description  Automatically jumps to the end of ads on YouTube without affecting main videos
// @match        *://*.youtube.com/*
// @author       Mạnh Dương
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to check and process ads
    function checkAndSkipAds() {
        const video = document.querySelector('video');
        const skipButton = document.querySelector('.ytp-ad-skip-button');
        const adOverlay = document.querySelector('.ytp-ad-player-overlay, .ytp-ad-player-overlay-layout__player-card-container');

        if (video) {
            // Check if the video is an ad (has an overlay or a skip ad button)
            if ((adOverlay && adOverlay.style.display !== 'none') || skipButton) {
                // Jump to end of ad to skip
                if (video.currentTime < video.duration) {
                    video.muted = true;  //Mute ad video
                    video.currentTime = video.duration; // Skip to end of ad
                    console.log("Skip to end of ad");
                }
            }
        }

        // Automatically press "Skip Ad" button if available
        if (skipButton) {
            skipButton.click();
            console.log("Ad skipped");
        }
    }

    // Using MutationObserver to detect changes in the DOM
    const observer = new MutationObserver(() => {
        checkAndSkipAds();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
