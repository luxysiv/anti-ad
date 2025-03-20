// Add CSS to hide immediately
const style = document.createElement("style");
style.textContent = `
  [class="banner text-center"],
  [class="wapclosebtn ads-banner"],
  [class^="banner-adu"][class$="container text-center"],
  [class="notify_block"],
  ul[style="opacity:0.07;"]>li {
    display: none !important;
  }
`;
document.head.appendChild(style);
