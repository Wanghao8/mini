/**
 * name:充值会员卡页面
 * info:选择不同的会员卡进行充值
 * auth:王豪
 */
var _self;
var common = require("../../../static/js/common.js");
var app = getApp();
var id;
Page({
  //路由数据部分
  //============================================================================
  data: {
    // memcard:[
    // 	{monthlyprice:'149',state:'365',price:'1788',UnitPrice:'299',type:'年',},
    // 	{monthlyprice:'249',state:'90',price:'747',UnitPrice:'349',type:'季',},
    // 	{monthlyprice:'299',state:'30',price:'299',UnitPrice:'399',type:'月',},
    // ],
    id: 5,
    price: 120,
    customprice: 66,
    customnumber: 1,
    type: 'year',
    uid: 0,
    btndisabled: true,
    btnloading: false,
    checked: false,
    use_point: 0,
    statechecked: false,
    imgwidth: 340
  },
  onLoad: function (options) {
    _self = this;
    let mobile = wx.getSystemInfoSync();
    let ratio = mobile.windowWidth / 375;
    _self.setData({
      imgwidth: 340 * ratio,
    });
  },
  onReady: function () {
    _self.setData({
      customnumber: 1,
      type: 'time',
      uid: 0,
      id: 5,
      btndisabled: true,
      btnloading: false,
      checked: false,
      use_point: 0
    });
    _self.getstorage();
  },
  ToRRecord: function () {
    wx.navigateTo({
      url: '../../order/rechargerecord/rechargerecord'
    })
  },
  Torefund: function () {
    wx.navigateTo({
      url: '../../order/refund/refund'
    })
  },
  tostate: function () {
    wx.navigateTo({
      url: '../../order/statement/statement'
    })
  },
  //接口请求部分
  //============================================================================
  /**
	 * 后台接口[getUserById]获取用户信息
	 * 参数：uid
	 * 调用接口获取用户信息，成功后保存到data中
	 */
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
          model: model
        });
      },
      fail() {
        common.requestfail();
        return;
      }
    })
  },
  /**
	 * 后台接口[payment]发起支付
	 * 参数：uid，type，num，use_point
	 * 调用接口发起支付成功后调用wx.requestPayment进行微信支付
	 */
  payment: common.throttle(function () {
    _self.setData({
      btndisabled: true,
      btnloading: true
    });
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/wxpay/getconfig',
      data: {
        uid: _self.data.uid,
        type: _self.data.type,
        num: _self.data.customnumber,
        // num: 10,
        use_point: _self.data.use_point,
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
            title: '充值成功！',
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
        wx.requestPayment({
          'timeStamp': model.timeStamp,
          'nonceStr': model.nonceStr,
          'package': model.package,
          'signType': model.signType,
          'paySign': model.paySign,
          'success': function (res) {
            if (res.errMsg == "requestPayment:ok") {
              wx.showToast({
                title: '充值成功！',
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
              title: '充值失败',
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
  // 选择卡的类型
  ChoseMemcard: function (e) {   //点击卡片
    console.log(e)
    var type;
    if (e.currentTarget.dataset.type == '年卡') {
      type = 'year';
    } else if (e.currentTarget.dataset.type == '月卡') {
      type = 'month';
    } else if (e.currentTarget.dataset.type == '季卡') {
      type = 'season';
    } else if (e.currentTarget.dataset.type == '100次卡') {
      type = 'hundred';
    } else if (e.currentTarget.dataset.type == '1次卡') {
      type = 'time';
    } else if (e.currentTarget.dataset.type == '10次卡') {
      type = 'xun';
    }
    _self.setData({
      id: e.currentTarget.dataset.id,
      price: e.currentTarget.dataset.price,
      type: type,
      customnumber: 1,
    })

    // if(e.currentTarget.dataset.type == 'day'){
    // 	_self.setData({
    // 		price:66,
    // 		customprice:66
    // 	});
    // }

  },
  //判断选中协议单选按钮
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
  //单选按钮选择状态
  stateradiocheck: function () {
    if (_self.data.statechecked == false) {
      _self.setData({
        statechecked: true,
        btndisabled: false
      });
    } else if (_self.data.statechecked == true) {
      _self.setData({
        statechecked: false,
        btndisabled: true
      });
    }
  },


  // numbersubtraction: function () {
  //   if (_self.data.customnumber > 1) {
  //     var customnumber = _self.data.customnumber - 1;
  //     _self.setData({
  //       customnumber: _self.data.customnumber - 1,
  //       customprice: customnumber * 66,
  //       price: customnumber * 66
  //     })
  //   }
  // },

  // customnumber: function () {
  //   if (_self.data.customnumber < 6) {
  //     var customnumber = _self.data.customnumber + 1;
  //     _self.setData({
  //       customnumber: _self.data.customnumber + 1,
  //       customprice: customnumber * 66,
  //       price: customnumber * 66
  //     })
  //   }
  // },
})