import path from 'path';
import url from 'url';
import staticCache from 'koa-static-cache';
import compress from '@bbkkbkk/koa-compress';

const statics = path.join(__dirname, '../../statics');

function middleware(app, router, isDev, isHttps) {
  /* 307重定向到https */
  if (isHttps) {
    app.use(async function(ctx, next) {
      const urlResult = new url.URL(ctx.request.href);

      if (urlResult.protocol === 'http:') {
        // 修改协议为https
        urlResult.protocol = 'https:';

        // 修改端口
        if (isDev) {
          urlResult.port = '7071';
        }

        ctx.status = 307;
        ctx.set({
          Location: urlResult.href,
          'Non-Authoritative-Reason': 'HSTS'
        });

        return;
      }

      await next();
    });
  }

  /* 文件压缩 */
  if (!isDev) {
    app.use(compress(undefined, { iltorb: true }));
  }

  /* 缓存 */
  app.use(staticCache(statics, {
    maxAge: isDev ? 0 : ((60 ** 2) * 24 * 365),
    filter: (file) => !/^.*\.html$/.test(file)
  }));

  /* router */
  app.use(router.routes())
    .use(router.allowedMethods());
}

export default middleware;