/**
 * name:激活礼品卡页面
 * info:获取用户信息通过用户信息激活用户的礼品卡
 * auth:王豪
 */
var _self;
var common = require("../../../static/js/common.js");
var app = getApp();
var WXBizDataCrypt = require('../../../static/js/RdWXBizDataCrypt.js');
var appid = 'wxfd9d19ecda4a0e3f';
Page({
  //路由数据部分
  //============================================================================
  data: {
    model: [],
    openid: 0,
    nickName: 0,
    avatarUrl: '',
    phone: 0,
    userinfobtn: false,
    userloginbtn: false,
    uid: 0
  },
  onLoad: function (options) {
    _self = this;
    if (options.giftinfo) {
      var model = JSON.parse(options.giftinfo);
      _self.setData({
        model: model
      });
    } else {
      wx.reLaunch({
        url: '../../order/index/index'
      })
    }
    let mobile = wx.getSystemInfoSync();
    let ratio = mobile.windowWidth / 375;
    _self.setData({
      imgwidth: 345 * ratio,
    });
  },
  onReady: function () {

  },
  //接口请求部分
  //============================================================================

  /**
    * 后台接口[getOpenid]获取openid
    * 参数：code
    * 调用接口获取openid，成功后保存到data中，然后调用getUserByOpenid
   */
  getOpenid: function (code) {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/user/openid?jscode=' + code,
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('获取openid为空');
          return;
        }
        _self.setData({
          openid: model.openid,
        });
        _self.getUserByOpenid(model.openid);
      },
      fail(res) {
        common.requestfail();
        return;
      }
    })
  },
  /**
	 * 后台接口[getUserByOpenid]查询用户信息
	 * 参数：openid
	 * 调用接口查询用户信息，成功后调用getUserById
	*/
  getUserByOpenid: function (openid) {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/user/getuid?openid=' + openid,
      success(res) {
        if (res.data.code == 403) {
          wx.hideLoading();
          _self.setData({
            userinfobtn: true,
          });
        }
        if (res.data.code == 200) {
          var model = res.data.result;
          if (model == '') {
            common.apimodelerror('查询用户为空');
            return;
          }
          _self.getUserById(model.uid);
        }
      },
      fail(res) {
        common.requestfail();
        return;
      }
    })
  },
  /**
	 * 后台接口[getUserById]获取用户信息
	 * 参数：uid
	 * 调用接口获取用户信息，成功后保存到localstorage中和data中，然后调用activation激活礼品卡
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
        if (model.status == -1) {
          wx.showModal({
            title: '账号已被禁用',
            content: '请联系技术人员 13298125901',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                _self.onReady();
              }
            }
          });
          return;
        }
        wx.setStorageSync('user', {
          uid: model.uid,
          status: model.status
        });
        _self.setData({
          uid: model.uid
        });
        _self.activation();
      },
      fail() {
        common.requestfail();
        return;
      }
    })
  },
  /**
  * 后台接口[activation]激活礼品卡
  * 参数：use_uid,id
  * 调用接口激活礼品卡
 */
  activation: function () {
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    if (_self.data.uid > 0) {
      wx.request({
        url: app.globalData.miniserverUrl + 'rebirth/gift/useUp',
        data: {
          use_uid: _self.data.uid,
          id: _self.data.model.id
        },
        success(res) {
          wx.hideLoading();
          if (res.data.code !== 200) {
            wx.showModal({
              content: res.data.msg,
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../../order/index/index'
                  })
                }
              }
            })
            return;
          }
          wx.showModal({
            title: '成功',
            content: '激活成功！即刻开启健身运动吧！',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../../order/index/index'
                })
              }
            }
          })
        },
        fail(res) {
          common.requestfail();
          return;
        }
      })
    } else {
      _self.isLogin();
    }
  },
  /**
   * 后台接口[getPhoneNumber]微信获取用户手机号
   * 参数：code
   * 调用微信登录接口获取微信用户信息然后调用接口获取手机号最后调用useradd添加用户
  */
  // 微信获取用户手机号
  getPhoneNumber(e) {
    if (e.detail.errMsg == "getPhoneNumber:user deny") {
      return;
    };
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success(res) {
          wx.request({
            url: app.globalData.miniserverUrl + 'rebirth/user/openid?jscode=' + res.code,
            success(res) {
              if (res.data.code !== 200) {
                common.apirequestfail(res.data.msg);
                return;
              }
              var pc = new WXBizDataCrypt(appid, res.data.result.session_key);
              var data = pc.decryptData(e.detail.encryptedData, e.detail.iv);
              _self.setData({
                phone: data.purePhoneNumber,
                userloginbtn: false
              });
              _self.useradd();
            },
            fail(res) {
              common.requestfail();
              return;
            }
          });
        }
      });
    }
  },
  /**
 * 后台接口[useradd]添加用户
 * 参数：uid
 * 调用接口添加用户，成功后把数据保存到localstorage和data中
*/
  useradd: function () {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/user/useradd',
      data: {
        nickName: _self.data.nickName,
        avatarUrl: _self.data.avatarUrl,
        openid: _self.data.openid,
        phone: _self.data.phone,
        pid: _self.data.model.pid
      },
      success(res) {
        if (res.data.code == 100) {
          wx.showModal({
            content: '您没有被人邀请哦，请扫他人邀请码或致电15639260167获取邀请码',
            showCancel: false,
            success(res) {
              if (res.confirm) { }
            }
          })
          return;
        }
        if (res.data.code == 200) {
          var model = res.data.result;
          if (model == '') {
            common.apimodelerror('查询用户为空');
            return;
          }
          wx.setStorageSync('user', {
            uid: model.uid,
            status: model.status
          });
          _self.setData({
            uid: model.uid
          })
        }
      },
      fail() {
        common.requestfail();
        return;
      }
    });
  },

  //界面组件部分
  //============================================================================
  // 获取缓存
  isLogin: function () {
    wx.getStorage({
      key: 'user',
      success(res) {
        var model = res.data;
        _self.setData({
          uid: model.uid
        });
        _self.activation();
      },
      fail() {
        _self.getCode();
      }
    });
  },
  // 获取code
  getCode: function () {
    wx.login({
      success(res) {
        _self.getOpenid(res.code);
      }
    })
  },
  // 微信获取用户信息
  getUserinfo: function (e) {
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      return
    };
    _self.setData({
      nickName: e.detail.userInfo.nickName,
      avatarUrl: e.detail.userInfo.avatarUrl,
      userinfobtn: false,
      userloginbtn: true
    });
  },
})