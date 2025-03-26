// Set a cookie with the key 'popupOpened' and value 'true' to prevent showing popup ads
document.cookie = "popupOpened=true; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT;";

// Inject CSS to hide ad elements
const css = `
    .catfish-img {
        display: none !important;
    }
`;
const style = document.createElement('style');
style.textContent = css;
document.documentElement.appendChild(style);
