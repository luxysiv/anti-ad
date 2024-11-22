// ==UserScript==
// @name         Phimmoichill Block Ads
// @namespace    luxysiv
// @version      2.6
// @description  Block ads on phimmoichill
// @author       Mạnh Dương
// @match        *://phimmoichilltv.net/*
// @run-at       document-start
// @icon         https://phimmoichilltv.net/favicon.ico
// ==/UserScript==

(function () {
    'use strict';
    
    // Set a cookie with the key 'popupOpened' and value 'true' to prevent showing popup ads
    document.cookie = "popupOpened=true; path=/;";

    // Inject CSS to hide ad elements
    const css = `
        .off-ads,
        #an_catfish {
            display: none !important;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.documentElement.appendChild(style);

    // Function to mute the ad video and skip it by moving to the end
    function muteAndSkipAd(video) {
        if (video) {
            video.muted = true; // Mute the ad video
            video.currentTime = video.duration || 9999; // Skip to the end of the video
            video.remove(); // Remove the video element after skipping
            console.log("Muted and skipped the ad.");
        }
    }

    // Observe changes in the DOM for ads
    const adObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Check if the ad video element has appeared
            const adPlayer = document.querySelector('.jw-flag-ads');
            const video = document.querySelector('.jw-video');

            if (adPlayer && video) {
                muteAndSkipAd(video); // Mute and skip the ad
                adObserver.disconnect(); // Stop observing after the ad is skipped
            }
        });
    });

    // Start observing the root of the document for changes
    adObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Function to check if a script should be removed
    function shouldRemoveScript(scriptContent, scriptSrc) {
        const keywords = ['getElementById', 'vast.js']; // Keywords to identify ads scripts
        return keywords.some((keyword) =>
            (scriptContent && scriptContent.includes(keyword)) ||
            (scriptSrc && scriptSrc.includes(keyword))
        );
    }

    // Observe and remove unwanted script tags dynamically added to the DOM
    const scriptObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'SCRIPT') {
                    // If it's an inline script
                    if (shouldRemoveScript(node.textContent, node.src)) {
                        node.parentNode.removeChild(node);
                        return;
                    }

                    // If it's an external script
                    if (node.src) {
                        fetch(node.src)
                            .then((response) => response.text())
                            .then((scriptContent) => {
                                if (shouldRemoveScript(scriptContent, node.src)) {
                                    node.parentNode.removeChild(node);
                                }
                            })
                            .catch(() => {});
                    }
                }
            });
        });
    });

    scriptObserver.observe(document.documentElement, { childList: true, subtree: true });

    // Block inline scripts before they execute
    document.addEventListener(
        'beforescriptexecute',
        (e) => {
            const script = e.target;
            if (shouldRemoveScript(script.textContent, script.src)) {
                e.preventDefault();
                e.stopPropagation();
                script.parentNode.removeChild(script);
            }
        },
        true
    );
})();
