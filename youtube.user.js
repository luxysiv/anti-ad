// ==UserScript==
// @name         YouTube Auto Skip and Fast-Forward Ads
// @namespace    luxysiv
// @version      2.3.2
// @description  Automatically skips and jumps to the end of ads on YouTube without affecting main videos
// @match        *://*.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://m.youtube.com/static/logos/favicon.ico
// ==/UserScript==

(function() {
    'use strict';

    const cssSelectors = [
        '#offer-module',
        '#masthead-ad',
        '#player-ads',
        '.ytp-featured-product',
        'ytd-ad-slot-renderer',
        '.ytp-suggested-action > button.ytp-suggested-action-badge',
        '#__ffYoutube1',
        '#__ffYoutube2',
        '#__ffYoutube3',
        '#__ffYoutube4',
        '#feed-pyv-container',
        '#feedmodule-PRO',
        '#homepage-chrome-side-promo',
        '#merch-shelf',
        '#offer-module',
        '#pla-shelf > ytd-pla-shelf-renderer',
        '#pla-shelf',
        '#premium-yva',
        '#promo-info',
        '#promo-list',
        '#promotion-shelf',
        '#related > ytd-watch-next-secondary-results-renderer > #items > ytd-compact-promoted-video-renderer',
        '#search-pva',
        '#shelf-pyv-container',
        '#video-masthead',
        '#watch-branded-actions',
        '#watch-buy-urls',
        '#watch-channel-brand-div',
        '#watch7-branded-banner',
        '#YtKevlarVisibilityIdentifier',
        '#YtSparklesVisibilityIdentifier',
        '.carousel-offer-url-container',
        '.companion-ad-container',
        '.GoogleActiveViewElement',
        '.list-view[style="margin: 7px 0pt;"]',
        '.promoted-sparkles-text-search-root-container',
        '.promoted-videos',
        '.searchView.list-view',
        '.sparkles-light-cta',
        '.watch-extra-info-column',
        '.watch-extra-info-right',
        '.ytd-carousel-ad-renderer',
        '.ytd-compact-promoted-video-renderer',
        '.ytd-companion-slot-renderer',
        '.ytd-merch-shelf-renderer',
        '.ytd-player-legacy-desktop-watch-ads-renderer',
        '.ytd-promoted-sparkles-text-search-renderer',
        '.ytd-promoted-video-renderer',
        '.ytd-search-pyv-renderer',
        '.ytd-video-masthead-ad-v3-renderer',
        '.ytp-ad-action-interstitial-background-container',
        '.ytp-ad-action-interstitial-slot',
        '.ytp-ad-image-overlay',
        '.ytp-ad-overlay-container',
        '.ytp-ad-progress',
        '.ytp-ad-progress-list',
        '[class*="ytd-display-ad-"]',
        '[layout*="display-ad-"]',
        'a[href^="http://www.youtube.com/cthru?"]',
        'a[href^="https://www.youtube.com/cthru?"]',
        'ytd-action-companion-ad-renderer',
        'ytd-banner-promo-renderer',
        'ytd-compact-promoted-video-renderer',
        'ytd-companion-slot-renderer',
        'ytd-display-ad-renderer',
        'ytd-promoted-sparkles-text-search-renderer',
        'ytd-promoted-sparkles-web-renderer',
        'ytd-search-pyv-renderer',
        'ytd-single-option-survey-renderer',
        'ytd-video-masthead-ad-advertiser-info-renderer',
        'ytd-video-masthead-ad-v3-renderer',
        'YTM-PROMOTED-VIDEO-RENDERER',
        '.companion-ad-container',
        '.ytp-ad-action-interstitial',
        '.ytp-cued-thumbnail-overlay > div[style*="/sddefault.jpg"]',
        'a[href^="/watch?v="][onclick^="return koya.onEvent(arguments[0]||window.event,\'"]:not([role]):not([class]):not([id])',
        'a[onclick*=\'"ping_url":"http://www.google.com/aclk?\']',
        'ytm-companion-ad-renderer',
        'ytm-companion-slot',
        'ytm-promoted-sparkles-text-search-renderer',
        'ytm-promoted-sparkles-web-renderer',
        'ytm-promoted-video-renderer'
    ];

    const adOverlaySelectors = [
        '.ytp-ad-player-overlay',
        '.ytp-ad-player-overlay-layout__ad-info-container',
        '.ytp-ad-player-overlay-layout__player-card-container',
        '.ytp-ad-player-overlay-layout__skip-or-preview-container',
        '.ytp-ad-player-overlay-layout__ad-disclosure-banner-container'        
    ];
    
    const skipButtonSelectors = [
        '.ytp-ad-skip-button',
        '.ytp-ad-skip-button-modern',
        '.ytp-ad-skip-button-container'
    ];

    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = cssSelectors.join(', ') + ' { display: none !important; }';
        document.documentElement.appendChild(style);
    }

    function checkAndSkipAds() {
        const video = document.querySelector('video');
        const skipButton = document.querySelector(skipButtonSelectors.join(', '));
        const adOverlay = document.querySelector(adOverlaySelectors.join(', '));

        if (video && ((adOverlay && adOverlay.style.display !== 'none') || skipButton)) {
            video.currentTime = video.duration;
        }
        if (skipButton) skipButton.click();
    }

    function initObserver() {
        const observer = new MutationObserver(checkAndSkipAds);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Wait for DOMContentLoaded to ensure document.body is available
    document.addEventListener("DOMContentLoaded", () => {
        injectCSS();
        initObserver();
    });

    // Block YouTube ads by setting `google_ad_status` to '1'
    Object.defineProperty(window, 'google_ad_status', { get: () => '1' });

    // Disable `web_bind_fetch` experiment flag
    if (window.yt && window.yt.config_ && window.yt.config_.EXPERIMENT_FLAGS) {
        Object.defineProperty(window.yt.config_.EXPERIMENT_FLAGS, 'web_bind_fetch', { get: () => false });
    }

    // Block ad placements in `ytInitialPlayerResponse`
    Object.defineProperty(window, 'ytInitialPlayerResponse', {
        get: function() {
            const originalResponse = {};
            originalResponse.adPlacements = undefined;
            return originalResponse;
        }
    });

    // Intercept XHR responses and prune ad-related JSON fields
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (/\/playlist\?list=|\/player(?!.*(get_drm_license))|watch\?[tv]=/.test(url)) {
            this.addEventListener('load', function() {
                try {
                    const response = JSON.parse(this.responseText);
                    if (response && typeof response === 'object') {
                        // Remove ad fields if present
                        delete response.playerResponse?.adPlacements;
                        delete response.playerResponse?.playerAds;
                        delete response.playerResponse?.adSlots;
                        delete response.adPlacements;
                        delete response.playerAds;
                        delete response.adSlots;
                        
                        Object.defineProperty(this, 'responseText', { value: JSON.stringify(response) });
                    }
                } catch (e) {
                    console.error("Failed to parse and prune ad JSON:", e);
                }
            });
        }
        open.apply(this, arguments);
    };

    // Intercept fetch responses and prune ad-related JSON fields
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        const response = await originalFetch(input, init);

        const url = typeof input === 'string' ? input : input.url;
        if (/\/playlist\?list=|player\?|watch\?[tv]=/.test(url)) {
            const clone = response.clone();
            const json = await clone.json();

            // Remove ad fields if present
            delete json.playerResponse?.adPlacements;
            delete json.playerResponse?.playerAds;
            delete json.playerResponse?.adSlots;
            delete json.adPlacements;
            delete json.playerAds;
            delete json.adSlots;

            return new Response(JSON.stringify(json), {
                headers: clone.headers,
                status: clone.status,
                statusText: clone.statusText
            });
        }

        return response;
    };

    // SSAP Entity ID Control to manage video playback loops and skips
    (() => {
        let currentUrl = document.location.href,
            ssapEntities = [],
            ssapIds = [],
            previousSSAPId = "",
            hasSSAPData = false;

        const originalPush = Array.prototype.push;
        const pushHandler = {
            apply: (target, thisArg, args) => {
                if (
                    window.yt?.config_?.EXPERIMENT_FLAGS?.html5_enable_ssap_entity_id &&
                    args[0] &&
                    args[0] !== window &&
                    typeof args[0].start === "number" &&
                    args[0].end &&
                    args[0].namespace === "ssap" &&
                    args[0].id
                ) {
                    if (!hasSSAPData && args[0].start === 0 && !ssapIds.includes(args[0].id)) {
                        ssapEntities.length = 0;
                        ssapIds.length = 0;
                        hasSSAPData = true;
                        originalPush.call(ssapEntities, args[0]);
                        originalPush.call(ssapIds, args[0].id);
                    } else if (hasSSAPData && args[0].start !== 0 && !ssapIds.includes(args[0].id)) {
                        originalPush.call(ssapEntities, args[0]);
                        originalPush.call(ssapIds, args[0].id);
                    }
                }
                return Reflect.apply(target, thisArg, args);
            }
        };

        window.Array.prototype.push = new Proxy(window.Array.prototype.push, pushHandler);

        const manageSSAPPlayback = () => {
            const videoElement = document.querySelector("video");
            if (videoElement && ssapEntities.length) {
                const videoDuration = Math.round(videoElement.duration);
                const ssapEnd = Math.round(ssapEntities.at(-1).end / 1000);
                const currentSSAPId = ssapIds.join(",");

                if (videoElement.loop === false && previousSSAPId !== currentSSAPId && videoDuration && videoDuration === ssapEnd) {
                    const ssapStart = ssapEntities.at(-1).start / 1000;
                    if (videoElement.currentTime < ssapStart) {
                        videoElement.currentTime = ssapStart;
                        hasSSAPData = false;
                        previousSSAPId = currentSSAPId;
                    }
                } else if (videoElement.loop === true && videoDuration && videoDuration === ssapEnd) {
                    const ssapStart = ssapEntities.at(-1).start / 1000;
                    if (videoElement.currentTime < ssapStart) {
                        videoElement.currentTime = ssapStart;
                        hasSSAPData = false;
                        previousSSAPId = currentSSAPId;
                    }
                }
            }
        };

        manageSSAPPlayback();

        new MutationObserver(() => {
            if (currentUrl !== document.location.href) {
                currentUrl = document.location.href;
                ssapEntities.length = 0;
                ssapIds.length = 0;
                hasSSAPData = false;
            }
            manageSSAPPlayback();
        }).observe(document, { childList: true, subtree: true });
    })();

    // Filter out YouTube Shorts ads by modifying JSON.parse
    window.JSON.parse = new Proxy(JSON.parse, {
        apply: (target, thisArg, args) => {
            const result = Reflect.apply(target, thisArg, args);
            if (!location.pathname.startsWith("/shorts/")) return result;

            const entries = result?.entries;
            if (entries && Array.isArray(entries)) {
                result.entries = entries.filter(item => {
                    if (!item?.command?.reelWatchEndpoint?.adClientParams?.isAd) return item;
                });
            }
            return result;
        }
    });

})();
