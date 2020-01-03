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
    fullLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
    _self.setData({
      // info:JSON.parse(options.info),
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    _self.appoint_show();
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
   * 获取预约实体信息和状态信息 [appoint_show]
   * 参数：id
   * 返回:预约实体信息和状态信息
   */
  appoint_show: function(e) {
    wx.request({
      url: app.globalData.url + 'mini/orderapi/appoint_show',
      data: {
        id: _self.data.id
      },
      method: 'get',
      header: common.headerForm,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("预约信息不存在", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var model = res.data.data;
        model.leftTime = model.start_time - model.current_time
        model.url = app.globalData.url + model.url
        model.begin_time = model.begin_time.substr(5, 11);
        model.begin_time = model.begin_time.replace(/-/,'月');
        model.begin_time = model.begin_time.replace(/ /,'日 ');
        model.end_time = model.end_time.substr(11, 5);
        model.add_time = model.add_time.substr(0, 16);
        _self.setData({
          list: model,
          fullLoading: false
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  /**
   * 取消预约 [appoint_cancel]
   * 参数：id
   * 返回:无
   */
  appoint_cancel:function(){
    wx.request({
      url: app.globalData.url + 'mini/orderapi/appoint_cancel',
      data:{
        id:_self.data.id
      },
      method:'get',
      header:common.headerForm,
      success(res){
        if (!res.data.res) {
          common.apiFalse("预约取消失败", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        wx.showModal({
          title: '提示',
          content: '取消预约成功,是否返回首页',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../../store/course_list/course_list',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      fail(){
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
      case 'look':
        wx.showModal({
          title: '提示',
          content: '请将二维码对准健身房门口的门禁读码器，听到滴一声即可推门进入！',
          showCancel: false
        })
        break;
      case 'cancel':
      wx.showModal({
        title: '警告',
        content: '确认取消课程？',
        success(res){
          if (res.confirm) {
            console.log('用户点击确定')
            _self.appoint_cancel();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
        break;
      case 'back':
        wx.switchTab({
          url: '../../store/course_list/course_list',
        });
        break;
      default:
        break;
    }
  }
})