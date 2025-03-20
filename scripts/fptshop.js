// Add CSS to hide immediately
const style = document.createElement("style");
style.textContent = `
  [class^="zalo-chat-widget"] {
    display: none !important;
  }
`;
document.head.appendChild(style);
