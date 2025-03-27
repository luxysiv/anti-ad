// Đặt cookie ngăn popup quảng cáo
document.cookie = "popupOpeneds=true; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT;";

// Danh sách bộ chọn để ẩn quảng cáo
const selectors = [
    '[src*="/ads/"][src$=".gif"]',
    '[id*="floating_ads_"]',
    '[class*="banner-ads"]',
    '[id*="adsmessage"]'
];

// Thêm CSS ẩn quảng cáo vào trang
const style = document.createElement("style");
style.type = "text/css";
style.textContent = selectors.map(selector => `${selector} { display: none !important; }`).join("\n");
document.head.appendChild(style);

// Chặn quảng cáo video có URL chứa "/ads/"
(function blockAds() {
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        if (args[0].includes("/ads/")) {
            console.log("Blocked ad request:", args[0]);
            return new Response(null, { status: 403 });
        }
        return originalFetch(...args);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (url.includes("/ads/")) {
            console.log("Blocked ad request:", url);
            this.abort();
        } else {
            originalOpen.apply(this, arguments);
        }
    };
})();

// Hàm tua nhanh video quảng cáo
function skipAdVideo(video) {
    if (video && video.duration) {
        video.muted = true; // Tắt tiếng quảng cáo
        video.currentTime = video.duration; // Tua đến cuối video
        console.log("Skipped ad video.");
    }
}

// Hàm tự động nhấn nút "Bỏ qua quảng cáo"
function clickSkipButton() {
    const skipText = document.querySelector('.jw-skiptext');
    const skipButton = document.querySelector('.jw-skip-icon');

    if (skipText && skipButton && skipText.innerText.includes("Bỏ qua quảng cáo")) {
        console.log("Clicking 'Bỏ qua quảng cáo' button.");
        skipButton.click();
    }
}

// Hàm kiểm tra nếu có class ".jw-text-duration" (quảng cáo) thì bỏ qua ngay
function checkAndSkipAd() {
    const durationElement = document.querySelector('.jw-icon.jw-icon-inline.jw-text.jw-reset.jw-text-duration');
    const video = document.querySelector('.jw-video');

    if (durationElement && video) {
        console.log("Ad detected! Skipping...");
        skipAdVideo(video); // Bỏ qua ngay
        setTimeout(clickSkipButton, 500); // Nhấn nút "Bỏ qua" nếu có
    }
}

// Theo dõi DOM để phát hiện quảng cáo
const observer = new MutationObserver(checkAndSkipAd);

// Bắt đầu theo dõi trang
observer.observe(document.documentElement, { childList: true, subtree: true });

// Kiểm tra ngay lập tức khi trang tải
checkAndSkipAd();
