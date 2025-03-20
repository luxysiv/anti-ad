// Add CSS to hide elements as soon as the script runs
const styleTag = document.createElement('style');
styleTag.textContent = `
  .box-kd-300,
  [class="inner_section section_wrap_poll mb20"],
  [id="button-adblock"],
  [id="supper_masthead"],
  [id="sync_bgu_and_masthead"],
  [class="item-box-cate"],
  [class="wrap-hd-adblock"],
  [class="box-category box-ebank-qt"],
  [class="menu_grid2 width_common"],
  [class="contact downloadapp"],
  [class="guitoasoan_btn ads_btn"],
  [class="mb30 guitoasoan_btn ads_btn"],
  [class="list_item_panel width_common"],
  [class="ads"],
  [class="list-link"],
  [class="container box-news-other-site"],
  [class="width_common app_info vne_app"],
  [class*="section box_300_targer clearfix"],
  [class*="newsletters_footer_mb coppy_right_info width_common"],
  [class*="installvneapp installvneapp--small js_installvneapp"],
  [id*="newsletters"],
  [id*="podcastIcon"],
  [class="inner_ads"],
  [id*="banner_top"],
  [id*="raovat"],
  [id*="thongtindoanhnghiep"],
  [class="width_common box-ewiki animated animatedFadeInUp fadeInUp"],
  [class="art_item art_section list_news_common list_news_common_v2 inner_section width_common article_ads"],
  [class="inner_section box_category box_category_v2 box-tvol-vs"],
  [class="section box_category_v2 section_ads_300x250"],
  [class="section box_300_targer clearfix"] {
    display: none !important;
  }
`;
document.documentElement.appendChild(styleTag);

// Handling unwanted links
function hideUnwantedLinks() {
  const unwantedLinks = [
    'li.item-menu > a[href*="raovat.vnexpress.net"]',
    'li.item-menu > a[href*="startup.vnexpress.net"]',
    'li.link > a[href*="raovat.vnexpress.net"]',
    'li.link > a[href*="startup.vnexpress.net"]',
  ];

  unwantedLinks.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      const listItem = element.closest('li');
      if (listItem) {
        listItem.style.display = 'none';
      }
    });
  });
}

// Watch the DOM to hide elements when the DOM changes
const observer = new MutationObserver(() => {
  hideUnwantedLinks();
});

function startObserver() {
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    hideUnwantedLinks(); // Do it right from the start
  } else {
    setTimeout(startObserver, 50);
  }
}

startObserver();
