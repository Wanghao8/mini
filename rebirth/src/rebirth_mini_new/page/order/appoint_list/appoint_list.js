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
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self=this;
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
    _self.appoint_list();
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
     * 获取运动预约记录 [appoint_list]
     * 参数：page,limit,acc_id
     * 返回:运动预约记录
     */
  appoint_list: function (e) {
    wx.request({
      url: app.globalData.url + 'mini/orderapi/appoint_list',
      data: {
        page: 1,
        limit: 10,
        acc_id:wx.getStorageSync("acc").id
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        console.log(res)
        var model = res.data.data;
        model.forEach(function(item){
          item.begin_time = item.begin_time.substr(0,16);
          item.end_time = item.end_time.substr(11,5);
          item.add_time = item.add_time.substr(0,16);
        })
        _self.setData({
          list: model
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },


  //界面组件部分
  //====================================================
  openDoor:function(e){
    var info = e.currentTarget.dataset.value;
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '../appoint_show/appoint_show?id=' + id,
    })
  }
  
})