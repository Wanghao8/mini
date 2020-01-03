const app = getApp();
var common = require('../../../static/js/common.js');
var _self;
Page({
  //路由数据部分
  //============================================================================
  /**
   * 页面的初始数据
   */
  data: {
    norecord: false,
    showrefund: true,
    showlocked: true,
    showdeduction: true,
    fullLoading: true,
    tabindex: '0',
    loadingType: 0,
    page: 1,
    refundList: [],
    lockedList: [],
    deductionList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
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
    _self.bond_list();
    setTimeout(() => {
      if (_self.data.refundList.length == 0 && _self.data.lockedList.length == 0 && _self.data.deductionList.length == 0) {
        _self.setData({
          norecord: true,
          fullLoading: false
        })
      } else {
        _self.setData({
          fullLoading: false
        })
      }
    }, 800)


  },

  //接口请求部分
  //============================================================================
  /**
   * 后台接口[bond_list]获取openid
   * 参数：page,limit,acc_id
   * 返回：保证金列表
   */
  bond_list: function() {
    var page = _self.data.page;
    _self.setData({
      loadingType: 1,
    });
    var model = {
      page: page,
      limit: 20,
      acc_id: wx.getStorageSync('acc').id
    };
    wx.request({
      url: app.globalData.url + 'mini/goodsapi/bond_list',
      data: model,
      method: 'post',
      header: common.headerForm,
      success(res) {
        var goodsInfo = res.data.data;
        _self.setData({
          refundList: [],
          lockedList: [],
          deductionList: []
        });
        goodsInfo.forEach(function(item) {
          switch (item.status) {
            case '1':
              _self.data.lockedList.push(item);
              break;
            case '2':
              _self.data.refundList.push(item);
              break;
            default:
              break;
          };
        });
        _self.setData({
          lockedList: _self.data.lockedList,
          refundList: _self.data.refundList,
          loadingType: goodsInfo.length == 20 ? 0 : 2
        });
      },
      fail(res) {
        common.requestFail('保证金列表获取失败');
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
      page: 1,
      loadingType: 0
    });
    _self.bond_list();
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
    if (_self.data.loadingType !== 2) {
      _self.setData({
        page: _self.data.page + 1,
      });
      _self.bond_list();
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
          url: '/pages/index/detail/detail?goods_id=' + value+'&end_time=' + end
        });
        break;
      case 'switchtab':
        _self.switchtab(e);
        break;
      default:
        break;
    };
  },
  //切换顶部状态
  switchtab: function(e) {
    var index = e.target.dataset.index;
    switch (index) {
      case '0':
        if (_self.data.refundList.length == 0 && _self.data.lockedList.length == 0 && _self.data.deductionList.length == 0) {
          _self.setData({
            norecord: true
          });
        } else {
          _self.setData({
            norecord: false
          });
        };
        _self.setData({
          tabindex: index,
          showrefund: true,
          showlocked: true,
          showdeduction: true
        });
        wx.pageScrollTo({
          scrollTop: 0
        });
        break;
      case '1':
        if (_self.data.lockedList.length == 0) {
          _self.setData({
            norecord: true
          });
        } else {
          _self.setData({
            norecord: false
          });
        };
        _self.setData({
          tabindex: index,
          showrefund: false,
          showlocked: true,
          showdeduction: false
        });
        wx.pageScrollTo({
          scrollTop: 0
        });
        break;
      case '2':
        if (_self.data.refundList.length == 0) {
          _self.setData({
            norecord: true
          });
        } else {
          _self.setData({
            norecord: false
          });
        };
        _self.setData({
          tabindex: index,
          showrefund: true,
          showlocked: false,
          showdeduction: false
        });
        wx.pageScrollTo({
          scrollTop: 0
        });
        break;
      case '3':
        if (_self.data.deductionList.length == 0) {
          _self.setData({
            norecord: true
          });
        } else {
          _self.setData({
            norecord: false
          });
        };
        _self.setData({
          tabindex: index,
          showrefund: false,
          showlocked: false,
          showdeduction: true
        });
        wx.pageScrollTo({
          scrollTop: 0
        });
        break;
      default:
        break;
    };
  }

})