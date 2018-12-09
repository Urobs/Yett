Page({
  data: {
    title: ''
  },
  onLoad(options) {
    this.setData({
      title: options.query
    });
  }
})