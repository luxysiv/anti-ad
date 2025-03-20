// List of selectors to hide
const selectors = [
  '[src*="/ads/"][src$=".gif"]',
  '[id*="floating_ads_"]',
  '[class*="banner-ads"]',
  '[id*="adsmessage"]'
];

// Create and add CSS to <head> to hide elements
const style = document.createElement("style");
style.type = "text/css";
style.textContent = selectors.map(selector => `${selector} { display: none !important; }`).join("\n");
document.head.appendChild(style);
