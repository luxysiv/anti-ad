// ==UserScript==
// @name         Hide ads 
// @namespace    Mạnh Dương
// @version      1.3.1
// @description  Inject cosmetic script into website 
// @author       luxysiv
// @match        *://*/*
// @run-at       document-start
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @grant        GM.addValueChangeListener
// ==/UserScript==

(async function () {
    'use strict';

    // Danh sách trang web và script tương ứng (hỗ trợ regex + subdomain)
    const siteScripts = [
        {
            pattern: /\.?vnexpress\.net$/, // Match vnexpress.net & mọi subdomain (video.vnexpress.net, m.vnexpress.net, ...)
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/vnexpress.user.js",
            cacheKey: "script_vnexpress"
        },
        {
            pattern: /\.?bongdaplus\.vn$/, // Match bongdaplus.vn & mọi subdomain
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/bongdaplus.user.js",
            cacheKey: "script_bongdaplus"
        },
        {
            pattern: /phimmoichill/, // Match mọi domain chứa "phimmoichill"
            url: "https://github.com/luxysiv/anti-ads/raw/refs/heads/main/phimmoichill.user.js",
            cacheKey: "script_phimmoichill"
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
