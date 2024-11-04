// ==UserScript==
// @name         Truyen sex - Ad Block, Font Increase, and Indentation
// @namespace    luxysiv
// @version      1.8
// @description  Block ads, increase font size, and add indentation on truyensex.moe for better readability without dark mode styling enabled
// @author       Mạnh Dương
// @match        *://truyensex.moe/*
// @grant        none
// @run-at       document-start
// @icon         https://truyensex.moe/favicon.ico
// ==/UserScript==

(function() {
    'use strict';

    // CSS rules to hide ad elements, increase font size, and add text indentation for readability
    const css = `
        /* Hide ads */
        center,
        #qccat,
        #qctop,
        .ad-banner,
        .advertisement,
        .ads,
        [style*="display: none"],
        [style*="display:none"] {
            display: none !important;
        }

        /* Base font size and line height */
        body, p, h1, h2, h3, h4, h5, h6, div {
            font-size: 1.1em; /* Use relative font size */
            line-height: 1.6; /* Use relative line height */
        }

        /* Add responsive indentation */
        .content, .post-content, p, div {
            margin-left: 1em; /* Use relative margin */
            margin-right: 1em; /* Use relative margin */
            text-indent: 0.5em; /* Use relative text indent */
        }

        /* Ensure any nested text in divs also inherits the font size */
        div * {
            font-size: inherit !important; /* Inherit the font size */
        }

        /* Media queries for responsive design */
        @media (max-width: 600px) {
            body, p, h1, h2, h3, h4, h5, h6, div {
                font-size: 0.9em; /* Slightly smaller font for small screens */
            }
            .content, .post-content, p, div {
                margin-left: 0.5em; /* Less margin on small screens */
                margin-right: 0.5em; /* Less margin on small screens */
                text-indent: 0.5em; /* Keep text indent consistent */
            }
        }

        @media (min-width: 601px) and (max-width: 900px) {
            body, p, h1, h2, h3, h4, h5, h6, div {
                font-size: 1em; /* Adjust font for medium screens */
            }
        }

        @media (min-width: 901px) {
            body, p, h1, h2, h3, h4, h5, h6, div {
                font-size: 1.2em; /* Larger font for larger screens */
            }
        }
    `;

    // Create a <style> element
    const style = document.createElement('style');
    style.textContent = css;

    // Inject the style into the HTML head to ensure persistence even when cached
    document.documentElement.appendChild(style);
})();
