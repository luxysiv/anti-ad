// ==UserScript==
// @name         Block pop-up game4u
// @namespace    luxysiv
// @version      1.1
// @description  Block pop-up game4u
// @author       Mạnh Dương
// @match        https://game4u.mobi/*
// @grant        none
// @run-at       document-start
// @icon         https://raw.githubusercontent.com/luxysiv/favicon/refs/heads/main/game4u.png
// ==/UserScript==


(function() {
    'use strict';

    // Remove script tags with src="about:blank"
    document.querySelectorAll('script[src="about:blank"]').forEach(script => {
        script.remove();
    });

    // Remove iframe tags with src="about:blank"
    document.querySelectorAll('iframe[src="about:blank"]').forEach(iframe => {
        iframe.remove();
    });
})();
