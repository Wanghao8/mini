const updateManager = wx.getUpdateManager();
var _self;
App({
  onLaunch: function (options) {
	  _self = this;
	  
		updateManager.onCheckForUpdate(function (res) {
			 if(res.hasUpdate == true){
				 wx.showLoading({
				 	mask:true,
					title:'检测到新版本'
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
		        showCancel:false
		    });
		})
    config = {
      "permission": {
        "scope.userLocation": {
          "desc": "你的位置信息将用于定位效果展示"
        }
      }
    }
  },
  globalData: {
    miniserverUrl:'https://rebirth.yuanfangyun.com/'
  }
})