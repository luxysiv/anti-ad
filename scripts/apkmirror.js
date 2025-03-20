// Create a <style> tag to insert CSS into the <head>
const style = document.createElement("style");
style.textContent = `
  .listWidget > div.appRow:has(> div.ains > span.advertisement-text),
  .x-showOnTabletAndDesktop.google-ad-square-inline.gooWidget > .apkm-initialized.adslot.adsbygoogle,
  .ai-viewport-5.ai-viewport-1.ains-apkm_release_page_descriptiontab.ains-has-label.ains-29.ains,
  .ai-viewport-5.ai-viewport-1.ains-apkm_app_page_descriptiontab.ains-has-label.ains-35.ains,
  [class$="ains-has-label ains-apkm_release_page_below_description_above_downloads"],
  [class$="ains-has-label ains-apkm_release_page_top"],
  [class$="ains-has-label ains-apkm_billboard_top"],
  [class$="ains-has-label ains-apkm_thankyou_page_top"],
  [class$="ains-has-label ains-apkm_apk_page_top"],
  [class="adsbygoogle adslot apkm-initialized"],
  [class^="advertisement-text"],
  [id="bottom-slider"],
  [id^="ai_widget-"] {
    display: none !important;
  }
`;

// Add <style> tag to <head> of page
document.head.appendChild(style);
