// Add CSS to hide immediately
const style = document.createElement("style");
style.textContent = `
  img[alt="Đóng"],
  img[id="catfish1"],
  div[class="popUpBannerBox"] {
    display: none !important;
  }
`;
document.head.appendChild(style);
