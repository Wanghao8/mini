/**
 * name:提现页面
 * info:一键全部提现、任意金额提现
 * auth:王豪
 */
var _self;
var common = require("../../../static/js/common.js");
var app = getApp();
Page({
  //路由数据部分
	//============================================================================
  data: {
    balance: true,
    money: 5896,
    cashmoney: '',
    cashBtn: true
  },
  onLoad: function (options) {
    _self = this;
  },
  onReady: function () {
    _self.setData({
      cashmoney: ''
    })
  },
  //界面组件部分
	//============================================================================
  // 全部提现按钮
  cashall: function () {
    _self.setData({
      cashmoney: _self.data.money,
      cashBtn: false
    })
  },
  // 输入操作
  inputcash: function (e) {
    if (e.detail.value == '' || e.detail.value == null) {
      _self.setData({
        cashBtn: true
      })
    } else {
      _self.setData({
        cashBtn: false
      })
    }
    if (e.detail.value > _self.data.money) {
      _self.setData({
        balance: false
      })
    } else {
      _self.setData({
        balance: true
      })
    }
  },
  // 提现操作
  CashBalance: function () {
    // 	wx.showLoading({
    // 		title:'正在提现...',
    // 		mask:true,
    // 		success() {}
    // 	})
    // 	setTimeout(function(){
    // 			wx.hideLoading({
    // 			success(){
    // 						wx.showToast({
    // 				  title: '提现成功',
    // 				  icon: 'success',
    // 				  duration: 2000
    // 				});
    // 				_self.onReady()
    // 			}
    // 		})
    // 	},2000)

    common.showmodalconfirm('即将开放，敬请期待！');
  }
})