// ==UserScript==
// @name         HistoryCollUser
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  监控编程猫作品中协作者列表的变化，并输出作品数据（增强版：支持页面hash变化自动重载）
// @author       Argon
// @match        *://kitten4.codemao.cn/*
// @grant        GM.xmlHttpRequest
// @connect      socketcoll.codemao.cn
// @connect      api-creation.codemao.cn
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    function fetchJSON(url, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: url,
                headers: options.headers || {},
                withCredentials: true,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch(e) {
                            reject(new Error('JSON 解析失败: ' + e.message));
                        }
                    } else {
                        reject(new Error(`HTTP error! status: ${response.status}`));
                    }
                },
                onerror: function(err) {
                    reject(new Error('网络请求失败: ' + JSON.stringify(err)));
                },
                timeout: options.timeout || 10000,
            });
        });
    }
    let previousUserList = [];
    let historyCollUser;
    let monitorInterval = null;
    let currentNumber = null;
    async function monitor() {
        if (!currentNumber) {
            console.error('[HCU] 未获取到作品ID，停止监控');
            return;
        }

        try {
            const collUrl = `https://socketcoll.codemao.cn/coll/kitten/collaborator/${currentNumber}?current_page=1&page_size=100`;
            const nowCollList = await fetchJSON(collUrl);
            const collUserList = nowCollList?.data?.items || [];
            const currentUserList = [];
            const userInfo = {};

            for (let i = 0; i < collUserList.length; i++) {
                const user = collUserList[i];
                if (user?.nickname) {
                    userInfo[user.nickname] = user.coll_user_id;
                    currentUserList.push(user.nickname);
                }
            }
            const newUsers = currentUserList.filter(user => !previousUserList.includes(user));
            if (newUsers.length > 0) {
                console.warn(`[HCU] 发现新协作者: ${newUsers.join(', ')}`);
            }
            previousUserList = currentUserList;
            historyCollUser = JSON.stringify(userInfo);
            const workUrl = `https://api-creation.codemao.cn/kitten/work/ide/load/${currentNumber}`;
            const latestWorkJSON = await fetchJSON(workUrl);
            console.log('[HCU] 当前协作者信息:', userInfo);
            console.log('[HCU] 作品数据:', latestWorkJSON);
            console.debug('[HCU] 协作者映射 JSON:', historyCollUser);
        } catch (error) {
            console.error('[HCU] 监控过程中出错:', error);
        }
    }
    function startMonitoring() {
        if (monitorInterval) {
            clearInterval(monitorInterval);
            monitorInterval = null;
        }
        previousUserList = [];
        historyCollUser = null;
        const hash = window.location.hash;
        const match = hash.match(/#(\d+)/);
        const number = match ? match[1] : null;

        if (!number) {
            console.error('[HCU] 当前页面 hash 中未找到作品ID，停止监控');
            currentNumber = null;
            return;
        }

        currentNumber = number;
        console.log(`[HCU] 已获取作品ID: ${currentNumber}`);
        console.log('[HCU] 开始监控 (每5秒检测一次)');
        monitor();
        monitorInterval = setInterval(monitor, 5000);
    }

    window.addEventListener('hashchange', function() {
        console.log('[HCU] 检测到 hash 变化，重新初始化监控...');
        startMonitoring();
    });

    startMonitoring();
})();
