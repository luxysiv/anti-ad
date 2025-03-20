// Selector to hide elements (declared once)
const selectorsToHide = '[class*="ad-adsense"]';

// Add CSS to hide immediately
const style = document.createElement('style');
style.textContent = `
  ${selectorsToHide} {
    display: none !important;
  }
`;
document.head.appendChild(style);
