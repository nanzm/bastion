FROM node:14-alpine as builder
WORKDIR /server
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM node:14-alpine as runner
LABEL maintainer="nan <msg@nancode.cn>"
WORKDIR /server

RUN apk add tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone

COPY --from=builder /server/dist/apps  /server
COPY --from=builder /server/static  /server/static
COPY --from=builder /server/package.json  /server
COPY --from=builder /server/package-lock.json  /server
COPY --from=builder /server/node_modules  /server/node_modules

# nodejs 性能上报模块 （需手动开启）
COPY --from=builder /server/xtransitConfig.js  /server
RUN npm install xtransit -g
