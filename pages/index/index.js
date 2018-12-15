const formatTodo = require('../../utils/format_todo');
const { $Message } = require('../../ui/dist/base/index');
const app = getApp();

Page({
  data: {
    offset: 0,
    limit: 10,
    touchBtn: false,
    idLoading: true,
    toDoIdNow: 0,
    taskIdNow: 0,
    toggle: false,
    toDos: [],
    targetTime: 0,
    formatTime: ['时', '分', '秒'],
    clearTimer: false,
    finish: false,
    weightColor: {
      1: '#5cadff',
      2: '#2DA5EF',
      3: '#2b85e4',
      4: '#2B74E2'
    },
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
      this.setData({
        isLoading: false
      });
  },
  onPullDownRefresh() {
    const that = this;
    this.getTodayData().then(toDos => {
      that.setData({
        toDos
      });
      wx.stopPullDownRefresh();
    }).catch(err => {
      console.log(err);
      alertError()
      wx.stopPullDownRefresh();
    });
  },
  onShow() {
    wx.startPullDownRefresh();    
  },
  getTodayData() {
    const { authorization } = app.globalData;
    const { offset, limit } = this.data;
    let toDos = null;
    return new Promise((reslove, reject) => {
      wx.request({
        url: 'http://localhost:3000/api/tasks',
        header: {
          authorization
        },
        data: {
          sort: 'today',
          limit,
          offset
        },
        success(res) {
          if (res.statusCode === 200) {
            toDos = formatTodo(res.data.rows);
            reslove(toDos);
          } else {  
            reject(res);
          }
        }
      });
    });
  },
  alertSuccess(msg='') {
    $Message({
      content: msg || '刷新成功',
      type: 'success'
    });
  },
  alertError(msg='') {
    $Message({
      content: msg || '刷新失败',
      type: 'error'
    })
  },
  changeToDoId: function(e) {
    console.log(e.currentTarget.dataset);
    this.setData({
      toDoIdNow: e.currentTarget.dataset.id,
      taskIdNow: e.currentTarget.dataset.taskid
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
    const that = this;
    const id = this.data.toDoIdNow;
    const taskId = this.data.taskIdNow;
    const toDos = this.data.toDos;
    const action = [...this.data.actionDelete];
    const { authorization } = app.globalData;
    action[0].loading = true;
    this.setData({
      actionDelete: action
    });
    toDos.splice(id, 1);
    // 模拟promise异步
    wx.request({
      url: 'http://localhost:3000/api/tasks/'+taskId,
      method: 'DELETE',
      header: {
        authorization
      },
      success(res) {
        if (res.statusCode === 200) {
          action[0].loading = false;
          that.setData({
              delete: false,
              toDos: toDos,
              actionDelete: action,
              toggle: that.data.toggle ? false : true
          });
          that.alertSuccess('删除成功');
        } else {
          that.alertError('删除失败');
        }
      }
    });
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
