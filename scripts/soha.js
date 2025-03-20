// Add CSS to hide immediately
const style = document.createElement("style");
style.textContent = `
  [class="div-hide-on-open"],
  [id="ads-news-holder"],
  [id^="admzone"],
  [class="sh_bigright sct"],
  [class^="mgauto clearfix"] {
    display: none !important;
  }
`;
document.head.appendChild(style);
