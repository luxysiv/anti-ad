// ==UserScript==
// @name         Hide ads 
// @namespace    luxysiv
// @version      1.3.6
// @description  Inject cosmetic script into website 
// @author       Mạnh Dương
// @match        *://*/*
// @run-at       document-start
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @grant        GM.addElement
// @icon         https://github.com/luxysiv/anti-ads/raw/refs/heads/main/icon.png
// ==/UserScript==

(async function () {
    'use strict';

    const SITE_SCRIPTS_URL = "https://api.github.com/repos/luxysiv/anti-ads/contents/site-scripts.json?ref=main";
    const SITE_SCRIPTS_CACHE_KEY = "cached_site_scripts";
    const CACHE_VERSION_KEY = "cache_version";
    const SCRIPT_VERSION = "1.3.6";

    async function fetchRawContent(url) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url,
                headers: { 'Accept': 'application/vnd.github.v3.raw' },
                onload: r => r.status === 200 ? resolve(r.responseText) : reject(r),
                onerror: reject
            });
        });
    }

    async function loadSiteScripts() {
        const cached = await GM.getValue(SITE_SCRIPTS_CACHE_KEY, null);
        if (cached) {
            console.log("[Hide Ads] Sử dụng cache site-scripts.json");
            return cached;
        }

        try {
            console.log("[Hide Ads] Tải site-scripts.json từ server...");
            const jsonText = await fetchRawContent(SITE_SCRIPTS_URL);
            const data = JSON.parse(jsonText);
            await GM.setValue(SITE_SCRIPTS_CACHE_KEY, data);
            return data;
        } catch (e) {
            return [];
        }
    }

    async function loadScriptContent(scriptInfo) {
        const cacheKey = scriptInfo.cacheKey;
        const cached = await GM.getValue(cacheKey, null);
        if (cached) {
            console.log(`[Hide Ads] Sử dụng cache cho ${scriptInfo.url}`);
            return cached;
        }

        try {
            console.log(`[Hide Ads] Tải script từ ${scriptInfo.url}`);
            const content = await fetchRawContent(scriptInfo.url);
            await GM.setValue(cacheKey, content);
            return content;
        } catch (e) {
            return "";
        }
    }

    async function preloadAllScripts(siteScripts) {
        for (const site of siteScripts) {
            try {
                await loadScriptContent(site);
                console.log(`[Hide Ads] Đã preload script: ${site.url}`);
            } catch (e) {
                // Ẩn lỗi preload
            }
        }
    }

    function tryInjectScript(scriptContent) {
        const attempts = [
            () => {
                const el = document.createElement("script");
                el.textContent = scriptContent;
                document.documentElement.appendChild(el);
                console.log("[Hide Ads] Inject bằng textContent thành công (phương án #1)");
            },
            () => {
                if (typeof GM.addElement === 'function') {
                    GM.addElement('script', {
                        textContent: scriptContent
                    });
                    console.log("[Hide Ads] Inject bằng GM.addElement thành công (phương án #2)");
                } else {
                    throw new Error("GM.addElement không khả dụng");
                }
            }
        ];

        for (const fn of attempts) {
            try {
                fn();
                return true;
            } catch (e) {
                console.warn("[Hide Ads] Phương án inject thất bại:", e);
            }
        }

        return false;
    }

    const currentHost = location.hostname.replace(/^www\./, "");
    const cachedVersion = await GM.getValue(CACHE_VERSION_KEY, "0.0.0");

    let siteScripts;
    if (cachedVersion !== SCRIPT_VERSION) {
        await GM.setValue(SITE_SCRIPTS_CACHE_KEY, null);
        siteScripts = await loadSiteScripts();
        await GM.setValue(CACHE_VERSION_KEY, SCRIPT_VERSION);
    } else {
        siteScripts = await loadSiteScripts();
    }

    const matchedScript = siteScripts.find(site => new RegExp(site.pattern).test(currentHost));
    if (matchedScript) {
        console.log(`[Hide Ads] Phát hiện host khớp: ${currentHost}, đang inject...`);
        const scriptContent = await loadScriptContent(matchedScript);
        const success = tryInjectScript(scriptContent);
        if (!success) {
            console.log("[Hide Ads] Inject thất bại – tất cả phương án đều bị chặn.");
        }
    } else {
        console.log("[Hide Ads] Không tìm thấy script phù hợp với hostname.");
    }

    if (cachedVersion !== SCRIPT_VERSION) {
        preloadAllScripts(siteScripts);
    }

    GM.registerMenuCommand("Clear Script Cache", async () => {
        await GM.setValue(SITE_SCRIPTS_CACHE_KEY, null);
        await GM.setValue(CACHE_VERSION_KEY, "0.0.0");
        for (const site of siteScripts) {
            await GM.setValue(site.cacheKey, null);
        }
        alert("Đã xóa toàn bộ cache!");
    });
})();
