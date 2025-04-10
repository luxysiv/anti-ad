// ==UserScript==
// @name         Hide ads 
// @namespace    luxysiv
// @version      1.3.5
// @description  Inject cosmetic script into website 
// @author       Mạnh Dương
// @match        *://*/*
// @run-at       document-start
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @icon         https://github.com/luxysiv/anti-ads/raw/refs/heads/main/icon.png
// ==/UserScript==

(async function () {
    'use strict';

    const SITE_SCRIPTS_URL = "https://api.github.com/repos/luxysiv/anti-ads/contents/site-scripts.json?ref=main";
    const SITE_SCRIPTS_CACHE_KEY = "cached_site_scripts";
    const CACHE_VERSION_KEY = "cache_version";
    const SCRIPT_VERSION = "1.3.5";

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

    function tryInjectScript(scriptContent, scriptUrl = "") {
        const attempts = [
            () => {
                const el = document.createElement("script");
                el.textContent = scriptContent;
                document.documentElement.appendChild(el);
                console.log("[Hide Ads] Phương án #1: Inject bằng textContent thành công");
            },
            () => {
                const fn = new Function(scriptContent);
                fn();
                console.log("[Hide Ads] Phương án #2: Inject bằng Function() thành công");
            },
            () => {
                const iframe = document.createElement("iframe");
                iframe.style.display = "none";
                iframe.sandbox = "allow-scripts";
                iframe.srcdoc = `<script>${scriptContent}<\/script>`;
                document.body.appendChild(iframe);
                console.log("[Hide Ads] Phương án #3: Inject bằng iframe sandbox thành công");
            },
            () => {
                const blob = new Blob([scriptContent], { type: "text/javascript" });
                const url = URL.createObjectURL(blob);
                const s = document.createElement("script");
                s.src = url;
                document.documentElement.appendChild(s);
                console.log("[Hide Ads] Phương án #4: Inject bằng blob src thành công");
            },
            () => {
                const s = document.createElement("script");
                s.setAttribute("src", scriptUrl);
                document.documentElement.appendChild(s);
                console.log("[Hide Ads] Phương án #5: Inject bằng script src thành công");
            }
        ];

        for (const fn of attempts) {
            try {
                fn();
                return true;
            } catch (_) {}
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
        const success = tryInjectScript(scriptContent, matchedScript.url);
        if (!success) {
            console.log("[Hide Ads] Tất cả phương án inject đều bị chặn bởi CSP.");
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
