//app.js
App({
  onLaunch: function () {
    // 检查是否有token以及是否过期
    const that = this;
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
              url: `http://localhost:3000/api/login/${res.code}`,
              success: res => {
                if (res.statusCode === 200) {
                  const { token, expiredIn } = res.data;
                  wx.setStorageSync('token', token);
                  wx.setStorageSync('expiredIn', expiredIn);
                  that.globalData.Authorization = 'Bearer ' + token;
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
      const token = wx.getStorageSync('token');
      that.globalData.authorization = 'Bearer ' + token;
    }
  },
  globalData: {
    authorization: null
  }
})