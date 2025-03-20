// CSS rules to hide ads and increase font size
const css = `
    #qccat,
    #qctop,
    #trennd,
    #duoind,
    .dulieu,
    .footer {
        display: none !important;
    }
    
    /* Adjust font size to 105% for all text elements */
    body, body * {
        font-size: 105% !important;
        line-height: 1.6 !important; /* Optional: improve readability with increased line height */
    }
`;

// Create a <style> element and apply the CSS rules
const style = document.createElement('style');
style.textContent = css;
document.documentElement.appendChild(style);
