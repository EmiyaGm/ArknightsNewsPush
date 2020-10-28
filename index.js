const RSSHub = require('rsshub')

RSSHub.init({
  // config
})

function run() {
  setInterval(() => {
    RSSHub.request('/weibo/user/6279793937')
      .then((data) => {
        if (data && data.item) {
          console.log(data.item[0])
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }, 60000)
}

run()
