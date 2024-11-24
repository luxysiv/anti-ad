// ==UserScript==
// @name         VNExpress Comprehensive Ad Blocker
// @namespace    luxysiv
// @version      2.2
// @description  Hide all specified ads and elements on VNExpress
// @author       Mạnh Dương
// @match        *://*.vnexpress.net/*
// @grant        none
// @run-at       document-start
// @icon         https://s1.vnecdn.net/vnexpress/restruct/images/favicon.ico
// ==/UserScript==

(function() {
    'use strict';

    // CSS rules to hide adblock button, overlay, and additional ad sections
    const css = `
        .ads,
        .mb20,
        .wrap,
        .gopy-vne,
        .banner-ads,
        .article_ads,
        .button-adblock,
        .guitoasoan_btn,
        .wrap-hd-adblock,
        .section-ads-top,
        .icon-podcast-pin,
        .slide-banner-ads,
        .box-newsletter-vne,
        .downloadapp.contact,
        .section_ads_300x250,
        .installvneapp--small,
        .social_info.width_common,
        .box-ebank-qt.box-category,
        .contact_info.width_common,
        .box-news-other-site.container,
        .vne_app.app_info.width_common,
        .clearfix.box_300_targer.section,
        .coppy_right_info.width_common.newsletter_sidebar,
        .width_common.coppy_right_info.newsletters_footer_mb,
        div.width_common.menu_grid2:nth-of-type(3),
        ul.list-menu-footer:nth-of-type(5),
        div.width_common.menu_grid2:nth-of-type(25),
        #banner_top,
        #box-raovat-v2-home-pc.box-raovat-v2.box-category,
        #raovat.box_category_v2.box_category.section,
        #footer > div.width_common.coppy_right_info > .vne_app.app_info.width_common,
        #wrap-main-nav > section.wrap-all-menu:last-child > div.container > div.content-right:last-child > div.width_common.scroll-menu-expand.scrollbar-inner.ss-container > div.ss-wrapper:first-child > div.ss-content > ul.list-link:nth-child(3) > li.link:first-child,
        #wrap-main-nav > section.wrap-all-menu:last-child > div.container > div.content-right:last-child > div.width_common.scroll-menu-expand.scrollbar-inner.ss-container > div.ss-wrapper:first-child > div.ss-content > ul.list-link:nth-child(3) > li.link:last-child,
        #wrap-main-nav > section.wrap-all-menu:last-child > div.container > div.content-right:last-child > div.width_common.scroll-menu-expand.scrollbar-inner.ss-container > div.ss-wrapper:first-child > div.ss-content > ul.list-link:nth-child(3),
        #js_slider_company > div.swiper-wrapper:first-child,
        section.section.section_container:nth-child(23) > div.container.wrap-box-business.fs_parent_box:nth-child(3) > div.width_common.inner-box-business > div.box-category.box-info-company.box-last.animated.animatedFadeInUp.fadeInUp:first-child > hgroup.width_common.title-box-category.title-box-small:first-child,
        section.section.section_container:nth-child(23) > div.container.wrap-box-business.fs_parent_box:nth-child(3) > div.width_common.inner-box-business > div.box-category.box-info-company.box-last.animated.animatedFadeInUp.fadeInUp:first-child,
        section.section.section_container:nth-child(23) > div.container.wrap-box-business.fs_parent_box:nth-child(3) > div.width_common.inner-box-business,
        section.section.section_container:nth-child(23) > div.container.wrap-box-business.fs_parent_box:nth-child(3) > div.width_common.inner-box-business {
            display: none !important;
        }
    `;

    // Create a <style> element
    const style = document.createElement('style');
    style.textContent = css;

    // Inject the style into the HTML head to ensure persistence even when cached
    document.documentElement.appendChild(style);
})();
