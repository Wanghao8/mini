const app = getApp();
var common = require('../../static/js/common.js');
var _self;
Page({
  //路由数据部分
  //============================================================================
  /**
   * 页面的初始数据
   */
  data: {
    fullLoading: true,
    page: 1,
    limit: 20,
    now: [],
    goodsList: [],
    loadingType: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
    _self.setData({
      // endTime: app.globalData.endTime
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    _self.setData({
      fullLoading: true
    })
    _self.participate_goods_list();
  },
  //接口请求部分
  //============================================================================
  /**
   * 后台接口[participate_goods_list]获取已参与列表
   * 参数：page,limit,acc_id
   * 返回:已参与列表信息
   */
  participate_goods_list: function() {
    var page = _self.data.page;
    _self.setData({
      loadingType: 1
    });
    wx.request({
      url: app.globalData.url + 'mini/goodsapi/participate_goods_list',
      data: {
        page: _self.data.page,
        limit: _self.data.limit,
        acc_id: wx.getStorageSync('acc').id
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("接口请求未完成", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        //先清空上次的已参与列表
        _self.setData({
          now: [],
          goodsList: []
        });
        var tmpGoodsList = res.data.data;
        var currentTime = new Date();
        tmpGoodsList.forEach(function(item) {
          item.cover_imgs = app.globalData.qiniuUrl + item.cover_imgs.split(',')[0];
          // item.cover_imgs = app.globalData.qiniuUrl + item.cover_imgs;
          //结束时间倒计时处s
          var endTimes = new Date(item.delay_time.replace(/\-/g, "/"));
          // var endTimes = new Date(item.delay_time);
          // var leftTimeStamp = Math.floor((endTimes.getTime() - currentTime.getTime()) / 1000);
          var leftTimeStamp = item.countdown_time;
          var leftHour = Math.floor(leftTimeStamp / 3600);
          var leftMinutes = Math.floor(leftTimeStamp % 3600 / 60);
          var leftSeconds = leftTimeStamp % 3600 % 60;
          item.leftHour = leftHour > 0 ? leftHour < 10 ? '0' + leftHour : leftHour : '00';
          item.leftMinutes = leftMinutes > 0 ? leftMinutes < 10 ? '0' + leftMinutes : leftMinutes : '00';
          item.leftSeconds = leftSeconds > 0 ? leftSeconds < 10 ? '0' + leftSeconds : leftSeconds : '00';
          //判断拍卖是否结束
          if (item.status == 1) {
            _self.countDown(item);
            _self.data.now.push(item);
            _self.setData({
              now: _self.data.now
            })
          } else {
            _self.data.goodsList.push(item);
          }
        });
        _self.setData({
          now: _self.data.now,
          goodsList: _self.data.goodsList,
          fullLoading: false,
          loadingType: tmpGoodsList.length == 20 ? 1 : 2
        });
      },
      fail(res) {
        common.requestFail('竞拍商品获取失败');
        return;
      }
    });
  },
  //界面组件部分
  //============================================================================

  /**
   * 下拉刷新组件
   */
  onPullDownRefresh: function() {
    var page = _self.data.page;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    _self.setData({
      loadingType: 0,
      page:1
    });
    _self.participate_goods_list();
    // 隐藏导航栏加载框
    setTimeout(function() {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1000);
  },
  /**
   * 上拉加载组件
   */
  onReachBottom: function() {
    var page = _self.data.page;
    if (_self.data.loadingType !== 2) {
      _self.setData({
        page: page + 1,
      })
      _self.participate_goods_list();
    };
  },
  //点击事件汇总
  actionBtn: function(e) {
    var action = e.currentTarget.dataset.action;
    var value = e.currentTarget.dataset.value;
    var end = e.currentTarget.dataset.end;
    switch (action) {
      case 'detail':
        wx.navigateTo({
          url: '../index/detail/detail?goods_id=' + value+ '&end_time=' + end
        });
        break;
      default:
        break;
    };
  },


  //倒计时功能
  countDown: function(item) {
    var leftSeconds = item.leftSeconds;
    if (parseInt(item.leftHour) >= 0 && parseInt(item.leftMinutes) >= 0 && parseInt(item.leftSeconds) >= 0) {
      item.timer = setInterval(function() {
        leftSeconds--;
        if (leftSeconds >= 0) {
          item.leftSeconds = leftSeconds;
          if (leftSeconds < 10) {
            item.leftSeconds = '0' + leftSeconds;
          };
          if (item.leftMinutes <= 0 && item.leftSeconds <= 0) {
            var leftHour = item.leftHour;
            if (leftHour > 0) {
              leftHour--;
            } else {
              return;
            };
            item.leftHour = leftHour < 10 ? '0' + leftHour : leftHour,
              item.leftMinutes = 60;
            clearInterval(item.timer);
            _self.countDown(item);
          };
        };
        if (leftSeconds < 0) {
          var leftMinutes = item.leftMinutes;
          if (leftMinutes > 0) {
            leftMinutes--;
          } else {
            clearInterval(item.timer);
            return;
          };
          item.leftSeconds = 59,
            item.leftMinutes = leftMinutes < 10 ? '0' + leftMinutes : leftMinutes;
          clearInterval(item.timer);
          _self.countDown(item);
        };
        _self.setData({
          goodsList: _self.data.goodsList,
          now: _self.data.now
        });
      }, 1000);
    };
  },

})