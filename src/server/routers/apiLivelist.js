import { requestLiveList } from '../utils';

function formatData(liveList = []) {
  return liveList.map((item, index) => {
    return {
      liveId: item.liveId,
      coverPath: item.coverPath,
      title: item.title,
      liveType: item.liveType,
      nickname: item.userInfo.nickname
    };
  });
}

function apiLivelistRouter(router) {
  router.get('/api/livelist', async function(ctx, next) {
    try {
      const res = await requestLiveList({
        debug: true,
        next: 0,
        groupId: 0,
        record: false
      });

      if (res.status === 200) {
        const { liveList = [] } = res?.content ?? {};

        ctx.body = { code: 0, data: formatData(liveList) };
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      ctx.body = { code: 1, err };
      ctx.status = 500;
    }
  });
}

export default apiLivelistRouter;