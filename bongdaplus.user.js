// ==UserScript==
// @name         BongdaPlus Ad Blocker
// @namespace    luxysiv
// @version      2.0
// @description  Hide specified ad elements on bongdaplus.vn for a cleaner experience.
// @author       Mạnh Dương
// @match        *://bongdaplus.vn/*
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://raw.githubusercontent.com/luxysiv/favicon/refs/heads/main/bongdaplus.png
// ==/UserScript==

(function() {
    'use strict';

    // CSS rules to hide specific sections initially if they are likely to contain "Góc check var"
    const css = `
    .clz,
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

    // Function to selectively remove elements containing "Góc check var"
    function removeGocCheckVarElements() {
        // Select only specific elements to check for "Góc check var"
        const elements = document.querySelectorAll('a, li, div, section');

        elements.forEach(element => {
            // Check if "goc-check-var" is in the href or text content
            if ((element.href && element.href.includes("goc-check-var")) || 
                element.textContent.includes("Góc check var")) {
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
    document.addEventListener('DOMContentLoaded', removeGocCheckVarElements);
})();
