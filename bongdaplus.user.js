// ==UserScript==
// @name         BongdaPlus Ad Blocker
// @namespace    luxysiv
// @version      2.1
// @description  Hide specified ad elements on bongdaplus.vn for a cleaner experience.
// @author       Mạnh Dương
// @match        *://bongdaplus.vn/*
// @run-at       document-start
// @icon         https://bongdaplus.vn/favicon.ico
// ==/UserScript==

(function() {
    'use strict';

    // CSS rules to hide specific sections initially if they are likely to contain unwanted content
    const css = `
    .clz,
    #ADMTOP,
    .relates,
    .tip-lst,
    .mix-tags,
    .mix-story,
    .mix-stars,
    .mix-specs,
    .email-box,
    .mix-predict,
    .tx-cen.emobar,
    #aplbshare.prescript,
    div.clz:nth-of-type(1),
    div.clx:nth-of-type(14),
    div.clx:nth-of-type(16),
    div.row:nth-of-type(15),
    div.row:nth-of-type(17) {
        display: none !important;
    }
    `;

    // Add initial CSS
    const style = document.createElement('style');
    style.textContent = css;
    document.documentElement.appendChild(style);

    // Function to selectively remove elements containing unwanted links or keywords
    function removeUnwantedElements() {
        // Define the list of unwanted paths/keywords
        const unwantedPaths = [
            "goc-check-var",
            "hau-truong-bong-da",
            "ben-ngoai-duong-piste",
            "hotgirl",
            "esports",
            "soi-keo"
        ];

        // Select specific elements to check for unwanted links or keywords
        const elements = document.querySelectorAll('a, li, div, section');

        elements.forEach(element => {
            // Check if the href or text content contains any unwanted path or keyword
            if (
                (element.href && unwantedPaths.some(path => element.href.includes(path))) ||
                unwantedPaths.some(path => element.textContent.includes(path.replace(/-/g, ' ')))
            ) {
                // Remove only the closest container of type li, div, or section
                const closestContainer = element.closest('li, div, section');
                if (closestContainer) {
                    closestContainer.remove();
                } else {
                    element.remove();
                }
            }
        });
    }

    // Run the function after the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', removeUnwantedElements);
})();
