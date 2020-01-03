/**
 * name:购买储物柜页面
 * info:获取邀请码邀请海报，制作邀请海报并保存图片，倒计时更新二维码
 * auth:王豪
 */
var _self;
var common = require("../../../static/js/common.js");
var app = getApp();
var id;
var pages, prevPage;
Page({
  //路由数据部分
  //============================================================================

  data: {
    memcard: [
      { monthlyprice: '99', state: '365', price: '1188', type: '年', },
      { monthlyprice: '99', state: '90', price: '297', type: '季', }
    ],
    statechecked: false,
    id: 5,
    customprice: 1,
    customnumber: 1,
    type: 'month',
    btndisabled: true,
    btnloading: false,
    price: 1,
    storearray: [],
    storeindex: 0,
    uid: 0,
    checked: false,
    use_point: 0
  },
  onLoad: function (options) {
    _self = this;
    pages = getCurrentPages();
    prevPage = pages[pages.length - 2];
  },
  onReady: function () {
    _self.getLoc();
    _self.getstorage();
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
  * 参数：uid：用户唯一识别码
  * 将向服务器请求的用户信息保存到data中
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
 * 后台接口[getstorelist]获取健身房列表
 * 参数：lat:用户所在的纬度，lon:用户所在的经度
 * 将向服务器请求的健身房列表保存到data中
 */
  getstorelist: function (userlatitude, userlongitude) {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/Appoint/storeList',
      data: {
        lat: userlatitude,
        lon: userlongitude,
      },
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('获取健身房列表为空');
          return;
        }
        _self.setData({
          storearray: model
        });
      },
      fail() {
        common.requestfail();
        return;
      }
    })
  },
  /**
  * 后台接口[getstorelist]支付
  * 参数：uid：用户唯一识别码,type,num,store_id,use_point
  * 向服务器发送请求返回成功后调用wx.requestPayment发起微信支付
  */
  paymentyes: common.throttle(function () {
    _self.setData({
      btndisabled: true,
      btnloading: true
    });
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/locker/getconfig',
      data: {
        type: _self.data.type,
        uid: _self.data.uid,
        num: _self.data.customnumber,
        store_id: _self.data.storearray[_self.data.storeindex].id,
        use_point: _self.data.use_point
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
            title: '租赁成功！',
            icon: 'success',
            duration: 1500
          });
          if (prevPage) {
            prevPage.onReady();
          }
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
                  title: '租赁成功！',
                  icon: 'success',
                  duration: 1500
                });
                if (prevPage) {
                  prevPage.onReady();
                }
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
                title: '租赁失败',
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

  // 获取经纬度
  getLoc: function () {
    _self.getstorelist(0, 0);
    return
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        _self.getstorelist(res.latitude, res.longitude);
      },
      fail(res) {
        _self.getsetting();
      }
    })
  },
  // 获取经纬度授权
  getsetting: function () {
    wx.showModal({
      content: '获取您的位置将获得更好体验！',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          wx.openSetting({
            success(res) {
              if (res.authSetting["scope.userLocation"] == true) {
                _self.onReady();
              } else if (res.authSetting["scope.userLocation"] == false) {
                _self.getsetting();
              }
            },
            fail() {
              _self.getsetting();
            }
          });
        }
      }
    });
  },
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
  // 选择健身房
  storepickchange: function (e) {
    console.log(e)
    _self.setData({
      storeindex: e.detail.value,
      dateshow: false
    });
  },
  // 选择时长
  ChoseMemcard: function (e) {
    var type;
    if (e.currentTarget.dataset.type == '年') {
      type = 'year'
    } else if (e.currentTarget.dataset.type == '季') {
      type = 'season'
    } else if (e.currentTarget.dataset.type == 'month') {
      type = 'month';
    }
    _self.setData({
      id: e.currentTarget.dataset.id,
      price: e.currentTarget.dataset.price,
      type: type,
      customnumber: 1,
    })
    if (e.currentTarget.dataset.type == 'day') {
      _self.setData({
        price: 99,
        customprice: 99
      });
    }
  },
  //支付提示
  payment: function () {
    wx.showModal({
      content: '确认租赁' + _self.data.storearray[_self.data.storeindex].name + '的专属储物柜?',
      success(res) {
        if (res.confirm) {
          _self.paymentyes();
        } else if (res.cancel) {
          return;
        }
      }
    })
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

  //   numbersubtraction: function () {
  //   if (_self.data.customnumber > 1) {
  //     var customnumber = _self.data.customnumber - 1;
  //     _self.setData({
  //       customnumber: _self.data.customnumber - 1,
  //       customprice: customnumber * 99,
  //       price: customnumber * 99
  //     })
  //   }
  // },

  // customnumber: function () {
  //   if (_self.data.customnumber < 12) {
  //     var customnumber = _self.data.customnumber + 1;
  //     _self.setData({
  //       customnumber: _self.data.customnumber + 1,
  //       customprice: customnumber * 99,
  //       price: customnumber * 99
  //     })
  //   }
  // },

})