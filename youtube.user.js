// ==UserScript==
// @name         YouTube Auto Skip and Fast-Forward Ads
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Automatically jumps to the end of ads on YouTube without affecting main videos
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Hàm kiểm tra và xử lý quảng cáo
    function checkAndSkipAds() {
        const video = document.querySelector('video');
        const skipButton = document.querySelector('.ytp-ad-skip-button');
        const adOverlay = document.querySelector('.ytp-ad-player-overlay, .ytp-ad-player-overlay-layout__player-card-container');

        if (video) {
            // Kiểm tra nếu video là quảng cáo (có overlay hoặc nút bỏ qua quảng cáo)
            if ((adOverlay && adOverlay.style.display !== 'none') || skipButton) {
                // Nhảy đến cuối quảng cáo để bỏ qua
                if (video.currentTime < video.duration) {
                    video.currentTime = video.duration; // Nhảy đến cuối quảng cáo
                    console.log("Đã nhảy đến cuối quảng cáo");
                }
            }
        }

        // Tự động nhấn nút "Bỏ qua quảng cáo" nếu có
        if (skipButton) {
            skipButton.click();
            console.log("Đã bỏ qua quảng cáo");
        }
    }

    // Sử dụng MutationObserver để phát hiện thay đổi trong DOM
    const observer = new MutationObserver(() => {
        checkAndSkipAds();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
