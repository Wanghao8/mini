const app = getApp();
var common = require('../../../static/js/common.js');
var util = require('../../../utils/util.js');
var _self;
Page({
  //路由数据部分
  //============================================================================
  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    date: util.formatTime3(new Date()),
    start_time: '08:00',
    classes: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
    _self.setData({
      store_id:options.store_id
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
    _self.course_list();
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
   * 获取排课内容 [course_list]
   * 参数：page,limit
   * 返回:排课内容
   */
  course_list: function(e) {
    wx.request({
      url: app.globalData.url + 'mini/storeapi/course_list',
      data: {
        page: 1,
        limit: 10
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        console.log(res)
        var model = res.data.data;
        var model1 = [];
        model.forEach(function(item) {
          model1.push(item.name)
        })
        _self.setData({
          classes: model1,
          classInfo: model
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  /**
   * 确认排课内容 [goods_edit]
   * 参数：id,store_id,course_id等
   * 返回:无
   */
  goods_edit: function(e) {
    var end_time = _self.data.date + ' ' + _self.data.start_time;
    end_time= Date.parse(end_time);
    end_time = end_time + _self.data.classInfo[_self.data.index].duration*60000;
    end_time = new Date(end_time);
    end_time=util.formatTime2(end_time);
    if(!_self.data.setNumed){
      _self.setData({
        classNum: _self.data.classInfo[_self.data.index].volume
      })
    }
    wx.request({
      url: app.globalData.url + 'mini/storeapi/goods_edit',
      data: {
        id: 0,
        store_id: _self.data.store_id,
        course_id: _self.data.classInfo[_self.data.index].id,
        dayn: _self.data.date,
        begin_time: _self.data.date + ' ' + _self.data.start_time,
        end_time: end_time,
        volume: _self.data.classNum
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },


  //界面组件部分
  //====================================================
  // 点击事件汇总
  actionBtn: function(e) {
    var type = e.currentTarget.dataset.action;
    switch (type) {
      case 'comfirm':
        _self.goods_edit();
        break;
      default:
        break;
    }
  },
  setClass(e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange1(e) {
    this.setData({
      start_time: e.detail.value
    })
  },
  bindTimeChange2(e) {
    this.setData({
      end_time: e.detail.value
    })
  },
  name(e) {
    _self.setData({
      className: e.detail.value
    })
  },
  num(e) {
    _self.setData({
      classNum: e.detail.value,
      setNumed:true
    })
  },
  
})