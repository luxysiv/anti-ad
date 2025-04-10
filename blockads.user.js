// ==UserScript==
// @name         Hide ads
// @namespace    luxysiv
// @version      1.4.5
// @description  Inject cosmetic script into websites
// @author       Mạnh Dương
// @match        *://*/*
// @run-at       document-start
// @icon         https://github.com/luxysiv/anti-ads/raw/refs/heads/main/icon.png
// ==/UserScript==

(async function () {
    'use strict';

    const SCRIPT_VERSION = "1.4.5";
    const SITE_SCRIPTS_URL = "https://api.github.com/repos/luxysiv/anti-ads/contents/site-scripts.json?ref=main";
    const SITE_SCRIPTS_CACHE_KEY = "cached_site_scripts";
    const CACHE_VERSION_KEY = "cache_version";
    const currentHost = window.location.hostname.replace(/^www\./, "");

    if (location.search.includes("clear-cache")) {
        localStorage.clear();
        alert("Cache đã được xóa!");
        location.href = location.origin + location.pathname;
        return;
    }

    function getCache(key, defaultValue = null) {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : defaultValue;
    }

    function setCache(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    async function fetchScriptContent(url) {
        const headers = url.includes('api.github.com')
            ? { 'Accept': 'application/vnd.github.v3.raw' }
            : {};
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return await response.text();
    }

    async function loadSiteScripts() {
        const cachedScripts = getCache(SITE_SCRIPTS_CACHE_KEY);
        if (cachedScripts) {
            console.log("[Hide Ads] Sử dụng cache cho site-scripts.json");
            return cachedScripts;
        }

        console.log("[Hide Ads] Đang tải site-scripts.json từ GitHub API...");
        try {
            const content = await fetchScriptContent(SITE_SCRIPTS_URL);
            const data = JSON.parse(content);
            setCache(SITE_SCRIPTS_CACHE_KEY, data);
            return data;
        } catch (e) {
            console.error("[Hide Ads] Lỗi tải site-scripts.json:", e);
            return [];
        }
    }

    async function loadScriptContent(scriptInfo) {
        const cached = getCache(scriptInfo.cacheKey);
        if (cached) {
            console.log(`[Hide Ads] Sử dụng cache cho ${scriptInfo.url}`);
            return cached;
        }

        console.log(`[Hide Ads] Đang tải script từ ${scriptInfo.url}`);
        try {
            const content = await fetchScriptContent(scriptInfo.url);
            setCache(scriptInfo.cacheKey, content);
            return content;
        } catch (e) {
            console.error(`[Hide Ads] Lỗi tải script ${scriptInfo.url}:`, e);
            return "";
        }
    }

    async function injectByFunction(scriptContent) {
        new Function(scriptContent)();
        console.log("[Hide Ads] Đã tiêm script bằng Function()");
    }

    async function injectByBlob(scriptContent) {
        const blob = new Blob([scriptContent], { type: 'text/javascript' });
        const blobUrl = URL.createObjectURL(blob);
        const scriptEl = document.createElement('script');
        scriptEl.src = blobUrl;
        document.documentElement.appendChild(scriptEl);
        console.log("[Hide Ads] Đã tiêm script bằng blob URL");
    }

    async function injectScriptSmart(scriptContent, patternKey) {
        const injectMethodKey = `inject_method_${patternKey}`;
        const cachedMethod = getCache(injectMethodKey);

        const methods = {
            function: injectByFunction,
            blob: injectByBlob
        };

        const tryInject = async (method) => {
            try {
                await methods[method](scriptContent);
                setCache(injectMethodKey, method);
                return true;
            } catch {
                return false;
            }
        };

        if (cachedMethod && methods[cachedMethod]) {
            const ok = await tryInject(cachedMethod);
            if (ok) return;
        }

        for (const method of ['function', 'blob']) {
            if (method === cachedMethod) continue;
            const ok = await tryInject(method);
            if (ok) return;
        }

        console.error("[Hide Ads] Tất cả phương án inject đều thất bại.");
    }

    const cachedVersion = getCache(CACHE_VERSION_KEY, '0.0.0');
    let siteScripts;

    if (cachedVersion !== SCRIPT_VERSION) {
        console.log(`[Hide Ads] Phiên bản mới (${SCRIPT_VERSION}), làm mới cache...`);
        localStorage.removeItem(SITE_SCRIPTS_CACHE_KEY);
        siteScripts = await loadSiteScripts();
        setCache(CACHE_VERSION_KEY, SCRIPT_VERSION);
    } else {
        siteScripts = await loadSiteScripts();
    }

    const matchedScript = siteScripts.find(site => {
        const regex = new RegExp(site.pattern);
        return regex.test(currentHost);
    });

    if (matchedScript) {
        try {
            const scriptContent = await loadScriptContent(matchedScript);
            await injectScriptSmart(scriptContent, matchedScript.pattern);
            console.log(`[Hide Ads] Đã tiêm script cho ${currentHost}`);
        } catch (e) {
            console.error("[Hide Ads] Lỗi tiêm script:", e);
        }
    } else {
        console.log("[Hide Ads] Không tìm thấy script phù hợp.");
    }
})();
