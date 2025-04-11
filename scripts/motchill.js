// 1. Hide ads with CSS
const css = `
    .catfish-img {
        display: none !important;
    }
`;
const style = document.createElement('style');
style.textContent = css;
document.documentElement.appendChild(style);

// 2. Lock localStorage popupLastOpened permanently
(function () {
    const lastOpenKey = "popupLastOpened";
    const fakeTime = Date.now(); // or use "0" if you want popups to always be blocked
    // Write initial value
    localStorage.setItem(lastOpenKey, fakeTime.toString());

    // Override localStorage.setItem to prevent re-editing
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
        if (key === lastOpenKey) {
            console.log("Đã chặn ghi đè popupLastOpened");
            return;
        }
        return originalSetItem.apply(this, arguments);
    };

    console.log("Ads hidden & popup blockedLastOpened.");
})();
