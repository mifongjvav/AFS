"use strict";

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

const workId = window.location.hash;
const match = workId.match(/#(\d+)/);
const number = match ? match[1] : null;
console.log(`已获取作品ID: ${number}`);
console.log("开始监控");

let previousUserList = [];
let historyCollUser;

async function monitor() {
  if (!number) {
    console.error("未获取到作品ID");
    return;
  }

  try {
    const collUrl = `https://socketcoll.codemao.cn/coll/kitten/collaborator/${number}?current_page=1&page_size=100`;
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
    const newUsers = currentUserList.filter(
      (user) => !previousUserList.includes(user),
    );
    if (newUsers.length > 0) {
      console.warn(`发现新协作者: ${newUsers.join(", ")}`);
    }
    previousUserList = currentUserList;
    historyCollUser = JSON.stringify(userInfo);
    const workUrl = `https://api-creation.codemao.cn/kitten/work/ide/load/${number}`;
    const latestWorkJSON = await fetchJSON(workUrl);
    console.log("当前协作者信息:", userInfo);
    console.log("作品数据:", latestWorkJSON);
    console.debug(historyCollUser);
  } catch (error) {
    console.error("监控过程中出错:", error);
  }
}
setInterval(monitor, 5000);
monitor();
