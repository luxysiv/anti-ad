// CSS rules to hide ad elements
const css = ` 
    .center-screen.backdrop,
    .turnoff-catfish {
       display: none !important;
    }
`;

// Create a <style> element
const style = document.createElement('style');
style.textContent = css;

// Inject the style into the HTML head
document.documentElement.appendChild(style);
