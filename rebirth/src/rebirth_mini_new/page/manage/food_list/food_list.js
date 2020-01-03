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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _self=this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //后台接口部分
  //=======================================================


    //界面组件部分
  //====================================================
  // 点击事件汇总
  actionBtn: function (e) {
    var type = e.currentTarget.dataset.action;
    common.showToast('暂未开启')
    return
    switch (type) {
      case 'zhou1':
        wx.navigateTo({
          url: '../food_show/food_show?url=https://mp.weixin.qq.com/s/R-Jp9kpPPXeSGvahXSvjRA',
        })
        break;
      case 'zhou2':
        wx.navigateTo({
          url: '../food_show/food_show?url=https://mp.weixin.qq.com/s/t5gawNoZiujSB5sUCw_-cw',
        })
        break;
      case 'zhou3':
        wx.navigateTo({
          url: '../food_show/food_show?url=https://mp.weixin.qq.com/s/oeE_O5pGhC54IxhmfDN0ow',
        })
        break;
      case 'zhou4':
        wx.navigateTo({
          url: '../food_show/food_show?url=https://mp.weixin.qq.com/s/YI6vWuV75_MlkvEFYMN0TA',
        })
        break;
      case 'zhou5':
        wx.navigateTo({
          url: '../food_show/food_show?url=https://mp.weixin.qq.com/s/FHwuyL-YcWQpdMCKIvL3Ug',
        })
        break;
      case 'zhou6':
        wx.navigateTo({
          url: '../food_show/food_show?url=https://mp.weixin.qq.com/s/8NjYhajOO5WWol-qrIwwGg',
        })
        break;
      case 'zhou7':
        wx.navigateTo({
          url: '../food_show/food_show?url=https://mp.weixin.qq.com/s/nkR2cMqfKGIu5lZ7cM6Fiw',
        })
        break;
      default:
        break;
    }
  },
})