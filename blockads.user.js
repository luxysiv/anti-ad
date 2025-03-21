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

    // URL đến file JSON chứa danh sách các script
    const SITE_SCRIPTS_URL = "https://raw.githubusercontent.com/luxysiv/anti-ads/refs/heads/main/site-scripts.json"; // Thay bằng URL thực tế của bạn

    // Hàm tải file JSON chứa danh sách các script
    async function loadSiteScripts() {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: SITE_SCRIPTS_URL,
                onload: function (response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (error) {
                            reject(new Error("Lỗi khi phân tích JSON: " + error.message));
                        }
                    } else {
                        reject(new Error("Không tải được file JSON: " + response.status));
                    }
                },
                onerror: function () {
                    reject(new Error("Lỗi khi tải file JSON"));
                }
            });
        });
    }

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
    async function preloadScripts(siteScripts) {
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
                const siteScripts = await loadSiteScripts();
                await preloadScripts(siteScripts);
            }
        });
    }

    // Lấy hostname hiện tại (không gồm "www.")
    const currentHost = window.location.hostname.replace(/^www\./, "");

    // Tải danh sách các script từ file JSON
    let siteScripts;
    try {
        siteScripts = await loadSiteScripts();
    } catch (error) {
        console.error("[Multi-Site Injector] Lỗi khi tải danh sách script:", error);
        return;
    }

    // Tìm xem hostname có khớp regex nào không
    const matchedScript = siteScripts.find(site => new RegExp(site.pattern).test(currentHost));
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
        const siteScripts = await loadSiteScripts();
        for (const site of siteScripts) {
            await GM.setValue(site.cacheKey, null);
        }
        alert("Đã xóa cache của các script.");
    });

})();
