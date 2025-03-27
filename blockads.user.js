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
// @icon         data:image/png;base64,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
// ==/UserScript==

(async function () {
    'use strict';

    // URL đến file JSON chứa danh sách các script
    const SITE_SCRIPTS_URL = "https://raw.githubusercontent.com/luxysiv/anti-ads/main/site-scripts.json";
    const SITE_SCRIPTS_CACHE_KEY = "cached_site_scripts";
    const CACHE_VERSION_KEY = "cache_version"; // Key để lưu phiên bản cache
    const SCRIPT_VERSION = "1.3.2"; // Phải khớp với @version

    // Hàm tải file JSON chứa danh sách các script
    async function loadSiteScripts() {
        const cachedScripts = await GM.getValue(SITE_SCRIPTS_CACHE_KEY, null);
        if (cachedScripts) {
            console.log("[Multi-Site Injector] Sử dụng cache cho site-scripts.json");
            return cachedScripts;
        }

        console.log("[Multi-Site Injector] Đang tải site-scripts.json từ server...");
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: SITE_SCRIPTS_URL,
                onload: function (response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            GM.setValue(SITE_SCRIPTS_CACHE_KEY, data);
                            console.log("[Multi-Site Injector] Đã tải và cache site-scripts.json");
                            resolve(data);
                        } catch (error) {
                            console.error("[Multi-Site Injector] Lỗi phân tích JSON:", error);
                            reject(error);
                        }
                    } else {
                        reject(new Error(`Lỗi HTTP: ${response.status}`));
                    }
                },
                onerror: reject
            });
        });
    }

    // Hàm tải script & cache lại
    async function loadScriptContent(scriptInfo) {
        const cached = await GM.getValue(scriptInfo.cacheKey, null);
        if (cached) {
            console.log(`[Multi-Site Injector] Sử dụng cache cho ${scriptInfo.url}`);
            return cached;
        }

        console.log(`[Multi-Site Injector] Đang tải script từ ${scriptInfo.url}`);
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: scriptInfo.url,
                onload: async function (response) {
                    if (response.status === 200) {
                        const content = response.responseText;
                        await GM.setValue(scriptInfo.cacheKey, content);
                        resolve(content);
                    } else {
                        reject(new Error(`Lỗi HTTP: ${response.status}`));
                    }
                },
                onerror: reject
            });
        });
    }

    // Tải và cache tất cả script
    async function preloadScripts(siteScripts) {
        for (const site of siteScripts) {
            try {
                await loadScriptContent(site);
                console.log(`[Multi-Site Injector] Đã cache script: ${site.url}`);
            } catch (error) {
                console.error(`[Multi-Site Injector] Lỗi tải script ${site.url}:`, error);
            }
        }
    }

    // Xử lý cache khi cập nhật phiên bản
    const cachedVersion = await GM.getValue(CACHE_VERSION_KEY, '0.0.0');
    let siteScripts;

    if (cachedVersion !== SCRIPT_VERSION) {
        console.log(`[Multi-Site Injector] Phát hiện phiên bản mới (${SCRIPT_VERSION}), làm mới cache...`);
        await GM.setValue(SITE_SCRIPTS_CACHE_KEY, null); // Xóa cache cũ
        siteScripts = await loadSiteScripts(); // Tải lại JSON
        await preloadScripts(siteScripts); // Tải lại toàn bộ script
        await GM.setValue(CACHE_VERSION_KEY, SCRIPT_VERSION); // Cập nhật phiên bản
    } else {
        siteScripts = await loadSiteScripts(); // Tải từ cache
    }

    // Kiểm tra hostname hiện tại
    const currentHost = window.location.hostname.replace(/^www\./, "");
    console.log("[Multi-Site Injector] Hostname:", currentHost);

    // Tìm script phù hợp
    const matchedScript = siteScripts.find(site => {
        const regex = new RegExp(site.pattern);
        return regex.test(currentHost);
    });

    if (!matchedScript) {
        console.log("[Multi-Site Injector] Không tìm thấy script phù hợp.");
        return;
    }

    // Inject script vào trang
    try {
        const scriptContent = await loadScriptContent(matchedScript);
        const scriptEl = document.createElement('script');
        scriptEl.textContent = scriptContent;
        document.documentElement.appendChild(scriptEl);
        console.log(`[Multi-Site Injector] Đã tiêm script cho ${currentHost}`);
    } catch (error) {
        console.error("[Multi-Site Injector] Lỗi tiêm script:", error);
    }

    // Menu xóa cache
    GM.registerMenuCommand("Clear Script Cache", async () => {
        await GM.setValue(SITE_SCRIPTS_CACHE_KEY, null);
        await GM.setValue(CACHE_VERSION_KEY, '0.0.0');
        for (const site of siteScripts) {
            await GM.setValue(site.cacheKey, null);
        }
        alert("Đã xóa toàn bộ cache!");
    });
})();
