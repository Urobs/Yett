//app.js
const url = require('./config').url;
App({
  onLaunch: function () {
    
  },
  globalData: {
    authorization: null,
    tasks: {}
  }
})