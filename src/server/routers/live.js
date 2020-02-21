import path from 'path';
import childProcess from 'child_process';
import { renderFilePromise, requestLiveInfo } from '../utils';

const childMap = {}; // 记录推流的id

/**
 * content内需要的字段
 *   liveId：直播id
 *   playStreamPath：直播地址
 *   liveType：直播类型
 *   user：
 *     userName：人名
 */
function liveRouter(router, templateDir) {
  const tmp = path.join(templateDir, 'live.html');

  router.get('/live/:liveId', async function(ctx, next) {
    try {
      // 请求信息
      const { liveId } = ctx.params;
      const { title, coverPath } = ctx.query;
      const res = await requestLiveInfo({ liveId });
      const { content } = res;
      const id = String(liveId);

      if (res.status === 1012) {
        // html
        ctx.body = await renderFilePromise(tmp, {
          replay: true,
          infoStr: JSON.stringify({ replay: true }),
          info: { title: '回放生成中' }
        }, { async: true });

        return;
      }

      // 推流
      if (!childMap.id) {
        const processArgs = [
          '-re',
          '-i',
          content.playStreamPath,
          '-c:v',
          'libx264',
          '-preset',
          'superfast',
          '-tune',
          'zerolatency',
          '-c:a',
          'aac',
          '-ar',
          '44100',
          '-f',
          'flv',
          `rtmp://127.0.0.1:5367/live/${ liveId }`
        ];
        const child = childProcess.spawn('ffmpeg', processArgs);

        child.stdout.on('data', (data) => undefined);
        child.stderr.on('data', (data) => undefined);

        const handleCLoseOrError = function(...args) {
          clearTimeout(childMap[id]?.timer);
          childMap[id] = undefined;
        };

        child.on('close', handleCLoseOrError);
        child.on('error', handleCLoseOrError);

        childMap[id] = {
          child,
          timer: setTimeout(() => {
            child?.kill?.();
          }, 120000)
        };
      }

      // html
      const info = {
        liveId: content.liveId,
        playStreamPath: decodeURIComponent(content.playStreamPath),
        liveType: content.liveType,
        title,
        coverPath,
        userName: content.user.userName
      };
      const html = await renderFilePromise(tmp, {
        infoStr: JSON.stringify(info),
        info,
        replay: false
      }, { async: true });

      ctx.body = html;
    } catch (err) {
      ctx.body = err;
      ctx.status = 500;
    }
  });

  // 心跳检测
  router.get('/api/live/1/:liveId', function(ctx, next) {
    const { liveId } = ctx.params;
    const id = String(liveId);

    if (childMap[id]) {
      clearTimeout(childMap[id]?.timer);

      if (childMap[id]) {
        childMap[id].timer = setTimeout(() => {
          child?.kill?.();
        }, 120000);
      }

      ctx.body = { code: 0 };
    } else {
      ctx.body = { code: 1 };
    }
  });
}

export default liveRouter;