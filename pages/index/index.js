const formatTodo = require('../../utils/format_todo');
const { $Message, $Toast } = require('../../ui/dist/base/index');
const url = require('../../config').url;
const app = getApp();
let authorization = '';

const findTodoById = (id, arr) => {
  for (let i = 0; i < arr.length; i++ ) {
    if (arr[i].id === id) {
       return i;
    }
  }
};

const markTask = ({mark, taskId}) => {
  return new Promise((reslove, reject) => {
    wx.request({
      url: url + '/api/tasks/'+taskId,
      method: 'PUT',
      header: {
        authorization
      },
      data: {
        mark
      },
      success(res) {
        if (res.statusCode === 200) {
          reslove(res);
        } else {
          reject(res);
        }
      }
    });
  });
};

Page({
  data: {
    isLoad: false,
    offset: 0,
    limit: 20,
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
      4: '#2C71E0'
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
    // 检查是否有token以及是否过期
    const expiredTime = wx.getStorageSync('expiredIn') || '';
    const currentTime = new Date().getTime();
    // 如果token过期或者缓存中没有token
    if (expiredTime < currentTime || !expiredTime) {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            wx.request({
              url: `${url}/api/login/${res.code}`,
              success: res => {
                if (res.statusCode === 200) {
                  const { token, expiredIn } = res.data;
                  wx.setStorageSync('token', token);
                  wx.setStorageSync('expiredIn', expiredIn);
                  app.globalData.authorization = 'Bearer ' + token;
                  authorization = app.globalData.authorization;
                  wx.startPullDownRefresh();
                } else {
                  console.log('登陆失败:' + res.data.message);
                }
              },
            });
          } else {
            console.log('登陆失败!' + res.errMsg);
          }
        }
      });
    } else {
      console.log('从缓存中获取token');
      const token = wx.getStorageSync('token');
      app.globalData.authorization = 'Bearer ' + token;
      authorization = app.globalData.authorization;
    }
    this.setData({
      isLoad: true,
      isLoading: false
    });
  },
  onPullDownRefresh() {
    const that = this;
    this.getTodayData().then(toDos => {
      that.setData({
        toDos
      });
      that.setTaskReadyExpired();
      wx.stopPullDownRefresh();
    }).catch(err => {
      console.log(err);
      that.alertError('刷新失败');
      wx.stopPullDownRefresh();
    });
  },
  onShow() {
    if (!this.data.isLoad) {
      wx.startPullDownRefresh();
    }    
  },
  getTodayData() {
    const { offset, limit } = this.data;
    let toDos = null;
    console.log(authorization);
    return new Promise((reslove, reject) => {
      wx.request({
        url: url + '/api/tasks',
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
        },
        fail(err) {
          reject(err);
        }
      });
    });
  },
  setTaskReadyExpired() {
    const tasks = this.data.toDos;
    const that = this;
    tasks.forEach((task, index) => {
      const { expireTime, id, isFinished, isExpired } = task;
      const taskId = id;
      const now = new Date().getTime();
      if (isFinished === 'no' && isExpired === 'no') {
        try {
          if (expireTime > now) {
            const num = setTimeout(() => {
              markTask({ mark: "expired", taskId }).then(() => {
                const toDos = that.data.toDos;
                const tid = findTodoById(taskId, toDos);
                toDos[tid].isExpired = 'yes';
                that.setData({
                  toDos
                });
              });
            }, expireTime - now + 5000);
            tasks[index].num = num;
            that.setData({
              toDos: tasks
            });
          } else {
            markTask({mark: "expired", taskId}).then(() => {
              const toDos = that.data.toDos;
              toDos[index].isExpired = 'yes';
              that.setData({
                toDos
              });
            });
          } 
        } catch (err) {
          console.log(err);
          that.alertError('任务状态更新失败');
        }
      }
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
    const that = this;
    const id = this.data.toDoIdNow;
    const taskId = this.data.taskIdNow;
    const toDos = this.data.toDos;
    const action = [...this.data.actionFinish];
    action[0].loading = true;
    this.setData({
      actionFinish: action
    });
    action[0].loading = false;
    markTask({ mark: "finished", taskId }).then(() => {
      toDos[id].isFinished = 'yes';
      if ("num" in toDos[id]) {
        clearTimeout(toDos[id].num);
      }
      that.setData({
        finish: false,
        toDos: toDos,
      });
      that.alertSuccess('操作成功');
      that.setData({
        actionFinish: action,
        toggle: that.data.toggle ? false : true
      });  
    }).catch(err => {
      console.log(err);
      that.alertError('操作失败');
      that.setData({
        actionFinish: action,
        toggle: that.data.toggle ? false : true
      });  
    });
/**    wx.request({
      url: 'http://localhost:3000/api/tasks/'+taskId,
      method: 'PUT',
      header: {
        authorization
      },
      data: {
        mark: "finished"
      },
      success(res) {
        action[0].loading = false;
        toDos[id].isFinished = 'yes';
        if (res.statusCode === 200) {
          that.setData({
              finish: false,
              toDos: toDos,
          });
          that.alertSuccess('操作成功');
        } else {
          that.alertError('操作失败');
        }
        that.setData({
          actionFinish: action,
          toggle: that.data.toggle ? false : true
        });
      }
    });*/
  },
  handleDelete: function() {
    const that = this;
    const id = this.data.toDoIdNow;
    const taskId = this.data.taskIdNow;
    const toDos = this.data.toDos;
    const action = [...this.data.actionDelete];
    action[0].loading = true;
    this.setData({
      actionDelete: action
    });
    // 模拟promise异步
    wx.request({
      url: url + '/api/tasks/'+taskId,
      method: 'DELETE',
      header: {
        authorization
      },
      success(res) {
        action[0].loading = false;
        if (res.statusCode === 200) {
          toDos.splice(id, 1);
          that.setData({
              delete: false,
              toDos: toDos,
          });
          that.alertSuccess('删除成功');
        } else {
          that.alertError('删除失败');
        }
        that.setData({
          actionDelete: action,
          toggle: that.data.toggle ? false : true
      });
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
  toast(content, type, duration=2) {
    $Toast({
      content,
      type,
      duration
    })
  },
  addTodo: function() {
    const tasksNum = this.data.toDos.length;
    if (tasksNum >= 15) {
      this.toast('注意休息，任务别太多喽', 'warning');
    } else {
      this.setData({
        isLoad: false
      })
      wx.navigateTo({
        url: '../add/add'
      });
    }
  }
})
