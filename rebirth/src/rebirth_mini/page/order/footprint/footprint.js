/**
 * name:我的足迹页面
 * info:上拉加载，获取足迹列表
 * auth:王豪
 */
var _self;
var common = require("../../../static/js/common.js");
var app = getApp();
Page({
  //路由数据部分
  //============================================================================

  data: {
    graceFullLoading: true,
    uid: 0,
    loadingType: 0,
    isEnd: false,
    page: 0,
    limit: 10,
    havelist: false,
    FootprintInfo: [],
  },
  onLoad: function (options) {
    _self = this;
  },
  onReady: function () {
    _self.getstorage();
  },
  //接口请求部分
  //============================================================================
  /**
	 * 后台接口[gettracklist]获取足迹列表
	 * 参数：uid,page,limit
	 * 请求接口获取足迹列表，成功返回后将数据赋值给FootprintInfo并保存到data中
	 */
  gettracklist: function () {
    _self.setData({
      loadingType: 1,
      page: _self.data.page + 1
    });
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/user/track',
      data: {
        uid: _self.data.uid,
        page: _self.data.page,
        limit: _self.data.limit
      },
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        if (model == '' && _self.data.page == 1) {
          _self.setData({
            graceFullLoading: false,
            havelist: false,
            loadingType: 0
          })
          return;
        }
        _self.setData({
          FootprintInfo: _self.data.FootprintInfo.concat(model),
          graceFullLoading: false,
          havelist: true,
          loadingType: 0
        });
        if (model.length < _self.data.limit) {
          _self.setData({
            isEnd: true,
            loadingType: 2,
            graceFullLoading: false,
            havelist: true
          });
        }
      },
      fail() {
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
        _self.gettracklist();
      },
      fail() {
        wx.reLaunch({
          url: '../../order/index/index'
        })
      }
    })
  },
  // 上拉加载
  onReachBottom: function () {
    if (_self.data.loadingType != 0 || _self.data.isEnd) {
      return;
    }
    _self.gettracklist();
  }
})