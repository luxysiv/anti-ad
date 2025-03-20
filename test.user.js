// ==UserScript==
// @name         Multi-Site Local Script Injector
// @namespace    your_namespace
// @version      1.0
// @description  Tải và lưu script bên ngoài để tiêm vào các trang web khác nhau, mỗi trang sử dụng script riêng biệt.
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

    // Cấu hình cho các trang: key là chuỗi nhận dạng (phần trong URL), value chứa URL script bên ngoài và cacheKey tương ứng
    const siteScripts = {
        "vnexpress.net": {
            url: "https://raw.githubusercontent.com/luxysiv/Adblock-Extension/refs/heads/main/scripts/vnexpress.js", // Thay bằng URL script của site1
            cacheKey: "script_site1"
        },
        "bongdaplus.vn": {
            url: "https://raw.githubusercontent.com/luxysiv/Adblock-Extension/refs/heads/main/scripts/bongdaplus.js", // Thay bằng URL script của site2
            cacheKey: "script_site2"
        },
        "phimmoichill": {
            url: "https://raw.githubusercontent.com/luxysiv/Adblock-Extension/refs/heads/main/scripts/vnexpress.js", // Thay bằng URL script của site3
            cacheKey: "script_site3"
        }
    };

    // Xác định trang hiện tại dựa trên window.location.href
    let currentSite = null;
    for (const site in siteScripts) {
        if (window.location.href.includes(site)) {
            currentSite = site;
            break;
        }
    }
    if (!currentSite) return; // Nếu trang không nằm trong danh sách, dừng chạy.

    console.log(`[Multi-Site Injector] Đang xử lý trang: ${currentSite}`);

    // Hàm tải script bên ngoài với hỗ trợ cache (lưu local)
    async function loadScriptContent(scriptInfo) {
        // Kiểm tra cache
        let cached = await GM.getValue(scriptInfo.cacheKey, null);
        if (cached) {
            console.log(`[Multi-Site Injector] Sử dụng cache cho ${currentSite}`);
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
                            reject(new Error("Không tải được script: " + scriptInfo.url));
                        }
                    },
                    onerror: function () {
                        reject(new Error("Lỗi khi tải script: " + scriptInfo.url));
                    }
                });
            });
        }
    }

    // Tải nội dung script cho trang hiện tại
    try {
        const scriptContent = await loadScriptContent(siteScripts[currentSite]);
        // Tạo thẻ script để tiêm nội dung script vào trang
        const scriptElem = document.createElement("script");
        scriptElem.textContent = scriptContent;
        document.documentElement.appendChild(scriptElem);
        console.log(`[Multi-Site Injector] Đã tiêm script cho ${currentSite}`);
    } catch (error) {
        console.error("[Multi-Site Injector] Lỗi khi tiêm script:", error);
    }

    // Menu command cho phép xóa cache (cập nhật script mới nếu cần)
    GM.registerMenuCommand("Clear Script Cache", async () => {
        for (const site in siteScripts) {
            await GM.setValue(siteScripts[site].cacheKey, null);
        }
        alert("Đã xóa cache của các script.");
    });
})();
