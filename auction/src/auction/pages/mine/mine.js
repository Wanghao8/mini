var _self;
var app = getApp();
var common = require("../../static/js/common.js");
Page({
  //路由数据部分
  //============================================================================
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickName: '点击微信登录',
      avatarUrl: '../../static/4+.png',
      goods_total: 0,
      add_total: 0
    }
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
  onShow: function () {
    _self.acc_show();
  },
  //按钮点击事件汇总
  actionBtn: function(e) {
    var action = e.currentTarget.dataset.action;
    switch (action) {
      case 'recognizance':
        //跳转到保证金记录页面
        wx.navigateTo({
          url: './recognizance/recognizance',
        });
        break;
        // case 'all':
        //   //跳转到参与竞拍页面
        //   wx.switchTab({
        //     url: '../joined/joined',
        //   });
        //   break;
        // case 'bid':
        //   //跳转到赢得竞拍页面
        //   wx.navigateTo({
        //     url: './winbid/winbid',
        //   });
        //   break;
      case 'manage':
        //跳转到交易记录页面
        wx.navigateTo({
          url: './manage/manage',
        });
        break;
      case 'question':
        //跳转到常见问题页面
        wx.navigateTo({
          url: './question/question',
        });
        break;
      case 'initiate':
        //跳转到发布拍品页面
        if (_self.data.userInfo.nickName == "点击微信登录") {
          common.showToast("请先微信登录");
          return;
        };
        wx.navigateTo({
          url: '../initiate/initiate',
        });
        break;
      default:
        break;
    };
  },

  //接口请求部分
  //============================================================================
  /**
   * 获取用户信息 [acc_show]
   * 参数 acc_id
   * 返回实体信息
   */
  acc_show: function() {
    wx.request({
      url: app.globalData.url + 'mini/manageapi/acc_show',
      data: {
        acc_id: wx.getStorageSync("acc").id
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        if (!res.data) {
          common.apiFalse("接口请求未完成", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var model = res.data.data;
        model.nickName = model.nickName == "" ? '点击微信登录' : model.nickName;
        model.avatarUrl = model.avatarUrl == "" ? "../../static/4+.png" : app.globalData.qiniuUrl + model.avatarUrl;
        _self.setData({
          userInfo: model
        });
      },
      fail(res) {
        common.requestFail('用户信息获取失败');
        return;
      }
    });
  },
  /**
   * 执行用户信息修改 [acc_edit_info]
   * 参数 acc_id
   * 返回实体信息
   */
  acc_edit_info: function(model) {
    common.showLoading("正在登陆");
    wx.request({
      url: app.globalData.url + 'mini/manageapi/acc_edit_info',
      data: model,
      method: 'post',
      header: common.headerForm,
      success(res) {
        common.hideLoading();
        if (!res.data.res) {
          common.apiFalse("接口请求未完成", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        _self.acc_show();
      },
      fail(res) {
        common.requestFail('用户信息修改失败');
        common.hideLoading();
        return;
      }
    });
  },

  //界面组件部分
  //============================================================================
  /**
  * 下拉刷新组件
  */
  onPullDownRefresh: function () {
    var page = _self.data.page;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    // 隐藏导航栏加载框
    setTimeout(function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1000);
  },
  //获取用户信息保存到data里
  bindGetUserInfo(e) {
    var model = e.detail.userInfo;
    model.acc_id = wx.getStorageSync("acc").id;
    _self.acc_edit_info(model);
  }
})