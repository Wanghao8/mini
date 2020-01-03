/**
 * name:礼品卡页面
 * info:选择不同的礼品卡，点击跳转giftpay支付页面
 * auth:王豪
 */
var _self;
var common = require("../../../static/js/common.js");
var app = getApp();
Page({
  //路由数据部分
  //============================================================================
  data: {
    imgwidth: 164,
    showtips: false,
    height: 129,
    giftlist: []
  },
  onLoad: function (options) {
    _self = this;
    let mobile = wx.getSystemInfoSync();
    let ratio = mobile.windowWidth / 375;
    _self.setData({
      imgwidth: 164 * ratio,
    });
    var query = wx.createSelectorQuery();
    query.select('#top').boundingClientRect();
    query.exec(function (res) {
      _self.setData({
        height: res[0].height
      })
    })
  },
  onReady: function () {
    _self.getgiftlist();
  },
  togiftpay: function (e) {
    var a = JSON.stringify(e.currentTarget.dataset.model)
    wx.navigateTo({
      url: '../../operate/giftpay/giftpay?model=' + a
    })
  },
  tomygift: function () {
    wx.navigateTo({
      url: '../../operate/mygift/mygift'
    })
  },
  //接口请求部分
  //============================================================================
  /**
	 * 后台接口[getgiftlist]获取礼品卡列表
	 * 参数：无
	 * 调用接口获取礼品卡列表，成功后保存到data中
	*/
  getgiftlist: function () {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/gift/lists',
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('获取列表为空');
          return;
        }
        _self.setData({
          giftlist: model
        });
      },
      fail(res) {
        common.requestfail();
        return;
      }
    })
  },
  //界面组件部分
  //============================================================================
  //显示小提示
  showtips: function () {
    if (_self.data.showtips == false) {
      _self.setData({
        showtips: true
      })
    } else if (_self.data.showtips == true) {
      _self.setData({
        showtips: false
      })
    }
  }
})