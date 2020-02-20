(() => {
  const resetBtn = document.getElementById('reset-btn'), // 刷新按钮
    layout = document.getElementById('layout'),          // 结果展示
    loading = document.getElementById('loading');        // 加载

  /* css样式 */
  const [noLive, liveList, liveListDl, liveListDt, liveListDd, zhibo, diantai, link, name]
    = window.__INITIAL_STATE__.className;
  const style = { noLive, liveList, liveListDl, liveListDt, liveListDd, zhibo, diantai, link, name };

  /* 请求接口 */
  function request() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', '/api/livelist');
      xhr.addEventListener('readystatechange', function(event) {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        }
      }, false);
      xhr.send('');
    });
  }

  /* 刷新 */
  async function handleLoadingDataClick(event) {
    loading.style.visibility = 'visible';

    try {
      const data = await request();

      if (data.data.length === 0) {
        // 无数据
        layout.innerHTML = `<div class="${ style.noLive }">暂无直播</div>`;
      } else {
        let html = `<div class="${ style.liveList }">`;

        for (const item of data.data) {
          const isZhibo = item.liveType === 1,
            query = `title=${ item.title }&coverPath=${ encodeURIComponent(item.coverPath) }`;

          html += `<dl class="${ style.liveListDl }">
            <dt class="${ style.liveListDt }">
              <a href="/live/${ item.liveId }?${ query }" target="_blank">
                <img src="/proxy/source3${ item.coverPath }" alt="${ item.nickname }">
              </a>
            </dt>
            <dd class="${ style.liveListDd }">
              <a href="/live/${ item.liveId }?${ query }" target="_blank">${ item.title }</a>
              <div class="${ style.link }">
                <em class="${ isZhibo ? style.zhibo : style.diantai }">${ isZhibo ? '直播' : '电台' }</em>
                <b class="${ style.name }">${ item.nickname }</b>
              </div>
            </dd>
          </dl>`;
        }

        html += '</div>';

        layout.innerHTML = html.replace(/\n\s*/g, '');
      }
    } catch (err) {
      console.error(err);
    }

    loading.style.visibility = 'hidden';
  }

  resetBtn.addEventListener('click', handleLoadingDataClick, false);
})();