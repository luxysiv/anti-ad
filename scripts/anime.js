// Add CSS to hide immediately
const style = document.createElement("style");
style.textContent = `
  .gnarty-offads,
  [class^="jw-logo"],
  [class*="gnartyx-offads"],
  [class="ads_sticky_bottom"],
  [class="mobile-ads-content"],
  [class="banner-sticky-footer-ad"],
  [id*="fbox"] {
    display: none !important;
  }
`;
document.head.appendChild(style);
