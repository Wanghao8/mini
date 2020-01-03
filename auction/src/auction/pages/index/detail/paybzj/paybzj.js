const app = getApp();
var common = require('../../../../static/js/common.js');
var _self;
Page({

  //数据路由部分
  //============================================================
  /**
   * 页面的初始数据
   */
  data: {
    sessionKey: '',
    nickName: '您的昵称',
    phone: '获取手机号码',
    bond_price: 0,
    goods_id: 0,
    openid: '',
    readed: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
    _self.setData({
      goods_id: options.goods_id,
      bond_price: options.bond_price
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    _self.wxlogin();
    _self.acc_show();
  },
  /**
   * 路由部分点击操作
   */
  actionBtn: function(e) {
    var action = e.currentTarget.dataset.action;
    var value = e.currentTarget.dataset.value;
    switch (action) {
      case 'infoTips':
        wx.showModal({
          title: '明智拍卖提示',
          showCancel: false,
          content: '保证金可用来保障交易双方的权益，在产生纠纷时，过失方将赔付保证金给守约方，以减少守约方的损失'
        });
        break;
      case 'xieyiTips':
        wx.showModal({
          title: '明智拍卖协议',
          showCancel: false,
          content: '在产生纠纷时，过失方将赔付保证金给守约方，以减少守约方的损失'
        });
        break;
      case 'bondAddBtn':
        _self.goods_bond_add_model();
        break;
      default:
        break;
    }
  },
  //后台接口部分
  //=======================================================
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
        _self.setData({
          nickName: model.nickName == '' ? '您的昵称' : model.nickName,
          phone: model.phone == '' ? '获取手机号码' : model.phone
        });
      },
      fail(res) {
        common.requestFail('用户信息获取失败');
        return;
      }
    })
  },
  /**
   * 执行用户信息修改 [acc_edit_info]
   * 参数 acc_id
   * 返回实体信息
   */
  acc_edit_info: function(model) {
    common.showLoading("正在修改");
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
  /**
   * 执行用户手机号修改 [acc_edit_phone]
   * 参数 acc_id
   * 返回实体信息
   */
  acc_edit_phone: function(model) {
    common.showLoading("正在修改");
    wx.request({
      url: app.globalData.url + 'mini/manageapi/acc_edit_phone',
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
        common.hideLoading();
        common.requestFail('用户信息修改失败');
        return;
      }
    });
  },
  /**
   * 保证金缴纳接口 [goods_bond_add]
   * 用户id 商品id 保证金额
   */
  goods_bond_add: function(model) {
    wx.request({
      url: app.globalData.url + 'mini/goodsapi/goods_bond_add',
      data: model,
      method: 'post',
      header: common.headerForm,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("接口请求未完成", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var model = res.data.data;
        console.log(model);
        wx.requestPayment({
          'timeStamp': model.timeStamp,
          'nonceStr': model.nonceStr,
          'package': model.package,
          'signType': model.signType,
          'paySign': model.paySign,
          'success': function(res) {
            if (res.errMsg == "requestPayment:ok") {
              wx.showToast({
                title: '充值成功！',
                icon: 'success',
                duration: 1500
              });
              setTimeout(function() {
                wx.navigateBack({});
              }, 1500)
              wx.showModal({
                title: '交纳保证金成功',
                content: '点击确定返回',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                   
                  } else if (res.cancel) {};
                }
              });
            }
          },
          'fail': function(res) {
            wx.showToast({
              title: '充值失败',
              icon: 'none',
              duration: 1500
            });
          }
        })
      },
      fail(res) {
        common.requestFail('获取失败');
        return;
      },
    });
  },
  /**
   * 获得sessionKey值 [code2Session]
   * 参数 code
   * 返回用户实体信息
   */
  code2Session: function(code) {
    wx.request({
      url: app.globalData.url + 'mini/manageapi/code2Session?code=' + code,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("获取code失败", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var model = res.data.data;
        _self.setData({
          sessionKey: model.session_key
        });
      },
      fail(res) {
        common.requestFail('后台登录接口，执行失败');
        return;
      }
    });
  },


  //界面组件部分
  //====================================================
  // 改变协议是否已读状态
  changeReaded: function(e) {
    var readed = _self.data.readed;
    readed = !readed;
    _self.setData({
      readed: readed
    });
  },
  //采集保证金参数
  goods_bond_add_model: function() {
    var model = {
      acc_id: wx.getStorageSync("acc").id,
      goods_id: _self.data.goods_id,
      openid: wx.getStorageSync("acc").openid,
      money: _self.data.bond_price,
      phone: _self.data.phone,
    };
    if (model.phone.length != 11) {
      common.showToast("手机号不可为空");
      return;
    };
    if (_self.data.nickName == "您的昵称") {
      common.showToast("昵称不能为空");
      return;
    };
    if (!_self.data.readed) {
      common.showToast("请先同意拍卖协议");
      return;
    };
    wx.showModal({
      title: '确认缴纳' + model.money + "元保证金",
      content: '缴纳后可参与商品拍卖，违约后将进行赔付，正常竞拍未拍中将自动退还',
      success(res) {
        if (res.confirm) {

          _self.goods_bond_add(model);
          return;
        }
        common.showToast('取消了本次操作');
      }
    });
  },
  /**
   * 微信登录code [wxlogin] 
   * 小程序直接请求code
   * 返回code
   */
  wxlogin: function() {
    wx.login({
      success(res) {
        _self.code2Session(res.code);
      }
    });
  },

  /**
   * 微信获取用户信息实体
   */
  bindGetUserInfo(e) {
    var model = e.detail.userInfo;
    model.acc_id = wx.getStorageSync("acc").id;
    _self.acc_edit_info(model);
  },
  /**
   * 手机号码重新变更修改
   */
  getPhoneNumber: function(e) {
    if (e.detail.errMsg != "getPhoneNumber:ok") {
      common.showToast('获取手机号失败');
      return;
    };
    var dataParam = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      sessionKey: _self.data.sessionKey,
      acc_id: wx.getStorageSync("acc").id
    }
    if (dataParam.sessionKey == "") {
      common.showToast("返回重新打开当前页面");
      return;
    }
    _self.acc_edit_phone(dataParam);
  }
})