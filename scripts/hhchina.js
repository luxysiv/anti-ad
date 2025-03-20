// Add CSS to hide immediately
const style = document.createElement("style");
style.textContent = `
  button[class="closecf"],
  img[class="catfish-img ls-is-cached lazyloaded"],
  img[class="catfish-img"] {
    display: none !important;
  }
`;
document.head.appendChild(style);
