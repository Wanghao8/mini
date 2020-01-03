// pages/mine/Q&A/Q&A.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qa: [{
      q: '什么是保证金，什么情况下要设置？',
      a: ['保证金额度由拍卖发起人设置，发起人与竞拍人都需交纳。未中拍者保证金在拍卖结束后自动退还。', '拍卖结束后，发起人与中拍人可主动要求退还保证金，或等待7天后自动退还保证金，若有任一方违约，请在系统内提交纠纷仲裁，核实后保证金将赔付另外一方。', '设置保证金可以有效保护买卖双方利益，推荐发起者操作设定。']
    }, {
      q: '微拍一下平台收手续费吗？',
      a: ['竞拍者参与任何拍卖，均不扣取手续费。', '发起者自发传播的私人拍卖，不收取手续费。'],
    }]
  },
  share: function() {
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
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
    * 下拉刷新组件
    */
  onPullDownRefresh: function () {
    var page = this.data.page;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    // 隐藏导航栏加载框
    setTimeout(function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1000);
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

  }
})