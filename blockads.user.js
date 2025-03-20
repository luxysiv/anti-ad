// ==UserScript==
// @name         Hide ads 
// @namespace    Mạnh Dương
// @version      1.3
// @description  Inject cosmetic script into website 
// @author       luxysiv
// @match        *://*/*
// @run-at       document-start
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// ==/UserScript==

(async function () {
    'use strict';

    // Danh sách trang web và script tương ứng (hỗ trợ regex + subdomain)
    const siteScripts = [
        {
            pattern: /\.?vnexpress\.net$/, // Match vnexpress.net & mọi subdomain (video.vnexpress.net, m.vnexpress.net, ...)
            url: "https://raw.githubusercontent.com/luxysiv/Adblock-Extension/main/scripts/vnexpress.js",
            cacheKey: "script_vnexpress"
        },
        {
            pattern: /\.?bongdaplus\.vn$/, // Match bongdaplus.vn & mọi subdomain
            url: "https://raw.githubusercontent.com/luxysiv/Adblock-Extension/main/scripts/bongdaplus.js",
            cacheKey: "script_bongdaplus"
        },
        {
            pattern: /phimmoichill/, // Match mọi domain chứa "phimmoichill"
            url: "https://raw.githubusercontent.com/luxysiv/Adblock-Extension/main/scripts/phimmoichill.js",
            cacheKey: "script_phimmoichill"
        }
    ];

    // Lấy hostname hiện tại (không gồm "www.")
    const currentHost = window.location.hostname.replace(/^www\./, "");

    // Tìm xem hostname có khớp regex nào không
    const matchedScript = siteScripts.find(site => site.pattern.test(currentHost));
    if (!matchedScript) return; // Không khớp, thoát luôn

    console.log(`[Multi-Site Injector] Trang hợp lệ: ${currentHost}`);

    // Hàm tải script & cache lại
    async function loadScriptContent(scriptInfo) {
        let cached = await GM.getValue(scriptInfo.cacheKey, null);
        if (cached) {
            console.log(`[Multi-Site Injector] Sử dụng cache cho ${currentHost}`);
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
