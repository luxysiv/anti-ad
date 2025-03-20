// Add CSS to hide immediately
const style = document.createElement("style");
style.textContent = `
  img[class="img-delay"],
  [class*="bg-overlay active"],
  [class*="popup-banner"],
  [class*="main-popup"],
  [class$="popup"] {
    display: none !important;
  }
`;
document.head.appendChild(style);
