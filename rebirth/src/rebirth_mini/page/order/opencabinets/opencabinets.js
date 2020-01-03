/**
 * name:我的储物柜页面
 * info:打开柜门，路由跳转购买储物柜
 * auth:王豪
 */
var _self;
var common = require("../../../static/js/common.js");
var app = getApp();
Page({
  //路由数据部分
  //============================================================================
  data: {
    uid: 0
  },
  onLoad: function (options) {
    _self = this;
    _self.setData({
      uid: options.uid
    })
  },
  onReady: function () {
    _self.isLogin();
  },
  tocabinets: function () {
    wx.navigateTo({
      url: '../../order/cabinets/cabinets'
    })
  },
  //接口请求部分
  //============================================================================
  /**
	 * 后台接口[getUserById]获取用户信息
	 * 参数：uid
	 * 调用接口获取用户信息，判断是否有柜子若有则调用getstoreinfo同时显示柜门号和剩余时间，若无柜子则跳转回上一层
	 */
  getUserById: function (uid) {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/user/getinfo?uid=' + uid,
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('获取用户为空');
          return;
        }
        if (model.has_locker == 1) {
          _self.getstoreinfo(model.locker_store_id);
          var timestamp = Date.parse(new Date()) / 1000;
          var a = common.converttime(model.locker_end_time - timestamp);
          _self.setData({
            lockerid: model.locker_id + '号',
            cabinetsinfo: '剩余时间' + a,
          });
        } else if (model.has_locker == 2) {
          wx.navigateBack({})
        }
      },
      fail() {
        common.requestfail();
        return;
      }
    })
  },
  /**
	 * 后台接口[getstoreinfo]根据健身房id获取信息
	 * 参数：id
	 * 请求接口获取信息成功后将数据保存到data中
	 */
  getstoreinfo: function (id) {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/store/detail?store_id=' + id,
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('获取健身房为空');
          return;
        }
        _self.setData({
          cabinetstitle: model.name,
        })
      }
    })
  },
  /**
	 * 后台接口[openlocker]开柜门
	 * 参数：uid
	 * 向后台发送请求，成功后打开柜门并弹出成功提示
	 */
  openlockeryes: function () {  //确定打开给后台传参数
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/Locker/open?uid=' + _self.data.uid,
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        });
      }
    })
  },
  //界面组件部分
  //============================================================================
  // 获取缓存
  isLogin: function () {
    wx.getStorage({
      key: 'user',
      success(res) {
        var model = res.data;
        _self.getUserById(model.uid);
        _self.setData({
          uid: model.uid
        });
      },
      fail() {
        _self.getCode();
      }
    });
  },
  //开柜门
  openlocker: function () {
    wx.showModal({
      content: '确认打开专属储物柜？打开后需手动关闭柜门！',
      success(res) {
        if (res.confirm) {
          _self.openlockeryes();
        } else if (res.cancel) {
          return;
        }
      }
    })
  },
})