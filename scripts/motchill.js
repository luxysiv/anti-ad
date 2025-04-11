// Inject CSS to hide ad elements
const css = `
    .catfish-img {
        display: none !important;
    }
`;
const style = document.createElement('style');
style.textContent = css;
document.documentElement.appendChild(style);
