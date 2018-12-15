const weightEnum = require('../../utils/weight_enum');
const clock = require('../../utils/format_clock');
const { $Message, $Toast } = require('../../ui/dist/base/index');
const app = getApp();

Page({
  data: {
    isInputNull: false,
    tasks: [
      {
        content: '',
        expireTime: '24:00',
        weight: weightEnum.importantAndUrgent,
        id: '0'
      }
    ],
    todoWeight: [
      {
        weight: 1,
        describe: '既不紧急也不重要'
      } , {
        weight: 2,
        describe: '紧急但不重要'
      } , {
        weight: 3,
        describe: '重要但不紧急'
      } , {
        weight: 4,
        describe: '重要且紧急'
      }
    ],
    startTime: "00:00"
  },
  onLoad() {
    const now = new Date();
    const nowStr = now.getHours() + ':' + now.getMinutes();
    this.setData({
      startTime: nowStr
    });
  },
  onInput({detail}) {
    if (detail==='') {
      this.setData({
        isInputNull: true
      });
    }
  },
  changeTaskNum({detail}) {
    const tasks = this.data.tasks;
    if (tasks.length > detail.value) {
      tasks.pop();
    } else if (tasks.length < detail.value){
      tasks.push({
        content: '',
        expireTime: '24:00',
        weight: 4,
        id: tasks.length + 1 + ''
      });
    }
    this.setData({
      tasks
    });
  },
  changeWeight(e) {
    const weight = e.detail.value;
    const id = e.currentTarget.dataset.id;
    const tasks = this.data.tasks;
    tasks[id].weight = weightEnum.properties[weight];
    this.setData({
      tasks
    });
  },
  timeChange(e) {
    const now = new Date();
    const id = e.currentTarget.dataset.id;
    const tasks = this.data.tasks;
    const selectTime = e.detail.value;
    const formatTime = new Date(clock(selectTime));
    if (formatTime <= now) {
      this.toast('时间必须为今日之内', 'warning');
    } else {
      tasks[id].expireTime = selectTime;
      this.setData({
        tasks
      });
    }
  },
  alertSuccess() {
    $Message({
      content: '提交成功',
      type: 'success'
    });
  },
  alertError() {
    $Message({
      content: '提交失败',
      type: 'error'
    })
  },
  toast(content, type, duration=2) {
    $Toast({
      content,
      type,
      duration
    })
  },
  submitData() {
    const that = this;
    const tasks = this.data.tasks;
    const { authorization } = app.globalData;
    let requests = [];
    that.toast('上传中','loading',0);
    tasks.forEach(task => {
      let { content, expireTime, weight } = task;
      content = 'test'
      expireTime = clock(expireTime);
      weight += '';
      requests.push(new Promise((resolve, reject) => {
        wx.request({
          url: 'http://localhost:3000/api/tasks',
          method: 'POST',
          data: {
            content,
            expireTime,
            weight
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
      }));
    });
    Promise.all(requests).then(() => {
      $Toast.hide();
      that.alertSuccess();
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        });
      }, 1000);
    }).catch((err) => {
      $Toast.hide();
      console.log(err);
      that.alertError();
    });
  }
})