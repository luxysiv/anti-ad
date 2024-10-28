// ==UserScript==
// @name         Block pop-up game4u
// @namespace    luxysiv
// @version      4.4
// @description  Block pop-up game4u
// @author       Mạnh Dương
// @match        https://game4u.mobi/*
// @grant        none
// @run-at       document-start
// @icon         https://raw.githubusercontent.com/luxysiv/favicon/refs/heads/main/game4u.png
// ==/UserScript==


(function() {
    'use strict';

    // List of ad URL patterns using regex
    const suspiciousPatterns = [
        // Block unrecognized domains
        /^(https?:\/\/)?(www\.)?[a-z0-9-]{1,63}\.(com|net|org|xyz|info|top|club|site|biz|tk|pw|gq|ml)(\/[^\s]*)?$/, // Common domains
        // Block ad parameters
        /.*[?&](aff_sub|utm_source|utm_medium|utm_campaign|utm_term|utm_content|z|var|id|ads)=.+/, // Ad parameters
        // Block unrecognized long character strings
        /[0-9a-z]{20,}/, // Long unrecognized character strings
        // Block keywords in URL
        /.*(ads|redirect|click|survey|sweep|offer|promo|sale|win|contest|popunder|track).*/, // Keywords related to ads
        // Block about:blank
        /^about:blank$/ // Block about:blank connection
    ];

    // Function to check if the URL is suspicious
    function isSuspiciousUrl(url) {
        return suspiciousPatterns.some(pattern => pattern.test(url));
    }

    // Override window.open to block suspicious URLs
    const originalWindowOpen = window.open;
    window.open = function(url, target) {
        if (isSuspiciousUrl(url)) {
            console.log(`Blocked window.open for suspicious URL: ${url}`);
            return null; // Prevent opening new tab
        }
        return originalWindowOpen(url, target);
    };

    // Override addEventListener to block click on links opening new tabs
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'click') {
            const wrappedListener = function(event) {
                const target = event.target.closest('a[target="_blank"]');
                if (target && isSuspiciousUrl(target.href)) {
                    console.log(`Blocked link click: ${target.href}`);
                    event.preventDefault();
                } else {
                    listener.call(this, event);
                }
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    // Block network requests with XMLHttpRequest
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (isSuspiciousUrl(url)) {
            console.log(`Blocked XMLHttpRequest to: ${url}`);
            return; // Prevent the request from being executed
        }
        return originalXhrOpen.apply(this, arguments);
    };

    // Block network requests with fetch
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = typeof input === 'string' ? input : input.url;
        if (isSuspiciousUrl(url)) {
            console.log(`Blocked fetch request to: ${url}`);
            return Promise.reject(new Error('Blocked suspicious URL'));
        }
        return originalFetch.apply(this, arguments);
    };

    // Block any changes to location.href or location.assign
    const originalLocationAssign = Location.prototype.assign;
    Location.prototype.assign = function(url) {
        if (isSuspiciousUrl(url)) {
            console.log(`Blocked location.assign to: ${url}`);
            return; // Prevent redirection
        }
        return originalLocationAssign.call(this, url);
    };

    // Block any changes to location.replace
    const originalLocationReplace = Location.prototype.replace;
    Location.prototype.replace = function(url) {
        if (isSuspiciousUrl(url)) {
            console.log(`Blocked location.replace to: ${url}`);
            return; // Prevent redirection
        }
        return originalLocationReplace.call(this, url);
    };

    // Block any changes to location.href
    Object.defineProperty(Location.prototype, 'href', {
        set: function(url) {
            if (isSuspiciousUrl(url)) {
                console.log(`Blocked setting location.href to: ${url}`);
                return; // Prevent href from being changed
            }
            return Object.getOwnPropertyDescriptor(Location.prototype, 'href').set.call(this, url);
        }
    });

    // Completely remove the leave confirmation dialog
    window.onbeforeunload = null;

})();
