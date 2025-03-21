// ==UserScript==
// @name         Hide ads 
// @namespace    luxysiv
// @version      1.3.2
// @description  Inject cosmetic script into website 
// @author       Mạnh Dương
// @match        *://*/*
// @run-at       document-start
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @grant        GM.addValueChangeListener
// @icon         https://github.com/luxysiv/anti-ads/raw/refs/heads/main/icon.png
// ==/UserScript==

(async function () {
    'use strict';

    // Danh sách trang web và script tương ứng (hỗ trợ regex + subdomain)
    const siteScripts = [
        {
            pattern: /\.?vnexpress\.net$/, // Match vnexpress.net & mọi subdomain (video.vnexpress.net, m.vnexpress.net, ...)
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/vnexpress.js",
            cacheKey: "script_vnexpress"
        },
        {
            pattern: /\.?bongdaplus\.vn$/, // Match bongdaplus.vn & mọi subdomain
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/bongdaplus.js",
            cacheKey: "script_bongdaplus"
        },
        {
            pattern: /phimmoichill/, // Match mọi domain chứa "phimmoichill"
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/phimmoichill.js",
            cacheKey: "script_phimmoichill"
        },
        {
            pattern: /truyensex/, // Match mọi domain chứa "truyensex"
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/truyensex.js",
            cacheKey: "script_truyensex"
        },
        {
            pattern: /youtube\.com$/, // Match youtube.com
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/youtube.js",
            cacheKey: "script_youtube"
        },
        {
            pattern: /phimnhanh/, // Match mọi domain chứa "phimnhanh"
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/phimnhanh.js",
            cacheKey: "script_phimnhanh"
        },
        {
            pattern: /\.?24h\.com\.vn$/, // Match 24h.com.vn & mọi subdomain
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/24h.js",
            cacheKey: "script_24h"
        },
        {
            pattern: /\.?tuoitre\.vn$/, // Match tuoitre.vn & mọi subdomain
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/tuoitre.js",
            cacheKey: "script_tuoitre"
        },
        {
            pattern: /animevietsub/, // Match mọi domain chứa "animevietsub"
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/animevietsub.js",
            cacheKey: "script_animevietsub"
        },
        {
            pattern: /tvphim/, // Match mọi domain chứa "tvphim"
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/tvphim.js",
            cacheKey: "script_tvphim"
        },
        {
            pattern: /anime/, // Match mọi domain chứa "anime"
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/anime.js",
            cacheKey: "script_anime"
        },
        {
            pattern: /\.?bbc\.com$/, // Match bbc.com & mọi subdomain
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/bbc.js",
            cacheKey: "script_bbc"
        },
        {
            pattern: /nettruyenvie/, // Match mọi domain chứa "nettruyenvie"
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/nettruyenvie.js",
            cacheKey: "script_nettruyenvie"
        },
        {
            pattern: /truyenfull/, // Match mọi domain chứa "truyenfull"
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/truyenfull.js",
            cacheKey: "script_truyenfull"
        },
        {
            pattern: /\.?douyin\.com$/, // Match douyin.com & mọi subdomain
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/douyin.js",
            cacheKey: "script_douyin"
        },
        {
            pattern: /\.?fptshop\.com\.vn$/, // Match fptshop.com.vn & mọi subdomain
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/fptshop.js",
            cacheKey: "script_fptshop"
        },
        {
            pattern: /hhpanda/, // Match mọi domain chứa "hhpanda"
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/hhpanda.js",
            cacheKey: "script_hhpanda"
        },
        {
            pattern: /nangcuc/, // Match mọi domain chứa "nangcuc"
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/nangcuc.js",
            cacheKey: "script_nangcuc"
        },
        {
            pattern: /hhchina/, // Match mọi domain chứa "hhchina"
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/hhchina.js",
            cacheKey: "script_hhchina"
        },
        {
            pattern: /tv3dhay/, // Match mọi domain chứa "tv3dhay"
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/tv3dhay.js",
            cacheKey: "script_tv3dhay"
        },
        {
            pattern: /phimnhua/, // Match mọi domain chứa "phimnhua"
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/phimnhua.js",
            cacheKey: "script_phimnhua"
        },
        {
            pattern: /apkpure/, // Match mọi domain chứa "apkpure"
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/apkpure.js",
            cacheKey: "script_apkpure"
        },
        {
            pattern: /vietsubtv/, // Match mọi domain chứa "vietsubtv"
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/vietsubtv.js",
            cacheKey: "script_vietsubtv"
        },
        {
            pattern: /\.?apkmirror\.com$/, // Match apkmirror.com & mọi subdomain
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/apkmirror.js",
            cacheKey: "script_apkmirror"
        },
        {
            pattern: /\.?uptodown\.com$/, // Match uptodown.com & mọi subdomain
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/uptodown.js",
            cacheKey: "script_uptodown"
        },
        {
            pattern: /motchill/, // Match mọi domain chứa "motchill"
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/motchill.js",
            cacheKey: "script_motchill"
        },
        {
            pattern: /\.?soha\.vn$/, // Match soha.vn & mọi subdomain
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/soha.js",
            cacheKey: "script_soha"
        },
        {
            pattern: /hoathinh3d|hh3d|hhtq|hhninja|phimhoathinh3d/, // Match các domain liên quan đến hoathinh3d
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/hh3d.js",
            cacheKey: "script_hh3d"
        },
        {
            pattern: /xembongdalau|thapcam|vebo|90phut|xoilac|banhkhuc/, // Match các domain liên quan đến xembongdalau
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/xembongdalau.js",
            cacheKey: "script_xembongdalau"
        },
        {
            pattern: /phimmoi|phimmoi\.|phimmoiday|daophimtrung/, // Match các domain liên quan đến phimmoi
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/scripts/phimmoi.js",
            cacheKey: "script_phimmoi"
        }
    ];

    // Hàm tải script & cache lại
    async function loadScriptContent(scriptInfo) {
        let cached = await GM.getValue(scriptInfo.cacheKey, null);
        if (cached) {
            console.log(`[Multi-Site Injector] Sử dụng cache cho ${scriptInfo.url}`);
            return cached;
        } else {
            console.log(`[Multi-Site Injector] Đang tải script từ ${scriptInfo.url}`);
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: "GET",
                    url: scriptInfo.url,
                    onload: async function (response) {
                        if (response.status === 200) {
                            const scriptContent = response.responseText;
                            await GM.setValue(scriptInfo.cacheKey, scriptContent);
                            resolve(scriptContent);
                        } else {
                            reject(new Error(`Không tải được script: ${scriptInfo.url}`));
                        }
                    },
                    onerror: function () {
                        reject(new Error(`Lỗi khi tải script: ${scriptInfo.url}`));
                    }
                });
            });
        }
    }

    // Tải và cache tất cả các script khi cài đặt
    async function preloadScripts() {
        for (const site of siteScripts) {
            try {
                await loadScriptContent(site);
                console.log(`[Multi-Site Injector] Đã tải và cache script cho ${site.url}`);
            } catch (error) {
                console.error(`[Multi-Site Injector] Lỗi khi tải script cho ${site.url}:`, error);
            }
        }
    }

    // Kiểm tra nếu script vừa được cài đặt
    if (typeof GM_addValueChangeListener === 'function') {
        GM.addValueChangeListener('install', async function (name, oldValue, newValue, remote) {
            if (newValue === 'installed') {
                await preloadScripts();
            }
        });
    }

    // Lấy hostname hiện tại (không gồm "www.")
    const currentHost = window.location.hostname.replace(/^www\./, "");

    // Tìm xem hostname có khớp regex nào không
    const matchedScript = siteScripts.find(site => site.pattern.test(currentHost));
    if (!matchedScript) return; // Không khớp, thoát luôn

    console.log(`[Multi-Site Injector] Trang hợp lệ: ${currentHost}`);

    // Tải nội dung script & inject vào trang
    try {
        const scriptContent = await loadScriptContent(matchedScript);
        const scriptElem = document.createElement("script");
        scriptElem.textContent = scriptContent;
        document.documentElement.appendChild(scriptElem);
        console.log(`[Multi-Site Injector] Đã tiêm script cho ${currentHost}`);
    } catch (error) {
        console.error("[Multi-Site Injector] Lỗi khi tiêm script:", error);
    }

    // Menu command để xóa cache
    GM.registerMenuCommand("Clear Script Cache", async () => {
        for (const site of siteScripts) {
            await GM.setValue(site.cacheKey, null);
        }
        alert("Đã xóa cache của các script.");
    });

})();
