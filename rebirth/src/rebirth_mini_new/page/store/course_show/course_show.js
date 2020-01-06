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
    introIndex: 1,
    fullLoading: true,
    navbg: 'rgba(0,0,0,0)',
    accAddData: {
      code: '',
      p_acc_id: 0, //分享上级id
      latlong: '0,0'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
    _self.setData({
      id: options.id,
      location: JSON.parse(options.location)
    })
    if (!wx.getStorageSync("acc")) {
      _self.wxlogin();
      return;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    _self.getLocation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    _self.goods_show();
    _self.acc_show();
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
  /**
   * 分享的处理函数
   */
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: _self.data.course.course_name,
      path: '/page/store/course_show/course_show?id=' + _self.data.id + '&location=' + JSON.stringify(_self.data.location),
      imageUrl: _self.data.course.course_cover_imgs[0]
    }
  },
  //后台接口部分
  //=======================================================
  /**
   * 微信-获取当前位置
   * 微信内部授权
   */
  getLocation: function() {
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        var latlong = latitude + "," + longitude;
        _self.setData({
          'accAddData.latlong': latlong
        });
        _self.wxlogin();
      },
      fail() {
        _self.wxlogin();
      }
    })
  },
  /**
   * 微信登录code [wxlogin] 
   * 小程序直接请求code
   * 返回code
   */
  wxlogin: function() {
    wx.login({
      success(res) {
        _self.setData({
          'accAddData.code': res.code
        });
        _self.acc_login_code();
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
      url: app.globalData.url + 'mini/manageapi/code2Session?code=' + _self.data.accAddData.code,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("获取code失败", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var model = res.data.data;
        _self.setData({
          sessionKey: model.session_key
        });
        _self.acc_edit_phone();
      },
      fail(res) {
        common.requestFail('后台登录接口，执行失败');
        return;
      }
    });
  },
  /**
   * 后台自动登录 [acc_login_code]
   * 参数 code,p_acc_id
   * 返回用户实体信息
   */
  acc_login_code() {
    var dataParam = _self.data.accAddData;
    if (!(dataParam.code != '')) {
      common.showToast("未获取到有效code");
      return;
    }
    wx.request({
      url: app.globalData.url + 'mini/manageapi/acc_login_code',
      data: _self.data.accAddData,
      method: 'get',
      header: common.headerForm,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("后台自动登录失败", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var model = res.data.data;
        var accModel = {
          id: model.id,
          store_id: model.store_id
        }
        wx.setStorageSync('acc', accModel);
        _self.goods_show();
      },
      fail(res) {
        common.requestFail('后台登录接口，执行失败');
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
    _self.setData({
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
    })
    if (e.detail.errMsg != "getPhoneNumber:ok") {
      common.showToast('获取手机号失败');
      return;
    };
    wx.login({
      success(res) {
        _self.setData({
          'accAddData.code': res.code
        });
        _self.code2Session(res.code);
      }
    })
    
  },
  /**
   * 执行用户手机号修改 [acc_edit_phone]
   * 参数 acc_id
   * 返回实体信息
   */
  acc_edit_phone: function() {
    common.showLoading("正在修改");
    wx.request({
      url: app.globalData.url + 'mini/manageapi/acc_edit_phone',
      data: {
        encryptedData: _self.data.encryptedData,
        iv:_self.data.iv,
        sessionKey: _self.data.sessionKey,
        acc_id: wx.getStorageSync("acc").id
      },
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
   * 获取课程信息 [goods_show]
   * 参数 id,acc_id
   * 返回课程信息
   */
  goods_show(code) {
    wx.request({
      url: app.globalData.url + 'mini/storeapi/goods_show?id=' + _self.data.id,
      data: {
        id: _self.data.id,
        acc_id: wx.getStorageSync('acc').id
      },
      method: 'get',
      success(res) {
        var model = res.data.data;
        model.lebel = model.course_lebel.split(' ')
        model.course_cover_imgs = model.course_cover_imgs.split(',')
        for (var i = 0; i < model.course_cover_imgs.length; i++) {
          model.course_cover_imgs[i] = app.globalData.imgUrl + model.course_cover_imgs[i]
        }
        //商品开始结束时间处理
        model.start_time1 = model.begin_time.slice(0, -3);
        model.end_time1 = model.end_time.substr(11, 5);
        model.start_time1 = model.start_time1.split("-");
        model.start_time1 = model.start_time1[0] + '年' + model.start_time1[1] + '月' + model.start_time1[2];
        model.start_time1 = model.start_time1.split(" ");
        model.start_time1 = model.start_time1[0] + '日' + model.start_time1[1];
        model.course_effect = model.course_effect.replace(/\r\n/g, "\n");
        model.course_note = model.course_note.replace(/\r\n/g, "\n");
        model.acc_list.forEach(function(item) {
          item.avatarUrl = app.globalData.imgUrl + item.avatarUrl
        })
        _self.setData({
          course: model,
          fullLoading: false
        })
      },
      fail(res) {
        common.requestFail('获取课程信息失败');
        return;
      }
    });
  },
  /**
   * 预约课程 [appoint_add]
   * 参数 acc_id,goods_id
   * 返回课程信息
   */
  appoint_add(code) {
    wx.request({
      url: app.globalData.url + 'mini/orderapi/appoint_add',
      data: {
        goods_id: _self.data.course.id,
        acc_id: wx.getStorageSync('acc').id
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        if (res.data.msg == '预约成功') {
          console.log(165)
          wx.showModal({
            title: '预约成功',
            content: '请按时达到上课。现在是否返回首页',
            success(res) {
              var huancunData = {
                id: wx.getStorageSync('acc').id,
                store_id: _self.data.course.store_id
              };
              wx.setStorageSync("acc", huancunData);
              if (res.confirm) {
                wx.switchTab({
                  url: '../course_list/course_list',
                })
              }
            }
          })
        } else {
          console.log(265)
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }

      },
      fail(res) {
        common.requestFail('获取课程信息失败');
        return;
      }
    });
  },


  //界面组件部分
  //====================================================
  //获取用户信息保存到data里
  bindGetUserInfo(e) {
    if (e.detail.errMsg != "getUserInfo:ok") {
      common.showToast('登录失败');
      return;
    };
    var model = e.detail.userInfo;
    model.acc_id = wx.getStorageSync("acc").id;
    _self.acc_edit_info(model);
  },
  actionBtn: function(e) {
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.action;
    var location = e.currentTarget.dataset.location;
    switch (type) {
      case 'intro':
        _self.setData({
          toView: 'intro'
        })
        // wx.pageScrollTo({
        //   selector: '#intro'
        // });
        _self.setData({
          introIndex: 1
        });
        break;
      case 'caution':
        _self.setData({
          toView: 'baoming'
        })
        // wx.pageScrollTo({
        //   selector:'#baoming'
        // });
        _self.setData({
          introIndex: 2
        });
        break;
      case 'openMap':
        wx.openLocation({
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
          name: location.address
        })
        break;
      case 'resever':
        wx.showModal({
          title: '确定预约' + _self.data.course.start_time1 + _self.data.course.course_name + '?',
          content: '预约后，请按时到达门店上课',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              _self.appoint_add();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
      case 'charge':
        wx.navigateTo({
          url: '../../order/consume_buy/consume_buy',
        })
      default:
        break;
    }
  },
  handlerGobackClick() {
    wx.navigateBack({
      delta: 1
    })
  },
  changebg() {
    _self.setData({
      navbg: 'rgba(236,249,248, 0)'
    })
  },
  changegb() {
    _self.setData({
      navbg: 'rgba(236,249,248, 1)'
    })
  },

})