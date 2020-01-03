/**
 * name:收益记录 分享奖励列表页面
 * info:上拉加载，获取会员卡时长记录列表
 * auth:王豪
 */
var _self;
var common = require("../../../static/js/common.js");
var app = getApp();
Page({
  //路由数据部分
  //============================================================================
  data: {
    ProfitInfo: [],
    graceFullLoading: true,
    loadingType: 0,
    isEnd: false,
    page: 0,
    limit: 10,
    havelist: false,
    uid: 0,
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
  * 后台接口[getprologlist]获取会员卡时长记录列表
  * 参数：uid,page,limit
  * 请求接口获取会员卡时长记录，成功返回后格式化value和desc_type再将数据赋值给ProfitInfo并保存到data中
  */
  getprologlist: function (uid) {
    _self.setData({
      loadingType: 1,
      page: _self.data.page + 1
    });
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/user/proceeds_log',
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
        model.forEach(function (item) {
          item.value = item.value / 100
          if (item.value >= 0) {
            item.value = '+' + item.value
          }
          if (item.desc_type == 1) {
            item.desc_type = '分享收益'
          }
          if (item.desc_type == 2) {
            item.desc_type = '推广收益'
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
          ProfitInfo: _self.data.ProfitInfo.concat(model),
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
        _self.getprologlist();
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
    _self.getprologlist();
  }
})
