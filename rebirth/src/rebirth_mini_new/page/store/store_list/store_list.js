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
    city: ['郑州市全城','未来新的城市暂未开启'],
    cityIndex: 0,
    latitude: 34.75165,
    longitude: 113.783328,
    fullLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const accuracy = res.accuracy
        _self.setData({
          latitude,
          longitude
        })
        console.log(_self.data.latitude)
        // if(_self.data.latitude)
        _self.store_list();
      },
    })
    _self.store_list();
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //后台接口部分
  //=======================================================
  /**
   * 后台接口[store_list]获取openid
   * 参数：无
   * 返回:门店列表信息
   */
  store_list() {
    wx.request({
      url: app.globalData.url + 'mini/storeapi/store_list',
      data: {
        page: 1,
        limit: 10,
        latlong: _self.data.latitude + ',' + _self.data.longitude,
        acc_id: wx.getStorageSync('acc').id
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("定位失败", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var model = res.data.data;
        model.forEach(function(item) {
          var la = item.latlong.split(',');
          item.lat = la[0];
          item.lon = la[1];
          item.cover_imgs = item.cover_imgs.split(',')
          item.cover_imgs = item.cover_imgs[0]
          item.cover_imgs = app.globalData.imgUrl + item.cover_imgs
        })
        _self.setData({
          gym: model,
          fullLoading: false
        })
      },
      fail(res) {
        common.requestFail('请求接口失败，未能获取门店信息');
      }
    })
  },
  /**
   * 后台接口[store_collection]收藏门店
   * 参数：acc_id,store_id
   * 返回:无
   */
  store_collection: function(store_id) {
    wx.request({
      url: app.globalData.url + 'mini/manageapi/store_collection',
      data: {
        store_id: store_id,
        acc_id: wx.getStorageSync('acc').id
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        console.log(res);
      },
      fail(res) {
        console.log(res);
      },
    })
  },

  //界面组件部分
  //====================================================
  // 点击事件汇总
  actionBtn: function(e) {
    var type = e.currentTarget.dataset.action;
    var value = e.currentTarget.dataset.value;
    switch (type) {
      case 'store':
        wx.navigateTo({
          url: '../store_show/store_show?id=' + value,
        });
        break;

      default:
        break;
    }
  },
  favorite: function(e) {
    var store_id = e.currentTarget.dataset.id;
    _self.store_collection(store_id);
    _self.store_list();
  },
  chooseCity: function() {
    _self.setData({
      cityIndex: e.detail.value
    })
  }
})