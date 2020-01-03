/**
 * name:礼品卡支付页面
 * info:选择不同类型和数量的礼品卡，发起支付
 * auth:王豪
 */
var _self;
var common = require("../../../static/js/common.js");
var app = getApp();
Page({
  //路由数据部分
  //============================================================================
  data: {
    imgwidth: 345,
    id: 0,
    payprice: 0,
    quantity: 1,
    price: 10080,
    type: 'year',
    model: [],
    btndisabled: false,
    btnloading: false,
    use_point: 0,
    checked: false,
    uid: 0,
    showtips: false
  },
  onLoad: function (options) {
    _self = this;
    if (options.model) {
      var model = JSON.parse(options.model);
      _self.setData({
        model: model
      });
    }
    let mobile = wx.getSystemInfoSync();
    let ratio = mobile.windowWidth / 375;
    _self.setData({
      imgwidth: 345 * ratio,
    });
  },
  onReady: function () {
    _self.setData({
      quantity: 1,
      type: 'year',
      uid: 0,
      id: 0,
      btndisabled: false,
      btnloading: false,
      checked: false,
      use_point: 0
    });
    _self.getstorage();
  },
  //接口请求部分
  //============================================================================
  /**
	 * 后台接口[getUserById]获取用户信息
	 * 参数：uid
	 * 调用接口获取用户信息，成功后存入data中
	 */
  // 获取用户信息
  getUserById: function (uid) {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/user/getinfo?uid=' + uid,
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('获取用户为空');
          return;
        }
        _self.setData({
          user: model
        });
      },
      fail() {
        common.requestfail();
        return;
      }
    })
  },
  /**
	 * 后台接口[paygiftcard]支付礼品卡
	 * 参数：uid,type,num,use_point,gift_id
	 * 调用接口发送支付请求，成功后调用wx.requestPayment接口发起微信支付
	 */
  paygiftcard: common.throttle(function () {
    _self.setData({
      btndisabled: true,
      btnloading: true
    });
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/wxpay/getconfig',
      data: {
        uid: _self.data.uid,
        type: _self.data.type,
        num: _self.data.quantity,
        use_point: _self.data.use_point,
        gift_id: _self.data.model.id
      },
      success(res) {
        if (res.data.code == 100) {
          common.apirequestfail(res.data.msg);
          _self.setData({
            btndisabled: false,
            btnloading: false
          });
          return;
        }
        if (res.data.code == 201) {
          wx.showToast({
            title: '购买成功！',
            icon: 'success',
            duration: 1500
          });
          _self.setData({
            btndisabled: false,
            btnloading: false
          });
          setTimeout(function () {
            wx.navigateBack({
            });
          }, 1500)
          return;
        }
        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('获取支付失败');
          _self.setData({
            btndisabled: false,
            btnloading: false
          });
          return;
        }
        wx.requestPayment(
          {
            'timeStamp': model.timeStamp,
            'nonceStr': model.nonceStr,
            'package': model.package,
            'signType': model.signType,
            'paySign': model.paySign,
            'success': function (res) {
              if (res.errMsg == "requestPayment:ok") {
                wx.showToast({
                  title: '购买成功！',
                  icon: 'success',
                  duration: 1500
                });
                _self.setData({
                  btndisabled: false,
                  btnloading: false
                });
                setTimeout(function () {
                  wx.navigateBack({
                  });
                }, 1500)
              }
            },
            'fail': function (res) {
              wx.showToast({
                title: '购买失败',
                icon: 'none',
                duration: 1500
              });
              _self.setData({
                btndisabled: false,
                btnloading: false
              });
            }
          })
      },
      fail() {
        common.requestfail();
        _self.setData({
          btndisabled: false,
          btnloading: false
        });
        return;
      }
    })
  }, 2000),
  //界面组件部分
  //============================================================================
  // 获取缓存
  getstorage: function () {
    wx.getStorage({
      key: 'user',
      success(res) {
        _self.setData({
          uid: res.data.uid
        });
        _self.getUserById(res.data.uid);
      },
      fail() {
        wx.reLaunch({
          url: '../../order/index/index'
        })
      }
    })
  },
  //判断选中单选按钮
  radiocheck: function () {
    if (_self.data.checked == false) {
      _self.setData({
        checked: true,
        use_point: 1
      });
    } else if (_self.data.checked == true) {
      _self.setData({
        checked: false,
        use_point: 0
      });
    }
  },
  //选择卡的类型
  choosetype: function (e) {
    var model = e.currentTarget.dataset
    _self.setData({
      id: model.id
    });
    if (model.id == 0) {
      _self.setData({
        price: 10080,
        type: 'year'
      });
    } else if (model.id == 1) {
      _self.setData({
        price: 3168,
        type: 'season'
      });
    } else if (model.id == 2) {
      _self.setData({
        price: 1200,
        type: 'month'
      });
    } else if (model.id == 3) {
      _self.setData({
        price: 120,
        type: 'time'
      });
    }
  },
  //减少购买个数
  reduce: function () {
    if (_self.data.quantity > 1) {
      _self.setData({
        quantity: _self.data.quantity - 1
      })
    }
  },
  //增加购买个数
  increase: function () {
    if (_self.data.quantity < 6) {
      _self.setData({
        quantity: _self.data.quantity + 1
      })
    }
  },
  //显示小提示
  showtips: function () {
    if (_self.data.showtips == false) {
      _self.setData({
        showtips: true
      })
    } else if (_self.data.showtips == true) {
      _self.setData({
        showtips: false
      })
    }
  }
})