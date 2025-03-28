const AntiAdBlock = (function () {
    "use strict";

    const blockAdsProperties = ["adsEnabled", "showAds", "googleAds"];
    const blockAdsFunctions = ["loadAds", "displayAds", "renderAds"];

    function blockAdProperties() {
        blockAdsProperties.forEach(prop => {
            Object.defineProperty(window, prop, { get: () => false, set: () => {} });
        });
    }

    function blockAdFunctions() {
        blockAdsFunctions.forEach(fn => {
            window[fn] = function () {};
        });
    }

    function bypassAntiAdBlock() {
        Object.defineProperty(window, "BlockAdBlock", { get: () => null, set: () => {} });
    }

    function init() {
        console.log("[AntiAdBlock] Đang khởi động...");
        blockAdProperties();
        blockAdFunctions();
        bypassAntiAdBlock();
        console.log("[AntiAdBlock] Đã kích hoạt!");
    }

    return { init };
})();
