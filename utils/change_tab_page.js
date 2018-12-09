module.exports = function({detail}) {
  const currentPage = this.data.currentPage;
  this.setData({
    currentPage: detail.key
  });
  if (currentPage === detail.key);
  else {
    wx.reLaunch({
      url: `/pages/${detail.key}/${detail.key}`
    })
  }
}