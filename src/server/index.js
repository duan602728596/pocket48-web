import './alias';
import http from 'http';
import http2 from 'http2';
import process from 'process';
import fs from 'fs';
import path from 'path';
import Koa from 'koa';
import Router from '@koa/router';
import createProxy from './function/createProxy';
import middleware from './function/middleware';
import createRouters from './function/createRouters';
import mediaServer from './mediaServer';

const app = new Koa();
const router = new Router();
const { env } = process;
const isDev = env.NODE_ENV === 'development';
const isHttps = env.KEY && env.CERT;

async function main() {
  /* 添加代理 */
  createProxy(app, isDev);

  /* 添加中间件 */
  middleware(app, router, isDev, isHttps);

  /* 添加路由 */
  createRouters(router);

  /* 创建http服务 */
  http.createServer(app.callback())
    .listen(isDev ? 7070 : 80);

  /* https */
  if (isHttps) {
    const keyFile = await fs.promises.readFile(path.join(__dirname, '../..', env.KEY)),
      certFile = await fs.promises.readFile(path.join(__dirname, '../..', env.CERT));

    const httpsConfig = {
      allowHTTP1: true,
      key: keyFile,
      cert: certFile
    };

    http2.createSecureServer(httpsConfig, app.callback())
      .listen(isDev ? 7071 : 443);
  }

  /* 视频流服务 */
  mediaServer(isDev, isHttps);
}

main();