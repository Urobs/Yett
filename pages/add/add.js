Page({
  data: {
    todoNum: 1,
    tasks: [
      {
        current: '重要且紧急',
        id: 0
      }
    ],
    todoWeight: [
      {
        weight: 4,
        describe: '重要且紧急'
      }, {
        weight: 3,
        describe: '重要但不紧急'
      } , {
        weight: 2,
        describe: '紧急但不重要'
      } , {
        weight: 1,
        describe: '既不紧急也不重要'
      }
    ],
    startTime: "00:00",
    endTimes: [
      {
        time: "24:00",
        id: 0
      }
    ]
  },
  changeNum({detail}) {
    const tasks = this.data.tasks;
    const endTimes = this.data.endTimes;
    if (this.data.todoNum > detail.value) {
      tasks.pop();
      endTimes.pop()
    } else {
      tasks.push({
        current: '重要且紧急',
        id: tasks.length
      });
      endTimes.push({
        time: "24:00",
        id: endTimes.length
      })
    }
    this.setData({
      todoNum: detail.value,
      tasks,
      endTimes
    });
  },
  changeWeight(e) {
    const weight = e.detail.value;
    const id = e.currentTarget.dataset.id;
    const tasks = this.data.tasks;
    tasks[id].current = weight;
    this.setData({
      tasks
    });
  },
  timeChange(e) {
    const now = new Date();
    const nowStr = now.getHours() + ':' + now.getMinutes();
    const id = e.currentTarget.dataset.id;
    const endTimes = this.data.endTimes;
    endTimes[id].time = e.detail.value;
    this.setData({
      endTimes,
      startTime: nowStr
    });
  },
  submitData() {
    wx.navigateBack({
      delta: 1
    });
  }
})