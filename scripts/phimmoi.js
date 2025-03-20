// Set cookies to block popup ads
document.cookie = "cucre=cucre%20Popunder; path=/; SameSite=Lax;";

// Add CSS to hide immediately
const style = document.createElement("style");
style.textContent = `
  [src^="https://i.imgur.com"][src$=".gif"],
  [id="floating_ads_bottom_textcss_x"],
  div.container:nth-of-type(2) {
    display: none !important;
  }
`;
document.head.appendChild(style);
