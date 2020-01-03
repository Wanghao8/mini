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
    show_detail: false
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
    _self.acc_show()
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
   * 微信请求用户实体信息 [acc_show]
   * 参数：acc_id
   * 返回用户实体信息
   */
  acc_show: function() {
    wx.request({
      url: app.globalData.url + 'mini/manageapi/acc_show?acc_id=' + wx.getStorageSync('acc').id,
      method: 'post',
      success(res) {
        if (!res.data.res) {
          common.apiFalse("获取用户信息失败", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var model = res.data.data;
        model.timecard1 = model.timecard.replace(/-/, '年');
        model.timecard1 = model.timecard1.replace(/-/, '月');
        model.timecard1 = model.timecard1 + '日 到期';
        model.uid = parseInt(model.id) + 1000000
        _self.setData({
          info: model
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  /**
   * 充值接口 [consume_pay]
   * 参数：type,name,acc_id等
   * 返回:无
   */
  consume_pay: function(type, name, money, value) {
    wx.request({
      url: app.globalData.url + 'mini/orderapi/consume_pay',
      data: {
        type: type,
        name: name,
        acc_id: wx.getStorageSync('acc').id,
        money: money,
        value: value
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        console.log(res);
        wx.showToast({
          title: '充值成功',
        })
        _self.acc_show();
      },
      fail(res) {
        console.log(res);
      }
    })
  },

  //界面组件部分
  //====================================================
  actionBtn: function(e) {
    var action = e.currentTarget.dataset.action;
    var type = e.currentTarget.dataset.type;
    var value = e.currentTarget.dataset.value;
    var money = e.currentTarget.dataset.money;
    var name = e.currentTarget.dataset.name;
    switch (action) {
      case 'buy':
        wx.showModal({
          title: '提示',
          content: '确认' + name + '?',
          success(res) {
            if (res.confirm) {
              _self.consume_pay(type, name, money, value)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
      case 'history':
        wx.navigateTo({
          url: '../consume_list/consume_list',
        })
      default:
        break;
    }
  },

  detail: function() {
    _self.setData({
      show_detail: true
    })
  },
  cancel_detail: function() {
    _self.setData({
      show_detail: false
    })
  }
})