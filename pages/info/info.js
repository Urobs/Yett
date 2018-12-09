const handleTabChange = require('../../utils/change_tab_page');
const app = getApp();

Page({
  data: {
    currentPage: 'info',
    userInfo: {},
    finishNum: 0,
    expireNum: 0,
    historyNum: 0
  },
  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  handleTabChange
})