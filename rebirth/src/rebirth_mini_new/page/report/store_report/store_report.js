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
    resever: 0,
    introIndex: 1,
    currentTab: 0,
    weekday: ['日', '一', '二', '三', '四', '五', '六', '日', '一', '二', '三', '四', '五', '六'],
    classList: [],
    store: ['楷林IFC店', '楷林国际店', '人保大厦店', '金地铂悦店'],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
    _self.getDate();
    _self.store_show();
    _self.setHeight();
    _self.setData({
      chooseDate: _self.data.date1
    })
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
    _self.goods_list()
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
   * 获取门店信息 [store_show]
   * 参数：id
   * 返回:门店信息
   */
  store_show: function(e) {
    console.log(23)
    wx.request({
      url: app.globalData.url + 'mini/storeapi/store_show',
      data: {
        id: parseInt(_self.data.index) + 1
      },
      method: 'get',
      header: common.headerForm,
      success(res) {
        var model = res.data.data;
        model.no = parseInt(model.id) + 1000;
        model.cover_imgs = app.globalData.imgUrl + model.cover_imgs;
        model.latlong = model.latlong.split(',');
        model.lat = model.latlong[0];
        model.lon = model.latlong[1];
        _self.setData({
          gym: model
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  /**
   * 获取课表 [goods_list]
   * 参数：page,limit,dayn,store_id
   * 返回:课表信息
   */
  goods_list: function(e) {
    wx.request({
      url: app.globalData.url + 'mini/storeapi/goods_list',
      data: {
        page: 1,
        limit: 10,
        store_id: parseInt(_self.data.index) + 1,
        dayn: _self.data.chooseDate
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        var model = res.data.data;
        model.forEach(function(item) {
          item.begin_time = item.begin_time.substr(11, 5);
          item.end_time = item.end_time.substr(11, 5);
          item.label = item.label.replace(/ /g, ' · ');
          item.volume = parseInt(item.volume);
          item.appoint_total = parseInt(item.appoint_total);
        })
        _self.setData({
          classList: model
        })
        _self.setHeight();
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 删除课程 [goods_delete]
   * 参数：id
   * 返回:无
   */
  goods_delete: function(id) {
    wx.request({
      url: app.globalData.url + 'mini/storeapi/goods_delete',
      data: {
        id: id
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        console.log(res);
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 删除课程 [goods_done]
   * 参数：id
   * 返回:无
   */
  goods_done: function(id) {
    wx.request({
      url: app.globalData.url + 'mini/storeapi/goods_done',
      data: {
        id: id
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        console.log(res);
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  //界面组件部分
  //====================================================
  // 点击事件汇总
  actionBtn: function(e) {
    var type = e.currentTarget.dataset.action;
    var id = e.currentTarget.dataset.id;
    switch (type) {
      case 'switch':

        break;
      case 'delete':
        _self.goods_delete(id);
        _self.goods_list();
        break;
      case 'setClass':
        wx.navigateTo({
          url: '../goods_add/goods_add?store_id=' + _self.data.gym.id,
        })
        break;
      case 'done':
        _self.goods_done();
        break;
      default:
        break;
    }
  },
  // 获取日期
  getDate() {
    var date = new Date();
    var date2 = new Date((new Date).getTime() + 24 * 60 * 60 * 1000);
    var date3 = new Date((new Date).getTime() + 24 * 60 * 60 * 1000 * 2);
    var date4 = new Date((new Date).getTime() + 24 * 60 * 60 * 1000 * 3);
    var date5 = new Date((new Date).getTime() + 24 * 60 * 60 * 1000 * 4);
    var date6 = new Date((new Date).getTime() + 24 * 60 * 60 * 1000 * 5);
    var zhou = date.getDay()
    _self.setData({
      date1: _self.formatDate(date),
      date2: _self.formatDate(date2),
      date3: _self.formatDate(date3),
      date4: _self.formatDate(date4),
      date5: _self.formatDate(date5),
      date6: _self.formatDate(date6),
      day1: _self.formatDate2(date),
      day2: _self.formatDate2(date2),
      day3: _self.formatDate2(date3),
      day4: _self.formatDate2(date4),
      day5: _self.formatDate2(date5),
      day6: _self.formatDate2(date6),
      week: zhou
    })
  },
  // 格式化日期
  formatDate(date) {
    var years = date.getFullYear();
    var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var week = date.getDay();
    return years + '-' + month + '-' + day
  },
  formatDate2(date) {
    var years = date.getFullYear();
    var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var week = date.getDay();
    return month + '.' + day
  },
  //设置swiper高度
  setHeight() {
    var winHeight = 210 * _self.data.classList.length + 40;
    _self.setData({
      winHeight
    })
  },
  // 滚动切换标签样式
  switchTab: function(e) {
    _self.setData({
      currentTab: e.detail.current
    });
    _self.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    var cur = e.currentTarget.dataset.current;
    var date = e.currentTarget.dataset.date;
    _self.setData({
      chooseDate: date
    })
    if (_self.data.currentTaB == cur) {
      return false;
    } else {
      _self.setData({
        currentTab: cur
      })
      _self.goods_list();
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (_self.data.currentTab > 4) {
      _self.setData({
        scrollLeft: 300
      })
    } else {
      _self.setData({
        scrollLeft: 0
      })
    }
  },
  footerTap: app.footerTap,
  //切换店面的picker
  bindPickerChange: function(e) {
    _self.setData({
      index: e.detail.value
    })
    _self.store_show();
    _self.goods_list();
  }
})