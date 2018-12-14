const formatTodo = require('../../utils/format_todo');
const app = getApp();

Page({
  data: {
    offset: 0,
    limit: 10,
    touchBtn: false,
    idLoading: true,
    toDoIdNow: 0,
    toggle: false,
    toDos: null,
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
  onLoad: function () {
    const { authorization } = app.globalData;
    const { offset, limit } = this.data;
    let toDos = null;
    wx.request({
      url: 'http://localhost:3000/api/tasks',
      header: {
        authorization
      },
      data: {
        sort: 'all',
        limit,
        offset
      },
      success(res) {
        if (res.statusCode === 200) {
          toDos = formatTodo(res.data.rows);
        }
      }
    });
    this.setData({
      isLoading: false,
      toDos
    });
  },
  changeToDoId: function(e) {
    this.setData({
      toDoIdNow: e.currentTarget.dataset.id
    });
  },
  finishToDo: function() {
    this.setData({
      finish: true
    });
  },
  deleteToDo: function() {
    this.setData({
      delete: true
    });
  },
  handleFinishCancel: function() {
    this.setData({
      finish: false,
      toggle: this.data.toggle ? false : true
    });
  },
  handleDeleteCancel: function() {
    this.setData({
      delete: false,
      toggle: this.data.toggle ? false : true
    });
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
    });
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
  btnActive: function() {
    this.setData({
      touchBtn: true
    });
  },
  btnStop: function() {
    this.setData({
      touchBtn: false
    });
  },
  addTodo: function() {
    wx.navigateTo({
      url: '../add/add'
    });
  }
})
