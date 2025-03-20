// Set a cookie with the key 'popupOpened' to prevent popup ads
document.cookie = "popupOpened=true; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT;";

// Inject CSS to hide ad elements
const css = `
    #hide_catfish > a {
        display: none !important;
    }
`;
const style = document.createElement('style');
style.textContent = css;
document.documentElement.appendChild(style);
