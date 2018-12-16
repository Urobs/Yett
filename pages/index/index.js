const formatTodo = require('../../utils/format_todo');
const { $Message, $Toast } = require('../../ui/dist/base/index');
const app = getApp();
const { authorization } = app.globalData;

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
      url: 'http://localhost:3000/api/tasks/'+taskId,
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
      that.setTaskReadyExpired();
      wx.stopPullDownRefresh();
    }).catch(err => {
      console.log(err);
      that.alertError('刷新失败');
      wx.stopPullDownRefresh();
    });
  },
  onShow() {
    wx.startPullDownRefresh();    
  },
  getTodayData() {
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
        console.log(toDos[id].num);
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
      url: 'http://localhost:3000/api/tasks/'+taskId,
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
      wx.navigateTo({
        url: '../add/add'
      });
    }
  }
})
