const app = getApp();
var common = require('../../static/js/common.js');
var timer = require('../../components/timer/wxTimer.js');
var _self;
Page({

  //路由数据部分
  //============================================================================
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    limit: 20,
    typeIndex: 1,
    pageIndex: 1,
    seletorType: '1',
    goodsList: [],
    fullLoading: true,
    loadingType: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //判断是否登录
    if (!(wx.getStorageSync('acc'))) {
      _self.wxlogin();
      return;
    }

    //执行数据获取
    if (_self.data.page == 1) {
      _self.goods_list();
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload:function(){
    _self.data.goodsList.forEach(function(item){
      clearInterval(item.timer)
    })
  },
  //点击事件汇总
  actionBtn: function(e) {
    var action = e.currentTarget.dataset.action;
    var value = e.currentTarget.dataset.value;
    var end = e.currentTarget.dataset.end;
    var type = e.currentTarget.dataset.type;
    switch (action) {
      case 'switchBar':
        _self.setData({
          page: 1,
          seletorType: value
        });
        _self.goods_list();
        break;
      case 'gotoHttp':
        wx.navigateTo({
          url: './rank/rank?httpUrl=' + value,
        })
        break;
      case 'gotoDetail':
        wx.navigateTo({
          url: './detail/detail?goods_id=' + value + '&status=' + type,
        })
        break;
      default:
        break;
    }
  },

  //接口请求部分
  //============================================================================
  /**
   * 后台接口[goods_list]获取openid
   * 参数：page,limit,type
   * 返回:商品列表信息
   */
  goods_list: function() {
    var page = _self.data.page;
    var type = _self.data.seletorType;
    //切换条件后 需清空原数据
    if (page == 1) {
      _self.setData({
        goodsList: []
      });
    };
    //上拉加载更多
    _self.setData({
      loadingType: 1
    });
    wx.request({
      url: app.globalData.url + 'mini/goodsapi/goods_list',
      data: {
        page: _self.data.page,
        limit: _self.data.limit,
        type: type
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("接口请求未完成", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var tmpGoodsList = res.data.data;
        // var currentTime = new Date();
        tmpGoodsList.forEach(function(item) {
          item.cover_img = app.globalData.qiniuUrl + item.cover_imgs.split(',')[0];
          //结束时间倒计时处理 
          var endTimes = new Date(item.delay_time.replace(/\-/g, "/"));
          // var endTimes = new Date(item.delay_time);
          var leftTimeStamp = item.countdown_time;
          // var leftTimeStamp = Math.floor((endTimes.getTime() - currentTime.getTime()) / 1000);
          var leftHour = Math.floor(leftTimeStamp / 3600);
          var leftMinutes = Math.floor(leftTimeStamp % 3600 / 60);
          var leftSeconds = leftTimeStamp % 3600 % 60;
          item.leftHour = leftHour > 0 ? leftHour < 10 ? '0' + leftHour : leftHour : '00';
          item.leftMinutes = leftMinutes > 0 ? leftMinutes < 10 ? '0' + leftMinutes : leftMinutes : '00';
          item.leftSeconds = leftSeconds > 0 ? leftSeconds < 10 ? '0' + leftSeconds : leftSeconds : '00';
          _self.data.goodsList.push(item);
          _self.countDown(item);
        });
        _self.setData({
          goodsList: _self.data.goodsList,
          fullLoading: false,
          loadingType: tmpGoodsList.length == 20 ? 0 : 2,
          typeIndex: type,
          pageIndex: _self.data.page
        });
      },
      fail(res) {
        common.requestFail('竞拍商品获取失败');
        return;
      }
    });
  },
  /**
   * 微信登录code [wxlogin] 
   * 小程序直接请求code
   * 返回code
   */
  wxlogin: function() {
    wx.login({
      success(res) {
        _self.acc_login_code(res.code);
      }
    });
  },
  /**
   * 后台自动登录 [acc_login_code]
   * 参数 code
   * 返回用户实体信息
   */
  acc_login_code(code) {
    wx.request({
      url: app.globalData.url + 'mini/manageapi/acc_login_code?code=' + code,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("后台自动登录失败", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        wx.setStorageSync('acc', res.data.data);
        _self.goods_list();
      },
      fail(res) {
        common.requestFail('后台登录接口，执行失败');
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
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    _self.setData({
      page: 1,
      loadingType: 0
    });
    _self.goods_list();
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
      });
      _self.goods_list();
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
              clearInterval(item.timer);
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
          goodsList: _self.data.goodsList
        })
      }, 1000);
    };
  },
  //tabbar切换
  tabChange(e) {
    if (e.detail.index === 0) {
      wx.switchTab({
        url: '../home/home'
      });
      return;
    };
    if (e.detail.index === 1) {
      wx.switchTab({
        url: '../joined/joined'
      });
      return;
    };
    if (e.detail.index === 2) {
      wx.switchTab({
        url: '/pages/mine/mine'
      });
      return;
    };
  },
})

//首页倒计时为0的时候，请求接口，刷新首页数据
// if (_self.data.page == 1) {
//   _self.goods_list();
// };