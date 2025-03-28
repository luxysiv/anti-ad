const AntiAdBlock = (function () {
    "use strict";

    // Các thuộc tính và hàm quảng cáo thường gặp
    const blockAdsProperties = ["adsEnabled", "showAds", "googleAds", "adBlockDetected", "disableAds"];
    const blockAdsFunctions = ["loadAds", "displayAds", "renderAds", "detectAdBlock", "showBannerAds"];

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
        // Chặn các biến phổ biến phát hiện AdBlock
        const adBlockVars = ["BlockAdBlock", "AdGuard", "uBlock", "adblockDetector"];
        adBlockVars.forEach(varName => {
            Object.defineProperty(window, varName, { get: () => null, set: () => {} });
        });

        // Chặn các phương thức phát hiện AdBlock
        const originalCreateElement = document.createElement;
        document.createElement = function (tag) {
            if (tag === "ads" || tag.includes("ad")) {
                console.warn("[AntiAdBlock] Chặn kiểm tra AdBlock:", tag);
                return document.createElement("div"); // Trả về thẻ trống
            }
            return originalCreateElement.call(document, tag);
        };

        // Ngăn chặn yêu cầu mạng đến các server kiểm tra AdBlock
        const adBlockUrls = ["pagead2.googlesyndication.com", "adblock-detect", "ads.js"];
        const originalFetch = window.fetch;
        window.fetch = function (url, ...args) {
            if (adBlockUrls.some(blocked => url.includes(blocked))) {
                console.warn("[AntiAdBlock] Chặn yêu cầu mạng:", url);
                return new Promise(resolve => resolve(new Response(null, { status: 200 })));
            }
            return originalFetch.apply(this, [url, ...args]);
        };

        // Chặn script phát hiện AdBlock trước khi tải
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === "SCRIPT" && adBlockUrls.some(blocked => node.src.includes(blocked))) {
                        console.warn("[AntiAdBlock] Xóa script:", node.src);
                        node.remove();
                    }
                });
            });
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    function decryptBase64(str) {
        try {
            return atob(str);
        } catch (e) {
            return str;
        }
    }

    function decryptHex(str) {
        try {
            return decodeURIComponent(str.replace(/(..)/g, '%$1'));
        } catch (e) {
            return str;
        }
    }

    function decryptROT13(str) {
        return str.replace(/[A-Za-z]/g, function (c) {
            return String.fromCharCode(c.charCodeAt(0) + (c.toUpperCase() <= "M" ? 13 : -13));
        });
    }

    function decryptXOR(str, key = 42) {
        try {
            return str
                .split("")
                .map(char => String.fromCharCode(char.charCodeAt(0) ^ key))
                .join("");
        } catch (e) {
            return str;
        }
    }

    function decryptAES(str, key = "default_key") {
        try {
            return CryptoJS.AES.decrypt(str, key).toString(CryptoJS.enc.Utf8) || str;
        } catch (e) {
            return str;
        }
    }

    function decryptDomain(encodedStr) {
        let decrypted = encodedStr;
        decrypted = decryptBase64(decrypted);
        decrypted = decryptHex(decrypted);
        decrypted = decryptROT13(decrypted);
        decrypted = decryptXOR(decrypted);
        decrypted = decryptAES(decrypted);
        return decrypted;
    }

    function blockEncryptedPopups() {
        const originalOpen = window.open;
        window.open = function (url, ...args) {
            const decodedUrl = decryptDomain(url);
            if (decodedUrl !== url) {
                console.warn("[AntiAdBlock] Chặn popup:", decodedUrl);
                return null;
            }
            return originalOpen.apply(this, arguments);
        };
    }

    function init() {
        console.log("[AntiAdBlock] Đang khởi động...");
        blockAdProperties();
        blockAdFunctions();
        bypassAntiAdBlock();
        blockEncryptedPopups();
        console.log("[AntiAdBlock] Đã kích hoạt!");
    }

    return { init };
})();

// Khởi động thư viện
AntiAdBlock.init();
