const updateManager = wx.getUpdateManager();
var _self;
App({
  onLaunch: function (options) {
    _self = this;
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.record']) {
    //       wx.authorize({
    //         scope: 'scope.userLocation',
    //         success() {
    //           // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
    //           wx.getLocation({
    //             type: 'wgs84',
    //             success(res) {
    //               const latitude = res.latitude
    //               const longitude = res.longitude
    //               const speed = res.speed
    //               const accuracy = res.accuracy
    //             }
    //           })
    //         }
    //       })
    //     }
    //   }
    // })

    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate == true) {
        wx.showLoading({
          mask: true,
          title: '检测到新版本'
        });
      }
    })
    updateManager.onUpdateReady(function (res) {
      wx.hideLoading();
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      wx.hideLoading();
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败,请检查网络',
        showCancel: false
      });
    })
  },
  globalData: {
    // url: 'https://rebirth.yuanfangyun.com/'
    // url: 'http://192.168.0.91:86/index.php/',
    // url: 'http://pinzhi.yuanfangyun.com/index.php/',
    url: 'https://pinzhi.yuanfangyun.com/index.php/',
    imgUrl:'http://rebirths.yuanfangyun.com/',

  }
})