// ==UserScript==
// @name         Hide ads (Kiwi-compatible)
// @namespace    luxysiv
// @version      1.4.0
// @description  Inject cosmetic script into websites (Kiwi-compatible)
// @author       Mạnh Dương
// @match        *://*/*
// @run-at       document-start
// @icon         https://github.com/luxysiv/anti-ads/raw/refs/heads/main/icon.png
// ==/UserScript==

(async function () {
    'use strict';

    const SITE_SCRIPTS_URL = "https://luxysiv.github.io/anti-ads/site-scripts.json";
    const SITE_SCRIPTS_CACHE_KEY = "cached_site_scripts";
    const CACHE_VERSION_KEY = "cache_version";
    const SCRIPT_VERSION = "1.4.0";

    function getCache(key, defaultValue = null) {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : defaultValue;
    }

    function setCache(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    async function fetchJSON(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return await res.json();
    }

    async function fetchText(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return await res.text();
    }

    async function loadSiteScripts() {
        const cachedScripts = getCache(SITE_SCRIPTS_CACHE_KEY);
        if (cachedScripts) {
            console.log("[Multi-Site Injector] Using cached site-scripts.json");
            return cachedScripts;
        }

        try {
            console.log("[Multi-Site Injector] Fetching site-scripts.json from server...");
            const data = await fetchJSON(SITE_SCRIPTS_URL);
            setCache(SITE_SCRIPTS_CACHE_KEY, data);
            return data;
        } catch (e) {
            console.error("[Multi-Site Injector] Failed to fetch site-scripts.json:", e);
            return [];
        }
    }

    async function loadScriptContent(scriptInfo) {
        const cached = getCache(scriptInfo.cacheKey);
        if (cached) {
            console.log(`[Multi-Site Injector] Using cached script: ${scriptInfo.url}`);
            return cached;
        }

        try {
            console.log(`[Multi-Site Injector] Fetching script from ${scriptInfo.url}`);
            const content = await fetchText(scriptInfo.url);
            setCache(scriptInfo.cacheKey, content);
            return content;
        } catch (e) {
            console.error(`[Multi-Site Injector] Failed to fetch script: ${scriptInfo.url}`, e);
            return "";
        }
    }

    const currentHost = window.location.hostname.replace(/^www\./, "");
    const cachedVersion = getCache(CACHE_VERSION_KEY, '0.0.0');
    let siteScripts;

    if (cachedVersion !== SCRIPT_VERSION) {
        console.log(`[Multi-Site Injector] New version detected (${SCRIPT_VERSION}), refreshing cache...`);
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
            const scriptEl = document.createElement('script');
            scriptEl.textContent = scriptContent;
            document.documentElement.appendChild(scriptEl);
            console.log(`[Multi-Site Injector] Injected script for ${currentHost}`);
        } catch (e) {
            console.error("[Multi-Site Injector] Script injection failed:", e);
        }
    } else {
        console.log("[Multi-Site Injector] No matching script found.");
    }

    // OPTIONAL: Add keyboard shortcut to clear cache (press 'Shift + Alt + C')
    window.addEventListener("keydown", (e) => {
        if (e.shiftKey && e.altKey && e.code === "KeyC") {
            localStorage.removeItem(SITE_SCRIPTS_CACHE_KEY);
            localStorage.removeItem(CACHE_VERSION_KEY);
            siteScripts.forEach(site => localStorage.removeItem(site.cacheKey));
            alert("Đã xóa toàn bộ cache!");
        }
    });
})();
