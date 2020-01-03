/**
 * name:寻找我的健身朋友 点击进入海报页面
 * info:获取精选活动，点击跳转分享海报页面
 * auth:王豪
 */
var _self;
var common = require("../../../static/js/common.js");
var app = getApp();
Page({
  //路由数据部分
  //============================================================================
  data: {
    ActivityInfo: [],
    graceFullLoading: true,
  },
  onLoad: function (options) {
    _self = this;
  },
  onReady: function () {
    _self.getactivitylist();
    _self.setData({
      graceFullLoading: true
    });
  },
  //接口请求部分
  //============================================================================
  /**
	 * 后台接口[getactivitylist]获取活动列表
	 * 参数：无
	 * 调用接口获取活动列表，成功后保存到data中
	*/
  getactivitylist: function () {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/Activity/lists',
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('获取活动列表为空');
          return;
        }
        model.forEach(function (item) {
          if (item.id == 1 || item.id == 4) {
            item.btn = false
          } else {
            item.btn = true
          }
        })
        _self.setData({
          ActivityInfo: model,
          graceFullLoading: false
        })
      },
      fail() {
        common.requestfail();
        return;
      }
    })
  },
  //界面组件部分
  //============================================================================
  // 做活动跳转生成海报
  doactivi: function (e) {
    wx.navigateTo({
      url: '../../user/invitationview/invitationview'
    })
    // 		var model = e.currentTarget.dataset.actid;
    // 		wx.navigateTo({
    // 			url:'../../user/invitationview/invitationview'
    // 		});
  }
})