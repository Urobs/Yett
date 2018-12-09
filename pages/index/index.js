//index.js
//获取应用实例
const handleTabChange = require('../../utils/change_tab_page');
const app = getApp();

Page({
  data: {
    touchBtn: false,
    currentPage: 'index',
    idLoading: true,
    toDoIdNow: 0,
    toggle: false,
    toDos: [
      {
        todo: 'fasfasfa0',
        expires: 3000,
        unique: 'u0'
      }, {
        todo: 'fafafsafqwweqwrqrw1',
        expires: 3000,
        unique: 'u1'
      }, {
        todo: 'fafafsafqwweqwrqrw2',
        expires: 3000,
        unique: 'u3'
      }, {
        todo: 'fafafsafqwweqwrqrw3',
        expires: 3000,
        unique: 'u4'
      }, {
        todo: 'fafafsafqwweqwrqrw4',
        expires: 3000,
        unique: 'u5'
      }, {
        todo: 'fafafsafqwweqwrqrw5',
        expires: 3000,
        unique: 'u6'
      }, {
        todo: 'fafafsafqwweqwrqrw6',
        expires: 3000,
        unique: 'u7'
      }, {
        todo: 'fafafsafqwweqwrqrw7',
        expires: 3000,
        unique: 'u8'
      }, {
        todo: 'fafafsafqwweqwrqrw8',
        expires: 3000,
        unique: 'u9'
      }
    ],
    targetTime: 0,
    formatTime: ['时', '分', '秒'],
    clearTimer: false,
    finish: false,
    actionFinish: [
      {
        name: '我已经完成喽！',
        color: '#19be6b',
        fontsize : '14px',
        width: 100
      }
    ],
    delete: false,
    actionDelete: [
      {
        name: '我还是选择放弃',
        color: '#ed3f14',
        width: 100,
        fontsize : '14px'
      }
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.setData({
      isLoading: false
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.setData({
      targetTime: new Date().getTime() + 1000 * 60 * 120
    })
  },
  changeToDoId: function(e) {
    this.setData({
      toDoIdNow: e.currentTarget.dataset.id
    })
  },
  finishToDo: function() {
    this.setData({
      finish: true
    })
  },
  deleteToDo: function() {
    this.setData({
      delete: true
    })
  },
  handleFinishCancel: function() {
    this.setData({
      finish: false,
      toggle: this.data.toggle ? false : true
    })
  },
  handleDeleteCancel: function() {
    this.setData({
      delete: false,
      toggle: this.data.toggle ? false : true
    })
  },
  handleFinish: function() {
    
  },
  handleDelete: function() {
    const id = this.data.toDoIdNow;
    const toDos = this.data.toDos;
    const action = [...this.data.actionDelete];
    action[0].loading = true;
    this.setData({
      actionDelete: action
    })
    toDos.splice(id, 1);
    // 模拟promise异步
    setTimeout(() => {
      action[0].loading = false;
      this.setData({
          delete: false,
          toDos: toDos,
          actionDelete: action,
          toggle: this.data.toggle ? false : true
      });
    }, 2000);
  },
  handleTabChange,
  btnActive: function() {
    this.setData({
      touchBtn: true
    })
  },
  btnStop: function() {
    this.setData({
      touchBtn: false
    })
  },
  addTodo: function() {
    wx.navigateTo({
      url: '../add/add'
    })
  }
})
