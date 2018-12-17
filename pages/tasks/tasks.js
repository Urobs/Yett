const getTitleAndList = require('../../utils/get_title_and_tasks');
const app = getApp();
const getTaskList = (type) => {
  return app.globalData.tasks[type];
};

Page({
  data: {
    title: '',
    tasks: []
  },
  onLoad(option) {
    const title = getTitleAndList(option.case);
    const tasks = getTaskList(option.case);
    this.setData({
      title,
      tasks
    });
  },
})