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
    _self.consume_list();
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
   * 获取充值记录 [consume_list]
   * 参数：page,limit,acc_id
   * 返回:充值记录
   */
  consume_list:function(e){
    wx.request({
      url: app.globalData.url + 'mini/orderapi/consume_list',
      data:{
        page:1,
        limit:10,
        acc_id:wx.getStorageSync('acc').id
      },
      method:'post',
      header: common.headerForm,
      success(res){
        if (!res.data.res) {
          common.apiFalse("消费记录获取失败", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var model = res.data.data;
        model.forEach(function(item){
          item.add_time = item.add_time.substr(0, 16);
          item.add_time = item.add_time.replace(/-/,'年');
          item.add_time = item.add_time.replace(/-/,'月');
          item.add_time = item.add_time.replace(/ /,'日 ');
          if(item.nature=='income'){
            item.jiajian = '+'
          }else{
            item.jiajian = '-'
          }
          if (item.type =='income_days'){
            item.tianci = '天';
            item.xvfei = '续费'
          }else{
            item.tianci = '次';
            item.xvfei = '次卡剩余'
          }
          if(item.timecard!='0'){
            item.lave = item.timecard.replace(/-/,'年');
            item.lave = item.lave.replace(/-/,'月');
            item.lave = item.lave+'日'
          }else{
            item.lave = item.oncecard;
            item.ci = true
          }
        })
        _self.setData({
          list:model
        })
      },
      fail(res){
        common.apiFalse("请求接口失败，未能获取消费记录")
      }
    })
  }

  //界面组件部分
  //====================================================
})