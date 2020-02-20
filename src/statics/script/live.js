(() => {
  const { __INITIAL_STATE__: initialState } = window;
  const { info } = initialState;
  let timer = null;

  /* 请求接口 */
  function request(id) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', `/api/live/1/${ id }`);
      xhr.addEventListener('readystatechange', function(event) {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        }
      }, false);
      xhr.send('');
    });
  }

  if (flvjs.isSupported() && !info.replay) {
    const { hostname, protocol } = window.location;
    const isDev = hostname === '127.0.0.1' || hostname === 'localhost';
    const video = document.getElementById('video');
    const host = isDev
      ? 'http://127.0.0.1:13346'
      : (protocol === 'http:' ? 'https://www.wbwbwb.top:13347' : 'http://www.wbwbwb.top:13346');
    const flvPlayer = flvjs.createPlayer({
      type: 'flv',
      url: `${ host }/live/${ info.liveId }.flv`
    });

    flvPlayer.attachMediaElement(video);
    flvPlayer.load();

    /* 心跳检测 */
    const check = async function() {
      await request(info.liveId);

      timer = setTimeout(check, 90000);
    };

    timer = setTimeout(check, 90000);
  }
})();