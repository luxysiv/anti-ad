document.addEventListener('DOMContentLoaded', () => {
    function skipAd() {
        let video = null;
        const fineScrubber = document.querySelector('.ytp-fine-scrubbing');

        // Check if the current URL is a YouTube Shorts URL and exit the function if true.
        if (window.location.pathname.startsWith('/shorts/')) return;

        const moviePlayer = document.querySelector('#movie_player');

        if (moviePlayer) {
            const hasAd = moviePlayer.classList.contains('ad-showing');
            video = moviePlayer.querySelector('video.html5-main-video');

            if (hasAd) {
                const skipButton = document.querySelector(`
                    .ytp-skip-ad-button,
                    .ytp-ad-skip-button,
                    .ytp-ad-skip-button-modern,
                    .ytp-ad-survey-answer-button
                `);

                // Click the skip ad button if available.
                if (skipButton) {
                    skipButton.click();
                    skipButton.remove();
                }
                // Otherwise, fast forward to the end of the ad video.
                else if (video && video.src) {
                    video.currentTime = 9999;
                }
            }

            if (video) {
                video.addEventListener('pause', handleVideoPause);
                video.addEventListener('mouseup', allowPauseVideo);
                video.addEventListener('timeupdate', handleVideoTimeUpdate);
            }
        }

        // Remove ad-related elements if they exist.
        const pieCountdown = document.querySelector('.ytp-ad-timed-pie-countdown-container');
        if (pieCountdown) pieCountdown.remove();

        const adBlockerWarningDialog = document.querySelector(
            'tp-yt-paper-dialog:has(#feedback.ytd-enforcement-message-view-model)'
        );
        if (adBlockerWarningDialog) adBlockerWarningDialog.remove();

        const adBlockerWarningInner = document.querySelector(
            '.yt-playability-error-supported-renderers:has(.ytd-enforcement-message-view-model)'
        );
        if (adBlockerWarningInner) replaceCurrentVideo();

        const adShortVideos = document.querySelectorAll(
            'ytd-reel-video-renderer:has(.ytd-ad-slot-renderer)'
        );
        adShortVideos.forEach((adShortVideo) => adShortVideo.remove());
    }

    function handleVideoPause() {
        // Prevent YouTube's ad blocker behavior from pausing videos.
        if (video && !pausedByUser && !isTabBlurred && !document.hidden) {
            video.play();
        }
    }

    function allowPauseVideo() {
        pausedByUser = true;
        clearTimeout(allowPauseVideoTimeoutId);
        allowPauseVideoTimeoutId = setTimeout(disallowPauseVideo, 500);
    }

    function disallowPauseVideo() {
        pausedByUser = false;
    }

    function handleVideoTimeUpdate() {
        if (hasAd || video === null) return;
        currentVideoTime = video.currentTime;
    }

    async function replaceCurrentVideo() {
        const start = Math.floor(currentVideoTime);
        for (let i = 0; i < 8; i++) {
            await waitFor(500);
            const videoId = getCurrentVideoId();
            const player = document.querySelector('#ytd-player');
            if (video && !video.src && videoId && player) {
                player.loadVideoWithPlayerVars({ videoId, start });
            }
        }
    }

    function getCurrentVideoId() {
        const params = new URLSearchParams(location.search);
        return params.get('v');
    }

    function waitFor(millis) {
        return new Promise((resolve) => setTimeout(resolve, millis));
    }

    // Initialize MutationObserver
    if (window.MutationObserver) {
        const observer = new MutationObserver(skipAd);
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class', 'src'],
            childList: true,
            subtree: true,
        });
    } else {
        // Fallback for older browsers
        setInterval(skipAd, 500);
    }

    // Add CSS to hide ad elements
    const hideCssSelector = `
        .video-ads.ytp-ad-module,
        .ytp-ad-overlay-container,
        ytd-ad-slot-renderer,
        #masthead-ad,
        ytd-rich-item-renderer:has(.ytd-ad-slot-renderer),
        ytd-rich-section-renderer:has(.ytd-statement-banner-renderer),
        tp-yt-paper-dialog:has(yt-mealbar-promo-renderer),
        ytd-popup-container:has(a[href="/premium"]),
        yt-mealbar-promo-renderer,
        #related #player-ads,
        #related ytd-ad-slot-renderer,
        ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"],
        ytm-companion-ad-renderer,
        ad-slot-renderer,
        .yt-playability-error-supported-renderers,
        tp-yt-paper-dialog:has(#feedback.ytd-enforcement-message-view-model),
        ytd-reel-video-renderer:has(.ytd-ad-slot-renderer),
        .ytp-ad-timed-pie-countdown-container
    `;
    const style = document.createElement('style');
    style.textContent = `${hideCssSelector} { display: none !important }`;
    document.head.appendChild(style);

    // Variables to manage state
    let video = null;
    let hasAd = false;
    let currentVideoTime = 0;
    let pausedByUser = false;
    let isTabBlurred = false;
    let allowPauseVideoTimeoutId = 0;

    window.addEventListener('blur', () => (isTabBlurred = true));
    window.addEventListener('focus', () => (isTabBlurred = false));
});
