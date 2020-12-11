# ArknightsNewsPush

## 简介

个人用的 rss 消息推送

因为懒得抽象配置，所以使用需要一定的 node.js 基础

发送消息使用的是 [go-cqhttp](https://github.com/Mrs4s/go-cqhttp)

rss 服务使用的是 [rsshub](https://github.com/DIYgod/RSSHub)

感谢 [node-cq-websocket](https://github.com/momocow/node-cq-websocket) 提供的 ws SDK支持

## 使用

```
git clone https://github.com/EmiyaGm/ArknightsNewsPush.git

cd ArknightsNewsPush

npm install

screen -s arkpush

vim index.js

// 修改内部相关配置....

// 修改完成后

node index.js

```

启动后，再按 ctrl + a + d 退出 screen 即可