// Add CSS to hide immediately
const style = document.createElement("style");
style.textContent = `
  div[data-loai="popup"] {
    display: none !important;
  }
`;
document.head.appendChild(style);
