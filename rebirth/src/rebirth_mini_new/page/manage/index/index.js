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
    cavs: 1,
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
    _self.wxlogin();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    _self.acc_show();
  },
  //后台接口部分
  //=======================================================
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
  /**
   * 后台接口[getsharecode]获取邀请码
   * 参数：uid
   * 发送请求给服务器，成功后调用wx.getImageInfo获取图片信息，生成二维码url存到data中
   */
  getsharecode: function(uid) {
    wx.request({
      url: app.globalData.url + 'rebirth/ercode/share?uid=' + uid,
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
      method: 'get',
      header: common.headerForm,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("接口请求未完成", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        if (!res.data.data) {
          var model = res.data;
        } else {
          var model = res.data.data;
        }

        model.nickName = model.nickName == "" ? 'rebirth新用户' : model.nickName;
        model.avatarUrl = model.avatarUrl == "http://rebirths.yuanfangyun.com/null" ? "../../../static/img/mine.png" : app.globalData.imgUrl + model.avatarUrl;
        if (model.timecard) {
          model.timecard1 = model.timecard.replace(/-/, '年');
          model.timecard1 = model.timecard1.replace(/-/, '月');
          model.timecard1 = model.timecard1 + '天 ';
        }
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
  //界面组件部分
  //====================================================
  // 点击事件汇总
  actionBtn: function(e) {
    var type = e.currentTarget.dataset.action;
    switch (type) {
      case 'info':
        if (_self.data.userInfo.nickName =='rebirth新用户') {
          common.showToast('请先登录');
          return;
        }
        wx.navigateTo({
          url: '../base_info/base_info',
        });
        break;
      case 'charge':
        wx.navigateTo({
          url: '../../order/consume_buy/consume_buy',
        });
        break;
      case 'exeRecord':
        wx.navigateTo({
          url: '../../order/appoint_list/appoint_list',
        });
        break;
      case 'history':
        wx.navigateTo({
          url: '../../order/consume_list/consume_list',
        });
        break;
        // case 'login':

        //   break;
        // case 'phone':

        //   break;
      case 'invite':
        common.showToast("邀请暂未开启")
        // _self.toInvitationV();
        break;
      case 'recommend':

        break;
      case 'about':
        // common.showToast('暂未开启');
        // return;
        wx.navigateTo({
          url: '../food_show/food_show?url=https://mp.weixin.qq.com/s/6AT7wqRslDFKW9TqGX3kQA',
        })
        break;
      case 'manage':
        var manage_store_id = _self.data.userInfo.manage_store_id;
        if (!(manage_store_id > 0)){
          common.showToast('无管理门店');
          return;
        }
        wx.navigateTo({
          url: '../../report/store_report/store_report?manage_store_id=' + manage_store_id,
        })
        break;
      default:
        break;
    }
  },
  //获取用户信息保存到data里
  bindGetUserInfo(e) {
    var model = e.detail.userInfo;
    model.acc_id = wx.getStorageSync("acc").id;
    _self.acc_edit_info(model);
  },
  //点击生成海报
  toInvitationV: function() {
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
      url: '../invitationview/invitationview'
    })
  },
  // 获取缓存
  getstorage: function() {
    wx.getStorage({
      key: 'acc',
      success(res) {
        _self.getsharecode(res.data.id);
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
  drawinviimage: function(index) {
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
        ctx.draw(true, function() {
          _self.getdrawimage(ratio)
        });
      },
      fail(res) {
        console.log(res);
      }
    });
  },
  //获取海报
  getdrawimage: function(ratio) {
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
  saveimg: function() {
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
  getsetting: function() {
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
  keepimg: function() {
    wx.previewImage({
      current: _self.data.keepurl, // 当前显示图片的http链接
      urls: [_self.data.keepurl] // 需要预览的图片http链接列表
    })
  },
  // 以下生成海报
  bg() {
    _self.setData({
      cavs: 1
    });
  }
})