const updateManager = wx.getUpdateManager();
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    updateManager.onCheckForUpdate(function(res) {
      if (res.hasUpdate == true) {
        wx.showLoading({
          mask: true,
          title: '检测到新版本'
        });
      }
    })
    updateManager.onUpdateReady(function(res) {
      wx.hideLoading();
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function() {
      wx.hideLoading();
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败,请检查网络',
        showCancel: false
      });
    })
  },
  globalData: {
    userInfo: null,
    localUrl: 'http://192.168.0.91:85/',
    url: 'https://paimai.yuanfangyun.com/index.php/',
    qiniuUrl: "http://paimais.yuanfangyun.com/"
  }
})