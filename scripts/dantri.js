// Add CSS to hide immediately
function addStyle() {
  if (document.head) {
    const style = document.createElement("style");
    style.textContent = `
      [id^="mobile-home-native-ads"],
      [id="mobile-home-top-page"],
      [id="bannerMasthead"],
      [id="mobile-top-page"],
      [class="article-business"],
      div[id="swiper-business"],
      div[class="sidebar"],
      div[class="poll page-home"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  } else {
    // If document.head does not ready, try again after 10ms
    setTimeout(addStyle, 10);
  }
}

addStyle();
