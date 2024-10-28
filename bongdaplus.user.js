// ==UserScript==
// @name         BongdaPlus Ad Blocker
// @namespace    luxysiv
// @version      1.1
// @description  Hide specified ad elements on bongdaplus.vn for a cleaner experience.
// @author       Mạnh Dương
// @match        *://bongdaplus.vn/*
// @grant        none
// @run-at       document-start
// @icon         https://raw.githubusercontent.com/luxysiv/favicon/refs/heads/main/bongdaplus.png
// ==/UserScript==

(function() {
    'use strict';

    // List of selectors for elements to be hidden and removed from the DOM
    const adSelectors = [
        'div.hide-w',
        'div.mix-story',
        'div.mix-tips.tip-hot',
        'div.mix-tags',
        'div.small.fst.news:nth-of-type(1)',
        'div.small.fst.news:nth-of-type(3)',
        'div.row:nth-of-type(17)',
        'div.row:nth-of-type(15)',
        'div.clx:nth-of-type(16)',
        'div.clz:nth-of-type(7)',
        '.mix-stars',
        '.mix-predict'
    ];

    // Function to hide and remove specified elements from the DOM
    const hideElements = () => {
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.style.display = 'none'; // Hide the element immediately
                setTimeout(() => element.remove(), 0); // Remove it from the DOM after hiding
                console.log(`Hidden and removed element: ${selector}`);
            });
        });
    };

    // Function to initialize MutationObserver after document.body is available
    const initObserver = () => {
        if (document.body) {
            const observer = new MutationObserver(hideElements);
            observer.observe(document.body, { childList: true, subtree: true });

            // Trigger hideElements on key page events to ensure full coverage
            hideElements(); // Initial call
            window.addEventListener('DOMContentLoaded', hideElements);
            window.addEventListener('load', hideElements);
            window.addEventListener('pageshow', hideElements);
        } else {
            setTimeout(initObserver, 100); // Retry if document.body isn't ready
        }
    };

    // Start observing
    initObserver();
})();
