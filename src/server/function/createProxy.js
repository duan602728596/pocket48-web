import connect from 'koa-connect';
import { createProxyMiddleware } from 'http-proxy-middleware';

function createProxy(app, isDev) {
  const logLevel = isDev ? 'info' : 'error';

  createProxyMiddleware('/proxy/source3', {
    target: 'https://source3.48.cn/',
    pathRewrite: {
      '^/proxy/source3': ''
    },
    changeOrigin: true,
    logLevel
  }) |> connect |> app.use;
}

export default createProxy;