// CSS rules to hide ad elements
const css = ` 
    .banner-top,
    .ad-container,
    #popup-giua-man-hinh {
       display: none !important;
    }
`;

// Create a <style> element
const style = document.createElement('style');
style.textContent = css;

// Inject the style into the HTML head
document.documentElement.appendChild(style);
