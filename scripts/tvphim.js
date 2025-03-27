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

// Hàm lấy thời lượng video quảng cáo từ class ".jw-text-duration"
function getAdDuration() {
    const durationElement = document.querySelector('.jw-text-duration');
    if (durationElement) {
        const durationText = durationElement.innerText; // Ví dụ: "00:33"
        const parts = durationText.split(':').map(Number);
        if (parts.length === 2) {
            return parts[0] * 60 + parts[1]; // Chuyển đổi sang giây
        }
    }
    return null;
}

// Theo dõi DOM để phát hiện quảng cáo
const observer = new MutationObserver(() => {
    const adPlayer = document.querySelector('.jw-flag-ads'); // Phát hiện quảng cáo
    const video = document.querySelector('.jw-video'); // Video hiện tại

    if (adPlayer && video) {
        const adDuration = getAdDuration(); // Lấy thời lượng video quảng cáo
        console.log("Ad duration:", adDuration, "seconds");
        if (adDuration && adDuration <= 30) {
            skipAdVideo(video); // Bỏ qua quảng cáo nếu thời lượng ≤ 30 giây
        }
        setTimeout(clickSkipButton, 500);
    }
});

// Bắt đầu theo dõi trang
observer.observe(document.documentElement, { childList: true, subtree: true });
