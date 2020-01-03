/**
 * name:健身首页
 * info:首页信息、登录、路由跳转、
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
    videoshow: false,
    height: 300,
    // graceFullLoading: true,
    appointtap: 'toappointment',
    // 用户数据
    model: [],
    appointstatus: '点此预约',
    is_appoint: 0,
    experiencetime: false,
    nickName: "请点击登陆",
    card_no: 0,
    uid: 0,
    residue_time: 0,
    residue_time1: '',
    visit_num: 0,
    per: 0,
    invite_num: 0,
    proceeds: 0,
    gift_residue_time: 0,
    once_card: 0,
    // 邀请人数据
    pid: 38,
    // 注册账户
    openid: 0,
    avatarUrl: '',
    phone: 0,
    userinfobtn: false,
    userloginbtn: false,
    // 出租柜
    cabinets: 'tocabinets',
    // 海报
    cavs: 1,
    imgurl: ['https://renlis.yuanfangyun.com/inva.png', 'https://renlis.yuanfangyun.com/poster2.jpg', 'https://renlis.yuanfangyun.com/poster1.jpg',
      'https://renlis.yuanfangyun.com/honor1.jpg'
    ],
    imgwidth: 286,
    imgheight: 514.8,
    imgid: 0,
    // 用户信息
    qecodeurl: 0,
    visit_num: 0,
    keepurl: ''
  },

  onLoad: function (query) {
    _self = this;
    _self.setData({
      height: (wx.getSystemInfoSync().windowWidth - 30) * 0.5625
    });
    wx.hideShareMenu();
    if (query.scene) {
      _self.qrcodechange(query);
    }
  },

  onReady: function () {
    _self.setData({
      experiencetime: false,
      videoshow: false
    })
    // _self.isLogin();
  },

  onShow: function () {
    _self.isLogin();
  },

  // 页面路由
  topublic: function () {
    wx.navigateTo({
      url: '../../order/public/public'
    })
  },
  toopencabinets: function () {
    wx.navigateTo({
      url: '../../order/opencabinets/opencabinets?uid=' + _self.data.uid
    })
  },
  tocabinets: function () {
    if (!_self.is_userinfobtn()) {
      return;
    }
    wx.navigateTo({
      url: '../../order/cabinets/cabinets'
    })
  },
  toappointment: function () {
    if (!_self.is_userinfobtn()) {
      return;
    }
    if (_self.data.model.once_card > 0 || _self.data.model.residue_time + _self.data.model.prepare_time > 0) {
      wx.navigateTo({
        url: '../../order/appointment/appointment'
      })
    }
    else if (_self.data.model.once_card == 0 && _self.data.model.residue_time + _self.data.model.prepare_time == 0) {
      wx.showModal({
        title: '余额不足',
        content: '您没有时间了，无法预约健身，请充值！',
        confirmText: '去充值',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../order/recharge/recharge'
            })
          } else if (res.cancel) {
            return;
          }
        }
      });
    }
 
    else{
      wx.showModal({
        title: '余额不足',
        content: '您没有时间了，无法预约健身，请充值！',
        confirmText: '去充值',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../order/recharge/recharge'
            })
          } else if (res.cancel) {
            return;
          }
        }
      });
    }

  },
  ToOpendoor: function () {
    wx.navigateTo({
      url: '../../product/opendoor/opendoor'
    })
  },
  ToIRecord: function () {
    wx.navigateTo({
      url: '../../order/incomerecord/incomerecord'
    })
  },
  ToActivity: function () {
    wx.navigateTo({
      url: '../../operate/activityview/activityview'
    })
  },
  ToRecharge: function () {
    if (!_self.is_userinfobtn()) {
      return;
    }
    wx.navigateTo({
      url: '../../order/recharge/recharge'
    })
  },
  ToFootprint: function () {
    if (!_self.is_userinfobtn()) {
      return;
    }
    wx.navigateTo({
      url: '../../order/footprint/footprint'
    })
  },
  ToGymlocation: function () {
    if (!_self.is_userinfobtn()) {
      return;
    }
    wx.navigateTo({
      url: '../../product/gymlocation/gymlocation'
    })
  },
  ToCashW: function () {
    wx.showModal({
      content: '自动提现功能暂未开放，请致电15639260167进行人工提现',
      confirmText: '拨打电话',
      success(res) {
        if (res.confirm) {
          wx.showModal({
            content: '拨打15639260167？',
            success(res) {
              if (res.confirm) {
                wx.makePhoneCall({
                  phoneNumber: '15639260167' // 仅为示例，并非真实的电话号码
                })
              } else if (res.cancel) {
                return;
              }
            }
          })
        } else if (res.cancel) {
          return;
        }
      }
    })
    // 		wx.navigateTo({
    // 			url: '../../order/cashwithdrawal/cashwithdrawal'
    // 		})
  },
  ToSM: function () {
    if (!_self.is_userinfobtn()) {
      return;
    }
    wx.navigateTo({
      url: '../../user/subordinatemember/subordinatemember'
    })
  },
  toinvishare: function () {
    if (!_self.is_userinfobtn()) {
      return;
    }
    wx.navigateTo({
      url: '../../user/invitationview/invitationview?id=share'
    })
  },
  toleasebox: function () {
    common.showmodalconfirm('即将开放，敬请期待！');
  },
  togiftview: function () {
    wx.navigateTo({
      url: '../../operate/giftview/giftview'
    })
  },
  toappo: function () {
    wx.navigateTo({
      url: '../../order/appointrecord/appointrecord'
    });
  },
  ToInvitationV: function () {  //点击生成海报
    // _self.getstorage();  //海报
    if (!_self.is_userinfobtn()) {
      return;
    }
    _self.getstorage();
    _self.setData({
      cavs: 0
    });
    wx.showToast({
      title: '图片生成中',
      icon: 'loading'
    });
    return
    wx.navigateTo({
      url: '../../user/invitationview/invitationview'
    })
  },

  //接口请求部分
	//============================================================================

  /**
	 * 后台接口[getPhoneNumber]微信获取用户手机号
	 * 参数：code
	 * 调用wx.login接口获取微信信息，将数据加密解密后把phone存到data中，调用useradd
	 */
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
          _self.onReady();
        }
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
            // graceFullLoading: false,
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
	 * 参数：uid:用户id
	 * 向服务器请求用户信息，成功后把uid,status,last_store_id存到本地，把返回来的数据赋值给data
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
          status: model.status,
          last_store_id: model.last_store_id

        });
        if (model.has_locker == 1) {
          _self.setData({
            cabinets: 'toopencabinets',
          });
        } else if (model.has_locker == 2) {
          _self.setData({
            cabinets: 'tocabinets'
          });
        }
        if (model.prepare_time >= 0) {
          var a = common.converttime(model.residue_time + model.prepare_time);
        }
        var b = common.converttime(model.gift_residue_time);
        _self.setData({
          // graceFullLoading: false,
          nickName: model.nickName,
          card_no: model.card_no,
          avatarUrl: model.avatarUrl,
          residue_time: a,
          residue_time1: model.residue_time,
          visit_num: model.visit_num,
          invite_num: model.invite_num,
          per: model.per,
          proceeds: model.proceeds,
          is_appoint: model.is_appoint,
          gift_residue_time: b,
          once_card: model.once_card,
          model: model
        });

        if (model.is_appoint == 1) {
          _self.setData({
            appointstatus: '已预约',
            appointtap: 'ToOpendoor',
          });
        }
        if (model.is_appoint == 2) {
          _self.setData({
            appointstatus: '点此预约',
            appointtap: 'toappointment',
          });
        }
        if (model.gift_residue_time > 0) {
          _self.setData({
            experiencetime: true,
            gift_residue_time: b
          });
        } else {
          _self.setData({
            experiencetime: false,
            gift_residue_time: b
          });
        }
      },
      fail() {
        common.requestfail();
        return;
      }
    })
  },

  /**
	 * 后台接口[openlockeryes]开锁
	 * 参数：uid:用户id
	 * 向服务器发送请求，成功后打开柜门
	 */
  openlockeryes: function () {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/Locker/open?uid=' + _self.data.uid,
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        });
      }
    })
  },


  /**复制邀请码
  	CopyIncode: function(e) {
  		wx.setClipboardData({
  			data: _self.data.card_no,
  			success(res) {
  				wx.getClipboardData({
  					success(res) {
  					}
  				})
  			}
  		})
  	},*/
  
   /**
	 * 后台接口[getsharecode]获取邀请码
	 * 参数：uid
	 * 发送请求给服务器，成功后调用wx.getImageInfo获取图片信息，生成二维码url存到data中
	 */
  getsharecode: function (uid) {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/ercode/share?uid=' + uid,
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg)
        }
        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('获取邀请码为空');
          return;
        }
        wx.getImageInfo({
          src: model.ercode,
          success(res) {
            _self.setData({
              qecodeurl: res.path
            });
            if (_self.data.imgid == 0) {
              _self.drawinviimage(0);
            }
          }
        });
      },
      fail() {
        common.requestfail(_self);
        return;
      }
    });

  },
  

  //界面组件部分
	//============================================================================
  // 二维码传参
  qrcodechange: function (query) {
    const scene = decodeURIComponent(query.scene);
    var newstr = '{' + '"' + scene.replace("=", "\":") + '}';
    var useid = scene.substr(0, [3]);
    if (useid == 'pid') {
      var nnstr = JSON.parse(newstr);
      _self.setData({
        pid: nnstr.pid
      });
    }
  },
  // 获取缓存
  isLogin: function () {
    wx.getStorage({
      key: 'user',
      success(res) {
        var model = res.data;
        _self.getUserById(model.uid);
        _self.setData({
          uid: model.uid
        });
      },
      fail() {
        //_self.getCode();
        console.log("未搜索到本地ID")
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
  // 开柜门
  openlocker: function () {
    wx.showModal({
      content: '确认打开专属储物柜？打开后需手动关闭柜门！',
      success(res) {
        if (res.confirm) {
          _self.openlockeryes();
        } else if (res.cancel) {
          return;
        }
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
  onShareAppMessage: function (a) {
    if (a.target.id == 'power') {
      return {
        title: '我的健身战力已经突破天际！快来比一比！',
        path: 'pages/order/newlogin/newlogin?pid=' + _self.data.uid,
        // imageUrl: 'https://thumbnail10.baidupcs.com/thumbnail/9502fc813424e59487b3629db6fe78e5?fid=1232619666-250528-1082895816193961&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-BbuSiuft%2blQPP9qK%2b9y%2bUPBHyqI%3d&expires=8h&chkbd=0&chkv=0&dp-logid=1701964627795510360&dp-callid=0&time=1552611600&size=c1920_u1080&quality=90&vuk=1232619666&ft=image&autopolicy=1'
      }
    }
  },
  // 播放视频
  showvideostart: function () {
    // wx.navigateTo({
    // 	url:'../../order/appointrecord/appointrecord'
    // });
    _self.setData({
      videoshow: true
    });
  },
  // 以下生成海报
  bg() {
    _self.setData({
      cavs: 1
    });
  },
  // 获取缓存
  getstorage: function () {
    wx.getStorage({
      key: 'user',
      success(res) {
        _self.getsharecode(res.data.uid);
        // _self.getUserById(res.data.uid)
      },
      fail() {
        wx.reLaunch({
          url: '../../order/index/index'
        })
      }
    })
  },
  // 制作邀请海报
  drawinviimage: function (index) {
    // wx.showToast({
    //   title: '图片生成中',
    //   icon: 'loading'
    // });
    let mobile = wx.getSystemInfoSync();
    let ratio = mobile.windowWidth / 375;
    _self.setData({
      imgwidth: 286 * ratio,
      imgheight: 514.8 * ratio,
    });
    wx.getImageInfo({
      src: _self.data.imgurl[index],
      success(res) {
        var ctx = wx.createCanvasContext("myCanvas");
        ctx.drawImage(res.path, 0, 0, _self.data.imgwidth, _self.data.imgheight);
        ctx.save();
        ctx.beginPath();
        ctx.arc(95 * ratio + (96 * ratio / 2), 385 * ratio + (100 * ratio / 2), (100 * ratio / 2), 0, 2 * Math.PI);
        ctx.clip(); //裁剪
        ctx.drawImage(_self.data.qecodeurl, 95 * ratio, 385 * ratio, 100 * ratio, 100 * ratio);
        ctx.restore();
        ctx.save();
        ctx.draw(true, function () {
          _self.getdrawimage(ratio)
        });
      },
      fail(res) {
        console.log(res);
      }
    });
  },
  //获取海报
  getdrawimage: function (ratio) {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 286 * ratio,
      height: 514.8 * ratio,
      destWidth: 572 * ratio,
      destHeight: 1029.6 * ratio,
      canvasId: 'myCanvas',
      success(res) {
        var temp = res.tempFilePath
        _self.setData({
          keepurl: res.tempFilePath
        });
        wx.hideToast();
      },
      fail(res) {
        wx.showToast({
          title: '生成失败',
          duration: 1000
        })
      }
    })
  },
  // 保存图片
  saveimg: function () {
    wx.saveImageToPhotosAlbum({
      filePath: _self.data.keepurl,
      success(res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500
        });
        _self.setData({
          cavs: 1
        });
      },
      fail(res) {
        _self.getsetting();
      }
    });
  },
  // 获取授权
  getsetting: function () {
    wx.showModal({
      content: '获取相册授权即可轻松保存图片！',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          wx.openSetting({
            success(res) {
              if (res.authSetting["scope.writePhotosAlbum"] == true) {
                wx.showToast({
                  title: '授权成功！',
                  icon: 'none',
                  duration: 1500
                });
              } else if (res.authSetting["scope.writePhotosAlbum"] == false) {
                wx.showToast({
                  title: '授权失败！',
                  icon: 'none',
                  duration: 1000
                });
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
  //全屏预览海报
  keepimg: function () {
    wx.previewImage({
      current: _self.data.keepurl, // 当前显示图片的http链接
      urls: [_self.data.keepurl] // 需要预览的图片http链接列表
    })
  },

  //判断未登录时 显示授权弹出框
  is_userinfobtn: function () {
    var loginS = false;
    if (!wx.getStorageSync("user")) {
      common.showToast("微信登录", "loading", 2000);
      _self.getCode();
      return loginS;
    }
    return true;
  },
})
