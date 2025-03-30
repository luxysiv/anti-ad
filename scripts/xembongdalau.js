// Add CSS to hide elements (static and dynamic)
const style = document.createElement("style");
style.textContent = `
  .d-sm-none,
  [class="casters"],
  [class="introduce"],
  [class*="btn btn-bet"],
  [class="group-link dt d-inline-block d-sm-none"],
  [class*="bbURL"],
  [class="bbColor"],
  [id*="partner"],
  [class*="for-mobile"][class*="size-728x90"][class*="-inner"],
  [src*="images/dt"][src$=".gif"],
  [src*="wp-content/uploads"][src$=".gif"],
  [href^="/go"],
  [class="box box-host"],
  [class="topnhacai"],
  [href*="mailto:ads"],
  div[class="mmo for-mobile"],
  div[class="mmo mmo-fixbot for-mobile ft-box"],
  div[class*="bg-overlay active"],
  div[class*="modal"],
  [class*="modal-"].show,
  div.d-sm-none.group-link:nth-of-type(3) {
    display: none !important;
  }
`;
document.head.appendChild(style);

// Ensure dynamic elements are hidden after loading or from cache
const hideDynamicElements = () => {
  document.head.appendChild(style);
};

// Hide elements after 0.5 second and on cache reload
setTimeout(hideDynamicElements, 500);
window.addEventListener('pageshow', (event) => {
  if (event.persisted) hideDynamicElements();
});
