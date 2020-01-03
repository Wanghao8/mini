/**
 * name:第一次去健身房激活健身页面
 * info:获取邀请人，获取用户信息，获取开门码路由跳转opendoor
 * auth:王豪
 */
var _self;
var WXBizDataCrypt = require('../../../static/js/RdWXBizDataCrypt.js');
var common = require("../../../static/js/common.js");
var appid = 'wx0413342d07a4758c';
var app = getApp();
Page({
  //路由数据部分
  //============================================================================
  data: {
    graceFullLoading: true,
    // getphonefalse: false,
    getinvites: false,
    // 健身房信息
    storetitle: '轮回健身',
    storeinfo: '再一次·做回自己',
    storeimage: '',
    storeid: 0,
    // 邀请人信息
    pnickname: 0,
    card_no: 0,
    pavatarUrl: 0,
    pphone: 0,
    pid: 0,
    // 注册账户
    openid: 0,
    nickName: 0,
    avatarUrl: 0,
    phone: 0,
    userinfobtn: false,
    userloginbtn: false,
  },
  onLoad: function (query) {
    _self = this;
    _self.qrcodechange(query);
  },
  onReady: function () {
    _self.setData({
      storetitle: '轮回健身',
      storeinfo: '再一次·做回自己',
      storeimage: '../../../static/img/vip.png'
    });
    _self.isLogin();

  },
  // 页面路由
  toopendoor: function (e) {
    wx.navigateTo({
      url: '../../product/opendoor/opendoor?store_id=' + e.currentTarget.dataset.sid
    })
  },
  //接口请求部分
  //============================================================================
  /**
	 * 后台接口[gettracklist]微信获取用户手机号
	 * 参数：code
	 * 调用wx.login接口获取微信信息，将数据加密解密后把phone存到data中，调用useradd
	 */
  getPhoneNumber(e) {
    if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
      return
    };
    if (e.detail.errMsg == "getPhoneNumber:fail Error: 用户绑定的手机需要进行验证，请在客户端完成短信验证步骤") {
      _self.setData({
        userloginbtn: false,
        // getphonefalse: true
      });
    }
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
  * 参数：openid，pid，nickname:微信昵称，avatarUrl:微信头像url，phone:手机号，
  * 向服务器请求添加用户，成功后将uid和status存到本地，调用onReady
  */
  useradd: function () {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/user/useradd',
      data: {
        nickName: _self.data.nickName,
        avatarUrl: _self.data.avatarUrl,
        openid: _self.data.openid,
        phone: _self.data.phone,
        pid: _self.data.pid
      },
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('查询健身房信息为空');
          return;
        }
        wx.setStorageSync('user', {
          uid: model.uid,
          status: model.status
        });
        _self.onReady();

      },
      fail() {
        common.requestfail();
        return;
      }
    });
  },
  /**
	 * 后台接口[getOpenid]获取openid
	 * 参数：code:微信登录凭证
	 * 向服务器请求openID成功后将其存入data，调用getUserByOpenid
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
          session_key: model.session_key
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
    * 向服务器请求用户信息，成功后调用getUserById
  */
  getUserByOpenid: function (openid) {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/user/getuid?openid=' + openid,
      success(res) {
        if (res.data.code == 403) {
          _self.setData({
            graceFullLoading: false,
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
    * 后台接口[getUserByOpenid]查询用户信息
    * 参数：uid
    * 向服务器请求用户信息，成功后调用getUserById
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
          graceFullLoading: false,
        });
        _self.getinvite(model.pid);
      },
      fail() {
        common.requestfail();
        return;
      }
    })
  },
  /**
    * 后台接口[getinvite]查询邀请人
    * 参数：pid
    * 向服务器请求邀请人信息，成功后存到data中
  */
  getinvite: function (pid) {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/user/getinfo?uid=' + pid,
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('查询邀请人为空');
          return;
        }
        _self.setData({
          getinvites: true,
          card_no: model.card_no,
          pnickname: model.nickName,
          pavatarUrl: model.avatarUrl,
          pphone: model.phone,
          pid: model.uid
        });
      },
      fail() {
        common.requestfail();
        return;
      }
    })
  },
  /**
    * 后台接口[getstoreinfo]获取健身房信息
    * 参数：storeid
    * 向服务器请求邀请人信息，成功后存到data中
  */
  getstoreinfo: function (storeid) {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/store/detail?store_id=' + storeid,
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('查询健身房信息为空');
          return;
        }
        _self.setData({
          storetitle: model.name,
          storeinfo: model.address,
          storeimage: model.image,
        });
        _self.getinvite(model.member_id);
      },
      fail() {
        common.requestfail();
        return;
      }
    })
  },

  //界面组件部分
  //============================================================================
  // 获取缓存
  isLogin: function () {
    wx.getStorage({
      key: 'user',
      success(res) {
        var model = res.data;
        _self.getUserById(model.uid);
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
      },
      fail() {
        _self.onReady()
      }
    });
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
  // 拨打电话
  phonetop: function () {
    wx.showModal({
      title: '拨打电话',
      content: '拨打' + _self.data.pphone + '？',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: _self.data.pphone // 仅为示例，并非真实的电话号码
          });
        } else if (res.cancel) {

        }
      }
    });
  },
  // 二维码传参
  qrcodechange: function (query) {
    const scene = decodeURIComponent(query.scene);
    var newstr = '{' + '"' + scene.replace("=", "\":") + '}';
    var useid = scene.substr(0, [3]);
    if (useid == 'pid') {
      var nnstr = JSON.parse(newstr);
      _self.getinvite(nnstr.pid);
    }
    if (useid == 'sid') {
      var nnstr = JSON.parse(newstr);
      _self.getstoreinfo(nnstr.sid);
      _self.setData({
        storeid: nnstr.sid
      });
    }
  },
})
