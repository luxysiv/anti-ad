// CSS rules to hide ad elements
const css = ` 
    .center-screen.backdrop,
    .turnoff-catfish,
    .img-fluid,
    [src*="/push/"][src$=".gif"] {
       display: none !important;
    }
`;

// Create a <style> element
const style = document.createElement('style');
style.textContent = css;

// Inject the style into the HTML head
document.documentElement.appendChild(style);

// Delete videojs.ads.min.js and videojs.ads.css if present
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.tagName === 'SCRIPT' && node.src && node.src.includes('videojs.ads')) {
                console.log('[AdBlock] Ad script removed:', node.src);
                node.remove();
            }

            if (node.tagName === 'LINK' && node.href && node.href.includes('videojs.ads.css')) {
                console.log('[AdBlock] Ad CSS removed:', node.href);
                node.remove();
            }
        });
    });
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});
