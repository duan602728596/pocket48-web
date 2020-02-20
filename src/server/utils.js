import util from 'util';
import fetch from 'node-fetch';
import ejs from 'ejs';

/* ejs渲染函数 */
export const renderFilePromise = util.promisify(ejs.renderFile);

/* 随机字符串 */
function rStr(len) {
  const str = 'QWERTYUIOPASDFGHJKLZXCVBNM1234567890';
  let result = '';

  for (let i = 0; i < len; i++) {
    const rIndex = Math.floor(Math.random() * str.length);

    result += str[rIndex];
  }

  return result;
}

/* headers */
function createHeaders() {
  return {
    'Content-Type': 'application/json;charset=utf-8',
    appInfo: JSON.stringify({
      vendor: 'apple',
      deviceId: `${ rStr(8) }-${ rStr(4) }-${ rStr(4) }-${ rStr(4) }-${ rStr(12) }`,
      appVersion: '6.0.1',
      appBuild: '190420',
      osVersion: '11.4.1',
      osType: 'ios',
      deviceName: 'iPhone 6s',
      os: 'ios'
    }),
    'User-Agent': 'PocketFans201807/6.0.1 (iPhone; iOS 11.4.1; Scale/2.00)',
    'Accept-Language': 'zh-Hans-AW;q=1',
    Host: 'pocketapi.48.cn'
  };
}

/* 请求数据 */
export async function requestLiveList(body) {
  const res = await fetch('https://pocketapi.48.cn/live/api/v1/live/getLiveList', {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify(body),
    timeout: 120000
  });
  const json = await res.json();

  return json;
}

/* 请求单个直播间的数据 */
export async function requestLiveInfo(body) {
  const res = await fetch('https://pocketapi.48.cn/live/api/v1/live/getLiveOne', {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify(body),
    timeout: 120000
  });
  const json = await res.json();

  return json;
}