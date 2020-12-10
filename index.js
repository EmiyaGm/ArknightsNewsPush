const RSSHub = require('rsshub')
const { CQWebSocket } = require('cq-websocket');

RSSHub.init({
  // config
})

const bot = new CQWebSocket({
  "host": "127.0.0.1",
  "port": 6701,
  "enableAPI": true,
  "enableEvent": true,
  "accessToken": "",
  "reconnection": true,
  "reconnectionAttempts": 10,
  "reconnectionDelay": 5000
});

const globalReg = obj => Object.assign(global, obj);

// 全局变量
globalReg({
  bot,
  replyMsg,
  sendMsg2Admin,
  getTime: () => new Date().toLocaleString(),
});

function run() {
  setInterval(() => {
    RSSHub.request('http://127.0.0.1:1200/bilibili/user/dynamic/161775300')
      .then((data) => {
        if (data.item && data.item.length > 0) {
          const pubDate = new Date(data.item[0].pubDate).getTime();
          if (new Date().getTime() > pubDate) {
            bot('send_private_msg', {
              user_id: 464723943,
              message: data.item[0].title,
            });
          }
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }, 6000)
}

// 连接相关监听
bot
  .on('socket.connecting', (wsType, attempts) => console.log(`${global.getTime()} 连接中[${wsType}]#${attempts}`))
  .on('socket.failed', (wsType, attempts) => console.log(`${global.getTime()} 连接失败[${wsType}]#${attempts}`))
  .on('socket.error', (wsType, err) => {
    console.error(`${global.getTime()} 连接错误[${wsType}]`);
    console.error(err);
  })
  .on('socket.connect', (wsType, sock, attempts) => {
    console.log(`${global.getTime()} 连接成功[${wsType}]#${attempts}`);
    if (wsType === '/api') {
      setTimeout(() => {
        sendMsg2Admin(`已上线#${attempts}`);
        run();
      }, 1000);
    }
  });

// connect
bot.connect();

/**
 * 发送消息给管理员
 *
 * @param {string} message 消息
 */
function sendMsg2Admin(message) {
  if (bot.isReady()) {
    bot('send_private_msg', {
      user_id: 464723943,
      message,
    });
  }
}

/**
 * 回复消息
 *
 * @param {object} context 消息对象
 * @param {string} message 回复内容
 * @param {boolean} at 是否at发送者
 */
function replyMsg(context, message, at = false, reply = false) {
  if (!bot.isReady() || typeof message !== 'string' || message.length === 0) return;
  if (context.message_type !== 'private') {
    message = `${reply ? CQ.reply(context.message_id) : ''}${at ? CQ.at(context.user_id) : ''}${message}`;
  }
  const logMsg =
    global.config.bot.debug && _.truncate(message, { length: 2048, omission: '（字数过多，后续内容不予显示）' });
  switch (context.message_type) {
    case 'private':
      if (global.config.bot.debug) {
        console.log(`${global.getTime()} 回复私聊消息 qq=${context.user_id}`);
        console.log(logMsg);
      }
      return bot('send_private_msg', {
        user_id: context.user_id,
        message,
      });
    case 'group':
      if (global.config.bot.debug) {
        console.log(`${global.getTime()} 回复群组消息 group=${context.group_id} qq=${context.user_id}`);
        console.log(logMsg);
      }
      return bot('send_group_msg', {
        group_id: context.group_id,
        message,
      });
    case 'discuss':
      if (global.config.bot.debug) {
        console.log(`${global.getTime()} 回复讨论组消息 discuss=${context.discuss_id} qq=${context.user_id}`);
        console.log(logMsg);
      }
      return bot('send_discuss_msg', {
        discuss_id: context.discuss_id,
        message,
      });
  }
}
