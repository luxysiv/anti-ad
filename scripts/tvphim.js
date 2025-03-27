// Set a cookie with the key 'popupOpeneds' and value 'true' to prevent showing popup ads
document.cookie = "popupOpeneds=true; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT;";

// List of selectors to hide
const selectors = [
  '[src*="/ads/"][src$=".gif"]',
  '[src*="/ads/"][src$=".mp4"]',
  '[id*="floating_ads_"]',
  '[class*="banner-ads"]',
  '[id*="adsmessage"]'
];

// Create and add CSS to <head> to hide elements
const style = document.createElement("style");
style.type = "text/css";
style.textContent = selectors.map(selector => `${selector} { display: none !important; }`).join("\n");
document.head.appendChild(style);

// Hàm tua nhanh video quảng cáo
function skipAdVideo(video) {
    if (video && video.duration) {
        video.muted = true; // Tắt tiếng quảng cáo
        video.currentTime = video.duration; // Tua đến cuối video
        console.log("Skipped ad video.");
    }
}

// Hàm nhấn nút "Bỏ qua quảng cáo" nếu có
function clickSkipButton() {
    const skipText = document.querySelector('.jw-skiptext'); // Phần chữ "Bỏ qua quảng cáo"
    const skipButton = document.querySelector('.jw-skip-icon'); // Nút Skip (icon)

    if (skipText && skipButton && skipText.innerText.includes("Bỏ qua quảng cáo")) {
        console.log("Clicking 'Bỏ qua quảng cáo' button.");
        skipButton.click(); // Nhấn nút Skip
    }
}

// Theo dõi DOM để phát hiện quảng cáo và skip
const observer = new MutationObserver(() => {
    const adPlayer = document.querySelector('.jw-flag-ads'); // Player ở trạng thái quảng cáo
    const video = document.querySelector('.jw-video'); // Video trong JW Player

    if (adPlayer && video) {
        skipAdVideo(video); // Tua video quảng cáo
        setTimeout(clickSkipButton, 500); // Nhấn nút "Bỏ qua quảng cáo" sau 0.5s
    }
});

// Bắt đầu theo dõi toàn bộ trang web
observer.observe(document.documentElement, { childList: true, subtree: true });
