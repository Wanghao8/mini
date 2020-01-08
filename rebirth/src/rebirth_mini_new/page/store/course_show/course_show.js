/**
 * 课程详情页面
 * 分享可以打开，门店可以跳转
 * 黄栾 2020-01-07日
 */

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
    goods_id: 0,
    introIndex: 1,
    fullLoading: true,
    navbg: 'rgba(0,0,0,0)'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
    _self.setData({
      goods_id: options.id
    })
    if (options.lat) {
      _self.setData({
        lat: options.lat,
        long: options.long,
        address: options.address,
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    _self.goods_show();
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
      path: '/page/store/course_show/course_show?id=' + _self.data.goods_id + '&lat=' + parseFloat(_self.data.lat) + '&long=' + parseFloat(_self.data.long) + '&address=' + _self.data.address,
      imageUrl: _self.data.course.course_cover_imgs[0]
    }
  },


  //后台接口部分
  //=======================================================
  /**
   * 获取课程信息 [goods_show]
   * 参数 id,acc_id
   * 返回课程信息
   */
  goods_show() {
    if (!wx.getStorageSync("acc")) {
      _self.wxlogin();
      return;
    }
    wx.request({
      url: app.globalData.url + 'mini/storeapi/goods_show',
      data: {
        id: _self.data.goods_id,
        acc_id: wx.getStorageSync('acc').id
      },
      method: 'get',
      success(res) {
        if (!res.data.res) {
          common.apiFalse("课程信息获取错误", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var model = res.data.data;
        model.course_cover_imgs = model.course_cover_imgs.split(',');
        for (var i = 0; i < model.course_cover_imgs.length; i++) {
          model.course_cover_imgs[i] = app.globalData.imgUrl + model.course_cover_imgs[i];
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
          item.avatarUrl = item.avatarUrl ? app.globalData.imgUrl + item.avatarUrl : "../../../static/img/mine.png";
        });
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
  appoint_add() {
    wx.request({
      url: app.globalData.url + 'mini/orderapi/appoint_add',
      data: {
        goods_id: _self.data.course.id,
        acc_id: wx.getStorageSync('acc').id
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("预约课程失败", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        wx.showModal({
          title: '预约课程成功',
          content: '请按时达到上课。可在首页查看健身房开门二维码，确认返回首页',
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
      },
      fail(res) {
        common.requestFail('获取课程信息失败');
        return;
      }
    });
  },
  /**
   * 后台自动登录 [acc_login_code]
   * 参数 code,p_acc_id
   * 返回用户实体信息
   */
  acc_login_code(code) {
    wx.request({
      url: app.globalData.url + 'mini/manageapi/acc_login_code',
      data: {
        code: code,
        latlong: '0,0',
        p_acc_id: 0
      },
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
    common.showLoading("正在获取信息");
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
        _self.goods_show();
        //直接进行课程预约提示
        wx.showModal({
          title: '确定预约' + _self.data.course.start_time1 + _self.data.course.course_name + '?',
          content: '预约后，请按规定时间到达门店上课（课提前半小时哦）',
          success(res) {
            if (res.confirm) {
              _self.appoint_add();
            }
          }
        })
      },
      fail(res) {
        common.requestFail('用户信息修改失败');
        common.hideLoading();
        return;
      }
    });
  },
  //界面组件部分
  //====================================================
  actionBtn: function(e) {
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.action;
    var location = e.currentTarget.dataset.location;
    switch (type) {
      case 'intro':
        wx.pageScrollTo({
          scrollTop: 190,
        });
        _self.setData({
          introIndex: 1
        });
        break;
      case 'caution':
        wx.pageScrollTo({
          scrollTop: 1000,
        });
        _self.setData({
          introIndex: 2
        });
        break;
      case 'openMap':
        wx.openLocation({
          latitude: parseFloat(_self.data.lat),
          longitude: parseFloat(_self.data.long),
          name: _self.data.address
        })
        break;
      case 'resever':
        wx.showModal({
          title: '确定预约' + _self.data.course.start_time1 + _self.data.course.course_name + '?',
          content: '预约后，请按规定时间到达门店上课（课提前半小时哦）',
          success(res) {
            if (res.confirm) {
              _self.appoint_add();
            }
          }
        })
        break;
      case 'charge':
        wx.navigateTo({
          url: '../../order/consume_buy/consume_buy',
        });
        break;
      default:
        break;
    }
  },
  handlerGobackClick() {
    wx.navigateBack({
      delta: 1
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
        _self.acc_login_code(res.code);
      }
    });
  },
  /**
   * 获取微信实体信息 [wxlogin] 
   * 小程序直接请求code
   * 返回code
   */
  bindGetUserInfo(e) {
    if (e.detail.errMsg != "getUserInfo:ok") {
      common.showToast('登录失败');
      return;
    };
    var model = e.detail.userInfo;
    model.acc_id = wx.getStorageSync("acc").id;
    _self.acc_edit_info(model);
  },
  handlerGobackClick() {
    wx.navigateBack({
      delta: 1
    })
  },
  changebg() {
    _self.setData({
      navbg: 'rgba(255,255,255, 0)'
    })
  },
  changegb() {
    _self.setData({
      navbg: 'rgba(255,255,255, 1)'
    })
  }
})