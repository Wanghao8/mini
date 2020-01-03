/**
 * name:退款记录页面
 * info:上拉加载退款记录
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
  onLoad: function (options) {
    _self = this;
  },
  onReady: function () {
    _self.getstorage();
  },
  //接口请求部分
  //============================================================================
  /**
	 * 后台接口[gettimeloglist]获取会员卡时长记录列表
	 * 参数：page,limit
	 * 调用接口获取会员卡时长记录列表,格式化日期时间，判断退款类型之后把处理好的数据保存到data中
	 */
  gettimeloglist: function () {
    _self.setData({
      loadingType: 1,
      page: _self.data.page + 1
    });
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/refund/getlist',
      data: {
        // uid: _self.data.uid,
        page: _self.data.page,
        limit: _self.data.limit
      },
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        for (var i = 0; i < model.length; i++) {
          var timestamp = model[i].create_time;
          var d = new Date(timestamp * 1000);    //根据时间戳生成的时间对象
          var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate()) + " " +
            (d.getHours()) + ":" +
            (d.getMinutes()) + ":" +
            (d.getSeconds());
          // console.log(date)
          model[i].create_time = date
        }

        model.forEach(function (item) {
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
  getstorage: function () {
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
  onReachBottom: function () {
    if (_self.data.loadingType != 0 || _self.data.isEnd) {
      return;
    }
    _self.gettimeloglist();
  },
  // 返回首页
  go_index() {
    wx.reLaunch({
      url: '../../order/index/index'
    })
  }
})
