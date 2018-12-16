const { url, getTask } = require('../../config');
const formatTodo = require('../../utils/format_todo');
const app = getApp();
const { authorization } = app.globalData;

const getTasksList = (sort, limit, offset) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + getTask,
      data: {
        sort,
        limit,
        offset
      },
      header: {
        authorization
      },
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      }
    });
  });
}

Page({
  data: {
    finishedNum: 0,
    expiredNum: 0,
    historyNum: 0
  },
  onLoad() {
    const that = this;
    ['finished', 'expired', 'all'].forEach(sort => {
      getTasksList(sort, 50, 0).then((res) => {
        let d = {};
        const count = res.count;
        console.log(res);
        switch(sort) {
          case 'finished':
            d = { finishedNum: count };
            break;
          case 'expired':
            d = { expiredNum: count };
            break;
          case 'all':
            d = { historyNum: count };
            break;
        }
        that.setData(d);
      }).catch(err => {
        console.log(err);
      });
    });
  }
})