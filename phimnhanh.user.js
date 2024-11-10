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

    // CSS rules to hide adblock button, overlay, and additional ad sections
    const css = ` 
        .banner-top,
        .ad-container,
        #popup-giua-man-hinh {
           display: none !important;
        }
    `;

    // Create a <style> element
    const style = document.createElement('style');
    style.textContent = css;

    // Inject the style into the HTML head to ensure persistence even when cached
    document.documentElement.appendChild(style);    
    
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
})();
