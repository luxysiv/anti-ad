// ==UserScript==
// @name         Hide ads 
// @namespace    luxysiv
// @version      1.3.2
// @description  Inject cosmetic script into website 
// @author       Mạnh Dương
// @match        *://*/*
// @run-at       document-start
// @require      https://raw.githubusercontent.com/luxysiv/anti-ads/refs/heads/main/scripts/anti-adblock.js
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @grant        GM.addValueChangeListener
// @icon         https://github.com/luxysiv/anti-ads/raw/refs/heads/main/icon.png
// ==/UserScript==

(async function () {
    'use strict';

    const SITE_SCRIPTS_URL = "https://raw.githubusercontent.com/luxysiv/anti-ads/main/site-scripts.json";
    const SITE_SCRIPTS_CACHE_KEY = "cached_site_scripts";
    const CACHE_VERSION_KEY = "cache_version";
    const SCRIPT_VERSION = "1.3.2";

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

    const cachedVersion = await GM.getValue(CACHE_VERSION_KEY, '0.0.0');
    let siteScripts;

    if (cachedVersion !== SCRIPT_VERSION) {
        console.log(`[Multi-Site Injector] Phát hiện phiên bản mới (${SCRIPT_VERSION}), làm mới cache...`);
        await GM.setValue(SITE_SCRIPTS_CACHE_KEY, null);
        siteScripts = await loadSiteScripts();
        await GM.setValue(CACHE_VERSION_KEY, SCRIPT_VERSION);
    } else {
        siteScripts = await loadSiteScripts();
    }

    const currentHost = window.location.hostname.replace(/^www\./, "");
    console.log("[Multi-Site Injector] Hostname:", currentHost);

    const matchedScript = siteScripts.find(site => {
        const regex = new RegExp(site.pattern);
        return regex.test(currentHost);
    });

    if (matchedScript) {
        console.log(`[Multi-Site Injector] Đang tải và tiêm script cho ${currentHost}`);
        try {
            const scriptContent = await loadScriptContent(matchedScript);
            const scriptEl = document.createElement('script');
            scriptEl.textContent = scriptContent;
            document.documentElement.appendChild(scriptEl);
            console.log(`[Multi-Site Injector] Đã tiêm script cho ${currentHost}`);
        } catch (error) {
            console.error("[Multi-Site Injector] Lỗi tiêm script:", error);
        }
    } else {
        console.log("[Multi-Site Injector] Không tìm thấy script phù hợp.");
    }

    if (cachedVersion !== SCRIPT_VERSION) {
        await preloadScripts(siteScripts);
    }

    GM.registerMenuCommand("Clear Script Cache", async () => {
        await GM.setValue(SITE_SCRIPTS_CACHE_KEY, null);
        await GM.setValue(CACHE_VERSION_KEY, '0.0.0');
        for (const site of siteScripts) {
            await GM.setValue(site.cacheKey, null);
        }
        alert("Đã xóa toàn bộ cache!");
    });
})();
