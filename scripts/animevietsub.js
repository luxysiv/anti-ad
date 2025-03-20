// Add CSS to hide immediately
const style = document.createElement("style");
style.textContent = `
  [href*="javascript:hide_catfish()"],
  [href*="utm_medium=topbanner"],
  [class*="mb_catfix_adv"],
  [class*="mobile-catfixx"],
  [class*="pc-catfixx"],
  [id*="hide_catfix"],
  [class*="pc_catfix_adv"],
  [class*="mobile-catfish-top"],
  [class*="header-ads-mobile"],
  [class*="Ads home_ads"],
  [class*="ads-300"],
  [class*="Ads bellow_ads_player"],
  [class*="Ads ads_player"],
  [id*="invideo_wrapper"],
  [class*="Adv ad-center-header"],
  [class*="pc-catfixx"],
  [id="floating_ads_bottom_textcss_x"],
  [src^="https://i.imgur.com"][src$=".gif"] {
    display: none !important;
  }
`;
document.head.appendChild(style);
