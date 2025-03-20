// Inject CSS to hide ad elements
const css = `
    .overlay_content,
    #overlay,
    .btn-fanpage.btn-default.btn-block.btn,
    .blink_me,
    .underplayer_btn,
    div.text-center:nth-of-type(1),
    div.text-center:nth-of-type(2), 
    div.text-center:nth-of-type(3),
    #ad_pc_bottom_float,
    #ad_close_popup2,
    #top_addd, 
    .under-player {
        display: none !important;
    }
`;

// Add the defined CSS to the document
const style = document.createElement('style');
style.textContent = css;
document.documentElement.appendChild(style);
