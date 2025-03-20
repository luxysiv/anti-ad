// Inject CSS to hide ad elements
const css = `
    .ads,
    .closecf,
    .adsv2,
    #clearads,
    #box_ads,
    #catfish,
    #header_ads,
    .banner-ads-cs,
    .catfish-img.lazyload {
        display: none !important;
    }
`;

// Add the defined CSS to the document
const style = document.createElement('style');
style.textContent = css;
document.documentElement.appendChild(style);
