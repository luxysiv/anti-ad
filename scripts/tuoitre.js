// Add CSS to hide immediately
function addStyle() {
  if (document.head) {
    const style = document.createElement("style");
    style.textContent = `
      .gridmenu,
      .box-raovat,
      .detail-ggfl,
      #admbackground,
      .detail__flex > .detail__qc,
      .overlay-ad,
      #LeaderBoardTop,
      .footer__register,
      .footer__m-right,
      .detail__cmain .detail-follow-gg,
      div.item:nth-of-type(20),
      div.item:nth-of-type(24),
      div.item:nth-of-type(25) {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  } else {
    setTimeout(addStyle, 10);
  }
}

// Call the addStyle() function immediately
addStyle();

// Hide elements containing the keyword "Rao vặt"
function hideRaoVat() {
  document.querySelectorAll('div.boxraovat_catedetail.mt-20').forEach((element) => {
    if (element.textContent.includes('Rao vặt')) {
      element.style.display = 'none'; // Hide element
    }
  });
}

// Function to start the observer safely
function startObserver() {
  if (!document.body) {
    setTimeout(startObserver, 10); // Retry until document.body is available
    return;
  }

  // Call function to hide available elements
  hideRaoVat();

  // Observe DOM changes to hide new elements
  const observer = new MutationObserver(() => {
    hideRaoVat(); // Hide if a new element is added
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Ensure DOM is loaded before running the observer
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startObserver);
} else {
  startObserver();
}
