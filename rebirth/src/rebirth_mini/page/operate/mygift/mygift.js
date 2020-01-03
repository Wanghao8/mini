/**
 * name:我的礼品卡页面
 * info:获取我的礼品卡信息，渲染到页面上
 * auth:王豪
 */
var _self;
var common = require("../../../static/js/common.js");
var app = getApp();
Page({
  //路由数据部分
  //============================================================================
  data: {
    imgwidth: 300,
    mycardlist: []
  },
  onLoad: function (options) {
    _self = this;
    let mobile = wx.getSystemInfoSync();
    let ratio = mobile.windowWidth / 375;
    _self.setData({
      imgwidth: 300 * ratio,
    });
  },
  onReady: function () {
    _self.getstorage();
  },
  
  //接口请求部分
  //============================================================================
  /**
	 * 后台接口[getmycardlist]获取我的礼品卡信息
	 * 参数：uid
	 * 调用接口获取我的礼品卡信息,成功后保存到data中
	 */
  getmycardlist: function (uid) {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/gift/myLists?uid=' + uid,
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        if (model == '') {
          // common.apimodelerror('获取openid为空');
          common.showmodalconfirm('暂无礼品卡');

          return;
        }
        model.forEach(function (item) {
          if (item.status == 1) {
            item.status = '可使用'
          }
          if (item.status == 2) {
            item.status = '已使用'
          }
          if (item.value == 0) {
            item.value = '课程次卡';
          } else if (item.value == 31104000) {
            item.value = '课程年卡';
          } else {
            item.value = item.value / 86400 + '天';
          }
          // if(item.type == 'year'){
          // 	item.type='年卡'
          // }
          // if(item.type == 'season'){
          // 	item.type='季卡'
          // }
          // if(item.type == 'month'){
          // 	item.type='月卡'
          // }
          // if(item.value == 'time'){
          // 	item.type='次卡'
          // }
        })
        _self.setData({
          mycardlist: model
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
  // 获取缓存
  getstorage: function () {
    wx.getStorage({
      key: 'user',
      success(res) {
        _self.setData({
          uid: res.data.uid
        });
        _self.getmycardlist(res.data.uid);
      },
      fail() {
        wx.reLaunch({
          url: '../../order/index/index'
        })
      }
    })
  },
  //分享
  onShareAppMessage: function (e) {
    e.target.dataset.pid = _self.data.uid;
    var a = JSON.stringify(e.target.dataset)
    return {
      title: '送你一张' + e.target.dataset.title + '!',
      path: 'page/operate/usegift/usegift?giftinfo=' + a,
      imageUrl: e.target.dataset.imgurl,
    }
  }
})