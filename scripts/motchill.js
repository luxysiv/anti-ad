// Inject CSS to hide ad elements
const css = `
    .catfish-img {
        display: none !important;
    }
`;
const style = document.createElement('style');
style.textContent = css;
document.documentElement.appendChild(style);

// Block popups and remove malicious event listeners
(function () {
    const blockedUrl = "voucherr.shop/popchill.html";

    // Override window.open to block popups
    const originalOpen = window.open;
    window.open = function(url, target, features) {
        if (url && url.includes(blockedUrl)) {
            console.log("Popup bị chặn:", url);
            return null;
        }
        return originalOpen.apply(this, arguments);
    };

    // Non-mobile emulator to block trigger condition
    Object.defineProperty(navigator, 'userAgent', {
        get: function () {
            return "desktop";
        },
        configurable: true
    });

    // Block additional click events containing malicious code
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        const listenerStr = listener?.toString?.() || "";
        if (type === "click" && listenerStr.includes(blockedUrl)) {
            console.log("Đã chặn click event chứa popup.");
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
})();
