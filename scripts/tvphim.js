// Set a cookie with the key 'popupOpeneds' and value 'true' to prevent showing popup ads
document.cookie = "popupOpeneds=true; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT;";

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
