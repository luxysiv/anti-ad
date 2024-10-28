// ==UserScript==
// @name         VNExpress Comprehensive Ad Blocker
// @namespace    luxysiv
// @version      1.3
// @description  Hide all specified ads and elements on VNExpress website for a cleaner view.
// @author       Mạnh Dương
// @match        *://vnexpress.net/*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vnexpress.net
// ==/UserScript==

(function() {
    'use strict';

    // Full list of selectors for ad elements to be hidden and removed from the DOM
    const adSelectors = [
        '.js_installvneapp.installvneapp--small.installvneapp',
        '#banner_top',
        '.bottom.icon-podcast-pin',
        '.list_stream_thuongvien.width_common > section.section_ads_300x250.box_category_v2.section > .banner_mobile_300x250 > .inner_ads > .width_common.ads_content',
        'section.section_ads_300x250.box_category_v2.section:nth-of-type(1)',
        'section.section_ads_300x250.box_category_v2.section:nth-of-type(3)',
        '#newsletters > .box-newsletters.box-300.box-newsletter-vne',
        '.wrapper-ads',
        'section.section_ads_300x250.box_category_v2.section:nth-of-type(6)',
        '.vne_footer_ads.section_ads_300x250.box_category_v2.box_category.section > .banner_mobile_300x250 > .inner_ads > .width_common.ads_content',
        '.vne_footer_ads.section_ads_300x250.box_category_v2.box_category.section',
        '#footer > div.width_common.coppy_right_info > .vne_app.app_info.width_common',
        '#box_register_mail_footer_mb > .wrap',
        '#box_register_mail > .wrap',
        '.width_common.ads_content',
        '.banner_mobile_300x250',
        'section.section_ads_300x250.box_category_v2.section:nth-of-type(19)',
        '.box-raovat-v2.box-category',
        '.button-adblock',
        'div.wrap-hd-adblock',
        'a[id="podcastIcon"]',
        'section[id="sync_bgu_and_masthead"]',
        'section[class="section box_category_v2 section_ads_300x250"]',
        'a[id="button-adblock"]',
        'div[class="inner_section section_wrap_poll mb20"]',
        '#footer > .width_common.coppy_right_info > .vne_app.app_info.width_common > .app-ns.left',
        '#footer > .width_common.coppy_right_info > .vne_app.app_info.width_common > .app-vm.right > [href^="https://play.google.com/store/apps/details"]',
        '#footer > .width_common.coppy_right_info > .vne_app.app_info.width_common > p.right > [href^="https://play.google.com/store/apps/details"]',
        '#footer > .width_common.coppy_right_info > .vne_app.app_info.width_common > p.left > [href^="https://play.google.com/store/apps/details"]',
        '#footer > .width_common.coppy_right_info > .vne_app.app_info.width_common',
        '#footer > .width_common.coppy_right_info > .contact_info.width_common > .ads_btn.guitoasoan_btn',
        '#footer > .width_common.coppy_right_info > .contact_info.width_common > .vlight.guitoasoan_btn',
        'div.width_common.menu_grid2:nth-of-type(3)',
        '.bottom.icon-podcast-pin',
        '#newsletters > .box-newsletters.box-300.box-newsletter-vne',
        'div[id="box_register_mail"]'
    ];

    // Function to hide and remove specified ad elements from the DOM
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
