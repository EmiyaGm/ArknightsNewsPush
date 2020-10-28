const RSSHub = require('rsshub')

RSSHub.init({
  // config
})

function run() {
  setInterval(() => {
    RSSHub.request('/bilibili/user/dynamic/161775300')
      .then((data) => {
        console.log(data)
      })
      .catch((e) => {
        console.log(e)
      })
  }, 6000)
}

run()
