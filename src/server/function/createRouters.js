import path from 'path';
import indexRouter from '../routers';
import apiLivelistRouter from '../routers/apiLivelist';
import liveRouter from '../routers/live';

const templateDir = path.join(__dirname, '../../template');

function createRouters(router) {
  indexRouter(router, templateDir);
  apiLivelistRouter(router);
  liveRouter(router, templateDir);
}

export default createRouters;