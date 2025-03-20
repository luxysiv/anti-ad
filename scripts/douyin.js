// Create a <style> tag to insert CSS into the <head>
const style = document.createElement("style");
style.textContent = `
  [id="web-login-container"],
  div[id="captcha_container"],
  [id*="login-full-panel"],
  [class="douyin-login__header"],
  #douyin-web-recommend-guide-mask,
  #related-video-card-login-guide,
  article[class="web-login-common-wrapper"]>div {
    display: none !important;
  }
`;

// Add <style> tag to <head> of page
document.head.appendChild(style);
