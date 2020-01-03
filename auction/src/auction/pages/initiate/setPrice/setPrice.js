// pages/initiate/setPrice/setPrice.js
var _self;
Page({
  //路由数据部分
  //============================================================================
  /**
   * 页面的初始数据
   */
  data: {
    start_price: '',
    range_price: '',
    bond_price: '',
    baoliu: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
    console.log("123", options.bond_price)
    if (options.bond_price) {
      _self.setData({
        bond_price: options.bond_price,
        start_price: options.start_price,
        range_price: options.range_price
      });
    }
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
  //接口请求部分
  //============================================================================


  //界面组件部分
  //============================================================================
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

  bindKeyInput: function(e) {
    var value = e.detail.value;
    var index = e.target.dataset.index;
    switch (index) {
      case '1':
        _self.setData({
          start_price: value
        });
        break;
      case '2':
        _self.setData({
          range_price: value
        });
        break;
      case '3':
        _self.setData({
          bond_price: value
        });
        break;
      default:
        break;
    };
  },
 
  comfirm: function() {
    var prevPage = getCurrentPages()[getCurrentPages().length - 2]; //获取上一个页面栈
    prevPage.setPrice1(_self.data.start_price, _self.data.range_price, _self.data.bond_price);
    wx.navigateBack({
      delta: 1
    });
  }
})

// data: {
//   bzjindex: 3,
//   bzj: ['0元', '1元', '5元', '10元', '20元', '50元', '100元', '200元', '500元', '1000元'],
//   bzjnum: [0, 1, 5, 10, 20, 50, 100, 200, 500, 1000]
// }

// choosebzj: function(e) {
//   _self.setData({
//     bzjindex: e.detail.value,
//   });
//   _self.setData({
//     bond_price: _self.data.bzjnum[_self.data.bzjindex]
//   });
// },

// switchBaoliu: function(e) {
//   _self.setData({
//     baoliu: e.detail.value
//   });
// },