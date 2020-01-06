const app = getApp();
var common = require('../../../static/js/common.js');
var _self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gender:['未设置','男','女'],
    list: [
      //   {
      //   avatarUrl: 'http://rebirths.yuanfangyun.com/201912315e0b0e1259ff3145.jpg',
      //   nickName: '知行合一'
      // }, 
      //   {
      //   avatarUrl: 'http://rebirths.yuanfangyun.com/201912315e0b0e1259ff3145.jpg',
      //   nickName: '知行合一'
      // }, 
      //   {
      //   avatarUrl: 'http://rebirths.yuanfangyun.com/201912315e0b0e1259ff3145.jpg',
      //   nickName: '知行合一'
      // }, 
      //   {
      //   avatarUrl: 'http://rebirths.yuanfangyun.com/201912315e0b0e1259ff3145.jpg',
      //   nickName: '知行合一'
      // }, 
      //   {
      //   avatarUrl: 'http://rebirths.yuanfangyun.com/201912315e0b0e1259ff3145.jpg',
      //   nickName: '知行合一'
      // }, 
      //   {
      //   avatarUrl: 'http://rebirths.yuanfangyun.com/201912315e0b0e1259ff3145.jpg',
      //   nickName: '知行合一'
      // }, 
      //   {
      //   avatarUrl: 'http://rebirths.yuanfangyun.com/201912315e0b0e1259ff3145.jpg',
      //   nickName: '知行合一'
      // }, 
      //   {
      //   avatarUrl: 'http://rebirths.yuanfangyun.com/201912315e0b0e1259ff3145.jpg',
      //   nickName: '知行合一'
      // }, 
      //   {
      //   avatarUrl: 'http://rebirths.yuanfangyun.com/201912315e0b0e1259ff3145.jpg',
      //   nickName: '知行合一'
      // }, 
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
    _self.setData({
      id: options.id
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
    _self.goods_show();
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
   * 获取预约信息 [goods_show]
   * 参数：id,acc_id
   * 返回:预约信息
   */
  goods_show(e) {
    wx.request({
      url: app.globalData.url + 'mini/storeapi/goods_show',
      data: {
        id: _self.data.id,
        acc_id: wx.getStorageSync('acc').id
      },
      method: 'get',
      header: common.headerForm,
      success(res) {
        if (res.data.data.acc_list.length == 0) {
          return
        }
        var model = res.data.data.acc_list;
        model.forEach(function(item) {
          item.avatarUrl = app.globalData.imgUrl + item.avatarUrl;
          item.add_time = item.add_time.replace(/-/,"年")
          item.add_time = item.add_time.replace(/-/,"月")
          item.add_time = item.add_time.replace(/ /,"日")
        })
        console.log(model)
        _self.setData({
          list: model
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  /**
   * 微信请求用户实体信息 [acc_show]
   * 参数：acc_id
   * 返回用户实体信息
   */

  acc_show: function(id) {
    wx.request({
      url: app.globalData.url + 'mini/manageapi/acc_show?acc_id=' + id,
      method: 'post',
      success(res) {
        //wx.setStorageSync('acc', res.data.data);
        var model = res.data.data;
        model.avatarUrl = app.globalData.imgUrl + model.avatarUrl;
        // if(!model.gender){
        //   model.gender = 0
        // }
        _self.setData({
          info: model,
          // date: model.birthday,
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  //界面组件部分
  //====================================================
  detail(e) {
    var id = e.currentTarget.dataset.value
    _self.setData({
      showDetail: true
    });
    _self.acc_show(id)
  },
  cancel_detail: function() {
    _self.setData({
      showDetail: false
    })
  }
})