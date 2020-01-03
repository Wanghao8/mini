/**
 * name:时长记录 退卡记录 充值记录等
 * info:上拉加载，获取时长记录等
 * auth:王豪
 */
var _self;
var common = require("../../../static/js/common.js");
var app = getApp();
Page({
  //路由数据部分
  //============================================================================
  data: {
    RechargeInfo: [],
    graceFullLoading: true,
    loadingType: 0,
    isEnd: false,
    page: 0,
    limit: 10,
    havelist: false,
    uid: 0,
  },
  onLoad: function(options) {
    _self = this;
  },
  onReady: function() {
    _self.getstorage();
  },
  //接口请求部分
  //============================================================================
  /**
   * 后台接口[gettimeloglist]获取会员卡时长记录列表
   * 参数：uid,page,limit
   * 调用接口获取记录信息，成功后把返回的信息保存到data中
   */
  gettimeloglist: function() {
    _self.setData({
      loadingType: 1,
      page: _self.data.page + 1
    });
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/user/time_log',
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
        model.forEach(function(item) {
          if (item.value == 0) {
            item.value = '1张';
          } else {
            item.value = item.value / 86400 + '天';
          }
        })
        if (model == '' && _self.data.page == 1) {
          _self.setData({
            graceFullLoading: false,
            havelist: false,
            loadingType: 0
          })
          return;
        }
        _self.setData({
          RechargeInfo: _self.data.RechargeInfo.concat(model),
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
  getstorage: function() {
    wx.getStorage({
      key: 'user',
      success(res) {
        _self.setData({
          uid: res.data.uid
        });
        _self.gettimeloglist();

      },
      fail() {
        wx.reLaunch({
          url: '../../order/index/index'
        })
      }
    })
  },
  // 上拉加载
  onReachBottom: function() {
    if (_self.data.loadingType != 0 || _self.data.isEnd) {
      return;
    }
    _self.gettimeloglist();
  }
})