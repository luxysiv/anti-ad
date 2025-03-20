// Add CSS to hide immediately
function addStyle() {
  if (document.head) {
    const style = document.createElement("style");
    style.textContent = `
      [data-testid*="ad-unit"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  } else {
    setTimeout(addStyle, 10);
  }
}

// Using MutationObserver to monitor DOM changes
const observer = new MutationObserver((mutations, obs) => {
  if (document.head) {
    addStyle();
    obs.disconnect(); // Stop tracking after completion
  }
});

// Start tracking the entire document
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

// Call the addStyle() function immediately
addStyle();
