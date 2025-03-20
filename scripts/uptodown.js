// Create a <style> tag to insert CSS into the <head>
const style = document.createElement("style");
style.textContent = `
  [id="uptodown-turbo-promo"] {
    display: none !important;
  }
`;

// Add <style> tag to <head> of page
document.head.appendChild(style);
