// ==UserScript==
// @name         Multi-Site Local Script Injector (Optimized)
// @namespace    your_namespace
// @version      1.1
// @description  Tải & lưu script bên ngoài để tiêm vào các trang web khác nhau (hỗ trợ script chung)
// @author       Bạn
// @match        *://*/*
// @run-at       document-start
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// ==/UserScript==

(async function () {
    'use strict';

    // Cấu hình danh sách trang web và script tương ứng
    const siteScripts = {
        "vnexpress.net": {
            url: "https://raw.githubusercontent.com/luxysiv/Adblock-Extension/main/scripts/vnexpress.js",
            cacheKey: "script_vnexpress"
        },
        "bongdaplus.vn": {
            url: "https://raw.githubusercontent.com/luxysiv/Adblock-Extension/main/scripts/bongdaplus.js",
            cacheKey: "script_bongdaplus"
        },
        "phimmoichill": {
            url: "https://raw.githubusercontent.com/luxysiv/Adblock-Extension/main/scripts/phimmoichill.js",
            cacheKey: "script_phimmoichill" // Dùng chung script với vnexpress
        },
        "example.com": {
            url: "https://raw.githubusercontent.com/luxysiv/Adblock-Extension/main/scripts/example.js",
            cacheKey: "script_example"
        }
    };

    // Lấy hostname hiện tại (không gồm subdomain)
    const currentHost = window.location.hostname.replace(/^www\./, ""); // Loại bỏ "www."

    // Kiểm tra trang hiện tại có trong danh sách không
    if (!(currentHost in siteScripts)) return;

    console.log(`[Multi-Site Injector] Trang hợp lệ: ${currentHost}`);

    // Lấy thông tin script của trang hiện tại
    const scriptInfo = siteScripts[currentHost];

    // Hàm tải script & lưu vào cache
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
        const scriptContent = await loadScriptContent(scriptInfo);
        const scriptElem = document.createElement("script");
        scriptElem.textContent = scriptContent;
        document.documentElement.appendChild(scriptElem);
        console.log(`[Multi-Site Injector] Đã tiêm script cho ${currentHost}`);
    } catch (error) {
        console.error("[Multi-Site Injector] Lỗi khi tiêm script:", error);
    }

    // Menu command để xóa cache & tải lại script
    GM.registerMenuCommand("Clear Script Cache", async () => {
        for (const site in siteScripts) {
            await GM.setValue(siteScripts[site].cacheKey, null);
        }
        alert("Đã xóa cache của các script.");
    });

})();
