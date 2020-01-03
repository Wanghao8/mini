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
    tabindex: '0',
    norecord: false,
    fullLoading: true,
    page: 1,
    loadingType: 0,
    loadingType1: 0,
    loadingType2: 0,
    goodsList: [],
    done: []
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
    _self.setData({
      fullLoading: true
    });
    _self.publish_goods_list();
    setTimeout(() => {
      if (_self.data.done.length == 0 && _self.data.goodsList.length == 0) {
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

  /**
   * 下拉刷新组件
   */
  onPullDownRefresh: function() {
    var page = _self.data.page;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    _self.setData({
      page: 1,
      loadingType: 0,
      loadingType1: 0,
      loadingType2: 0,
    });
    _self.publish_goods_list();
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
        add: true
      });
      _self.publish_goods_list();
    };
  },
  //接口请求部分
  //============================================================================

  /**
   * 后台接口[publish_goods_list]获取openid
   * 参数：page,limit,acc_id
   * 返回：已发布信息
   */
  publish_goods_list: function() {
    var page = _self.data.page;
    _self.setData({
      loadingType: 1,
      loadingType1: 1,
      loadingType2: 1,
    });
    var model = {
      page: page,
      limit: 20,
      acc_id: wx.getStorageSync('acc').id
    };
    wx.request({
      url: app.globalData.url + 'mini/goodsapi/publish_goods_list',
      data: model,
      method: 'post',
      header: common.headerForm,
      success(res) {
        var goods = res.data.data;
        if (!_self.data.add) {
          _self.setData({
            goodsList: [],
            done: []
          });
        };
        goods.forEach(function(item) {
          // item.cover_imgs = item.cover_imgs.split(',');
          // item.cover_imgs = app.globalData.qiniuUrl + item.cover_imgs;
          item.cover_imgs = item.cover_imgs.split(',');
          for (var i = 0; i < item.cover_imgs.length; i++) {
            item.cover_imgs[i] = app.globalData.qiniuUrl + item.cover_imgs[i];
          };
          switch (item.status) {
            case 1:
              _self.data.goodsList.push(item);
              break;
            case 2:
              _self.data.goodsList.push(item);
              break;
            case 3:
              _self.data.done.push(item);
              break;
            default:
              break;
          };
        });
        _self.setData({
          goodsList: _self.data.goodsList,
          done: _self.data.done,
          add: false,
          loadingType: goods.length == 20 ? 0 : 2,
          loadingType1: _self.data.goodsList.length == 20 ? 0 : 2,
          loadingType2: _self.data.done.length == 20 ? 0 : 2,
        });
      }
    });
  },

  //界面组件部分
  //============================================================================
  switchtab: function(e) {
    var index = e.target.dataset.index
    this.setData({
      tabindex: index
    })
    switch (index) {
      case '0':
        if (_self.data.goodsList.length == 0 && _self.data.done.length == 0) {
          _self.setData({
            norecord: true
          });
        } else {
          _self.setData({
            norecord: false
          });
        };
        wx.pageScrollTo({
          scrollTop: 0
        });
        break;
      case '1':
        if (_self.data.goodsList.length == 0) {
          _self.setData({
            norecord: true
          });
        } else {
          _self.setData({
            norecord: false
          });
        };
        wx.pageScrollTo({
          scrollTop: 0
        });
        break;
      case '2':
        if (_self.data.done.length == 0) {
          _self.setData({
            norecord: true
          });
        } else {
          _self.setData({
            norecord: false
          });
        };
        wx.pageScrollTo({
          scrollTop: 0
        });
        break;
      default:
        break;
    }
  },
  actionBtn: function(e) {
    var action = e.currentTarget.dataset.action;
    var value = e.currentTarget.dataset.value;
    var end = e.currentTarget.dataset.end;
    switch (action) {
      case 'detail':
        wx.navigateTo({
          url: '/pages/index/detail/detail?goods_id=' + value + '&end_time=' + end
        })
        break;
      case 'phone':
        if (value) {
          wx.showModal({
            title: '提醒',
            content: '您确定拨号给中拍人吗',
            success(res) {
              if (res.confirm) {
                wx.makePhoneCall({
                  phoneNumber: value,
                });
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.showModal({
            title: '提醒',
            content: '此件拍品无人出价，已经流拍',
          })
        }
        break;
      case 'switchtab':
        _self.switchtab(e);
        break;
      default:
        break;
    };
  }
})