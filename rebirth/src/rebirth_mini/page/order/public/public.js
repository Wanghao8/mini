/**
 * name:健康方案页面
 * info:上拉加载，获取健身方案
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
    loadingType: 0,
    isEnd: false,
    page: 0,
    limit: 10,
    newslist: []
  },
  
  onLoad: function (options) {
    _self = this;
  },

  onReady: function () {
    _self.getnewslist();
  },

  toappointrecord:function(){
    wx.navigateTo({
      url: '../appointrecord/appointrecord',
    })
  },
  //接口请求部分
  //============================================================================
  /**
	 * 后台接口[getnewslist]获取健身方案
	 * 参数：page
	 * 请求接口获取健身方案，成功后保存到data中
	 */
  getnewslist: function () {
    _self.setData({
      loadingType: 1,
      page: _self.data.page + 1
    });
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/wx/news',
      data: {
        page: _self.data.page
      },
      success(res) {
        if (res.statusCode !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.item;
        if (model == '' && _self.data.page == 1) {
          _self.setData({
            graceFullLoading: false,
            havelist: false,
            loadingType: 0
          })
          return;
        }
        _self.setData({
          newslist: _self.data.newslist.concat(model),
          graceFullLoading: false,
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
      fail(res) {
        common.requestfail();
        return;
      }
    })
  },
  //界面组件部分
  //============================================================================
  // 上拉加载
  onReachBottom: function () {
    if (_self.data.loadingType != 0 || _self.data.isEnd) {
      return;
    }
    _self.getnewslist();
  }
})