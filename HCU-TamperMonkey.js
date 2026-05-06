// ==UserScript==
// @name         HistoryCollUser
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  监控编程猫作品中协作者列表的变化，并输出作品文件
// @author       Argon
// @match        *://kitten4.codemao.cn/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    async function fetchJSON(url, options = {}) {
        try {
            const response = await fetch(url, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("获取或解析 JSON 失败:", error);
            return null;
        }
    }

    let previousUserList = [];
    let historyCollUser;
    let monitorTimer = null;
    let currentWorkId = null;

    async function monitor() {
        if (!currentWorkId) {
            console.error("未获取到作品ID");
            return;
        }

        try {
            const collUrl = `https://socketcoll.codemao.cn/coll/kitten/collaborator/${currentWorkId}?current_page=1&page_size=100`;
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
                console.warn(`发现新协作者: ${newUsers.join(", ")}`);
            }

            previousUserList = currentUserList;
            historyCollUser = JSON.stringify(userInfo);

            const workUrl = `https://api-creation.codemao.cn/kitten/work/ide/load/${currentWorkId}`;
            const latestWorkJSON = await fetchJSON(workUrl);

            console.log("当前协作者信息:", userInfo);
            console.log("作品数据:", latestWorkJSON);
            console.debug(historyCollUser);
        } catch (error) {
            console.error("监控过程中出错:", error);
        }
    }

    function startMonitoring() {
        if (monitorTimer) {
            clearInterval(monitorTimer);
            monitorTimer = null;
        }

        previousUserList = [];
        historyCollUser = null;

        const hash = window.location.hash;
        const match = hash.match(/#(\d+)/);
        const workIdNumber = match ? match[1] : null;

        if (!workIdNumber) {
            console.warn("未从 hash 中找到作品ID");
            currentWorkId = null;
            return;
        }

        currentWorkId = workIdNumber;
        console.log(`已获取作品ID: ${currentWorkId}`);
        console.log("开始监控");

        monitor();
        monitorTimer = setInterval(monitor, 5000);
    }

    window.addEventListener("hashchange", () => {
        console.log("检测到 hash 变化，重新初始化监控...");
        startMonitoring();
    });

    startMonitoring();
})();
