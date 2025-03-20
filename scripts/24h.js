// Function to hide ads based on content or dynamic classes
const selectors = [
  // Fixed ID and class
  '[id*="banner_duoi_tin_so_6"]',
  '[id*="div_inpage_banner"]',
  '[id*="banner-inpage"]',
  '[class*="m_banner_show"]',
  '[class*="footer-24h-lhqc"]',
  '[id*="div_box_danh_rieng_cho_phai_dep"]',

  // Class or dynamic selector
  '[id*="ADS_"][id*="container"]',
  '[class*="module_"][class*="_ads"]',
  '[id*="google_ads_iframe"][id*="mobile"]',
];

// Create CSS to hide all elements
const cssRules = selectors.map(selector => `${selector} { display: none !important; }`).join('\n');

// Add CSS to <head>
const globalStyle = document.createElement('style');
globalStyle.type = 'text/css';
globalStyle.textContent = cssRules;
document.head.appendChild(globalStyle);

// Function to add class to elements to be hidden
function markSponsoredAndLadyContent() {
    // Tick "Tin tài trợ"
    document.querySelectorAll('span').forEach(span => {
        if (span.textContent.trim() === 'Tin tài trợ') {
            span.classList.add('hidden-sponsored');
            const parent = span.closest('div');
            if (parent) parent.classList.add('hidden-sponsored-parent');
        }
    });

    // Tick "Dành cho phái đẹp"
    document.querySelectorAll('section, h5').forEach(element => {
        if (element.textContent.trim() === 'Dành cho phái đẹp') {
            const section = element.closest('section');
            if (section) section.classList.add('hidden-lady');
        }
    });

    // Tick "Dành riêng cho phái đẹp"
    document.querySelectorAll('a').forEach(link => {
        if (link.textContent.trim() === 'Dành riêng cho phái đẹp') {
            link.classList.add('hidden-special-link');
            const parentHeader = link.closest('header');
            if (parentHeader) parentHeader.classList.add('hidden-special-header');
        }
    });
}

// Add CSS to <head> to hide elements based on class
const style = document.createElement('style');
style.type = 'text/css';
style.textContent = `
    .hidden-sponsored {
        display: none !important;
    }
    .hidden-sponsored-parent {
        display: none !important;
    }
    .hidden-lady {
        display: none !important;
    }
    .hidden-special-link {
        display: none !important;
    }
    .hidden-special-header {
        display: none !important;
    }
`;
document.head.appendChild(style);

// Track changes in the DOM
const observer = new MutationObserver(() => markSponsoredAndLadyContent());

// Launch DOM observer
function startObserver() {
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
        markSponsoredAndLadyContent();
    } else {
        setTimeout(startObserver, 50);
    }
}

// Call the launch function
startObserver();
