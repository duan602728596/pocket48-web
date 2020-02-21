# pocket48-web

口袋48网页版的源代码。视频推流依赖**ffmpeg**。

## 开发环境

* 运行`npm run build:dev`，编译源代码。
* 运行`npm run start:dev`，启动服务。

## 生产环境

* 运行`npm run build:pro`，编译源代码。
* 运行`npm run start:pro`，启动服务。
* 运行`npm run start:https`，启动https服务。

### 使用pm2运行服务

* 运行`pm2 start pm2.config.js`，启动https服务。