// Define CSS rules to hide specific sections initially
const css = `
    .clz, .relates, .tip-lst,
    .mix-tags, .mix-story, .mix-stars,
    .mix-specs, .email-box, .mix-predict,
    .tx-cen.emobar, #ADMTOP,
    #aplbshare.prescript,
    div.clz:nth-of-type(1),
    div.clx:nth-of-type(14),
    div.clx:nth-of-type(16),
    div.row:nth-of-type(15),
    div.row:nth-of-type(17),
    main:nth-child(3) > 
    section:last-child > 
    div.cont-wrap > 
    div.row:first-child > 
    div.col.pad-300:first-child > 
    div.mix-cats:nth-child(6) > 
    div.row:nth-child(12) > 
    div.col.m12.w6:last-child > 
    div.capt-cover.ex-nav:first-child {
        display: none !important;
    }
`;

// Add the defined CSS to the document
const style = document.createElement('style');
style.textContent = css;
document.documentElement.appendChild(style);

// Function to hide unwanted content dynamically
function hideUnwantedContent() {
    // Keywords to identify unwanted elements based on their class, ID, or href attributes
    const keywords = [
        "phui.bongdaplus.vn", "mansion-sports",
        "chuyen-de/phong-trao", "/tip-tu-chuyen-gia",
        "/goc-check-var", "/hau-truong-bong-da",
        "/ben-ngoai-duong-piste", "/hotgirl", "/esports",
        "/soi-keo", "/dam-me", "/tran-cau-vang",
        "/keo-xien-tags", "/phao-cuu-sinh-tags", "/bong-da-phong-trao",
        "/bet-of-the-day-tags", "/nhan-dinh-bong-da"
    ];

    // Array to store CSS selectors for hiding
    const selectorsToHide = [];

    // Generate CSS selectors for keywords
    keywords.forEach(keyword => {
        selectorsToHide.push(
            `[class*="${keyword}"]`,    // Matches elements with a class containing the keyword
            `[id*="${keyword}"]`,       // Matches elements with an ID containing the keyword
            `a[href*="${keyword}"]`     // Matches anchor tags with href containing the keyword
        );
    });

    // Hide elements matching the generated selectors
    selectorsToHide.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            // Apply display: none to hide the element
            element.style.display = 'none';
        });
    });

    // Hide <li> elements containing unwanted links
    keywords.forEach(keyword => {
        document.querySelectorAll(`a[href*="${keyword}"]`).forEach(element => {
            const listItem = element.closest('li'); // Find the nearest <li> ancestor
            if (listItem) {
                // Apply display: none to hide the <li> element
                listItem.style.display = 'none';
            }
        });
    });
}

// Function to monitor changes in the DOM and hide unwanted content dynamically
function monitorContentChanges() {
    const observer = new MutationObserver(() => {
        hideUnwantedContent(); // Hide unwanted elements whenever the DOM changes
    });

    // Start observing DOM changes
    function startObserver() {
        if (document.body) {
            observer.observe(document.body, {
                childList: true, // Monitor changes to direct children
                subtree: true    // Monitor changes across all descendants
            });

            // Perform an initial cleanup when the observer starts
            hideUnwantedContent();
        } else {
            // Retry after a short delay if the document body is not ready
            setTimeout(startObserver, 10);
        }
    }

    startObserver(); // Initialize the observer
}

// Run the script
monitorContentChanges();
