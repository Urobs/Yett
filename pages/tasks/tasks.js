const getTitleAndList = require('../../utils/get_title_and_tasks');

Page({
  data: {
    title: '',
    tasks: [
      {
        id: 1,
        desc: 'hellowold'
      }, {
        id: 2,
        desc: 'nonono'
      }
    ]
  },
  onLoad(option) {
    const title = getTitleAndList(option.case);
    this.setData({
      title
    });
  },
})