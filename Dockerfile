# 编译代码
FROM node:12.16.0 AS BUILD
COPY ./ /build
WORKDIR /build
RUN npm install \
  && npm run build:pro \
  && cd / \
  && mkdir -p /copy \
  && cp -r /build/package.json /copy \
  && cp -r /build/dist /copy \
  && cp -r /build/server.key /copy \
  && cp -r /build/server.crt /copy

# 安装依赖
FROM node:12.16.0
WORKDIR /app
COPY --from=BUILD /copy /app
RUN npm install --production
EXPOSE 7075 7076 13345 13346 13347

# 运行
CMD ["npm", "run", "start:https"]