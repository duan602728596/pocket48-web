import path from 'path';
import { renderFilePromise, requestLiveList, formatLiveList } from '../utils';

/**
 * content内需要的字段
 *   liveId：直播id
 *   coverPath：封面图
 *   title：标题
 *   liveType：直播类型
 *   userInfo：
 *     nickname：人名
 */
function indexRouter(router, templateDir) {
  const tmp = path.join(templateDir, 'index.html');

  router.get('/(index)?', async function(ctx, next) {
    try {
      const res = await requestLiveList({
        debug: true,
        next: 0,
        groupId: 0,
        record: false
      });

      if (res.status === 200) {
        const { liveList = [] } = res?.content ?? {};
        const fLiveList2 = formatLiveList(liveList);
        const html = await renderFilePromise(tmp, { liveList: fLiveList2 }, { async: true });

        ctx.body = html;
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      ctx.body = err;
      ctx.status = 500;
    }
  });
}

export default indexRouter;