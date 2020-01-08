/**
 * 课程首页界面
 * 默认小程序首页，绑定最近门店，检查是否存在预约
 * 王豪 2019-12-30
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
    fullLoading: true,
    accAddData: {
      code: '',
      p_acc_id: 0, //分享上级id
      latlong: '0,0'
    },
    appointData: {
      id: 0
    },
    introIndex: 1,
    currentTab: 0,
    weekday: ['日', '一', '二', '三', '四', '五', '六', '日', '一', '二', '三', '四', '五', '六'],
    goodsList: [],
    navbg: 'rgba(0,0,0,0)'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
    //是否存在父级id
    if (options.p_acc_id) {
      _self.setData({
        'accAddData.p_acc_id': options.p_acc_id,
      })
    }
    _self.setData({
      id: options.id
    })
    //课程切换高度计算
    _self.getDate();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    _self.setHeight();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.pageScrollTo({
      scrollTop: 0,
    });
    _self.store_show();
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
      title: _self.data.gym.name,
      path: '/page/store/course_list/course_list',
      imageUrl: _self.data.gym.cover_imgs[0]
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
        _self.store_show();
      },
      fail(res) {
        common.requestFail('后台登录接口，执行失败');
        return;
      }
    });
  },
  /**
   * 获取门店信息 [store_show]
   * 参数：id
   * 返回:门店信息
   */
  store_show: function(e) {
    if (!wx.getStorageSync("acc")) {
      _self.getLocation();
      return;
    }
    wx.request({
      url: app.globalData.url + 'mini/storeapi/store_show',
      data: {
        id: _self.data.id
      },
      method: 'get',
      header: common.headerForm,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("门店信息不存在", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var model = res.data.data;
        model.no = parseInt(model.id) + 1000;
        // model.cover_imgs = app.globalData.imgUrl + model.cover_imgs;
        model.cover_imgs = model.cover_imgs.split(",");
        for (var i = 0; i < model.cover_imgs.length;i++){
          model.cover_imgs[i] = app.globalData.imgUrl + model.cover_imgs[i]
        }
        model.latlong = model.latlong.split(',');
        model.lat = model.latlong[0];
        model.lon = model.latlong[1];
        model.info = model.info.replace("/\r\n/g", "\n");
        model.note = model.note.replace(/\r\n/g, "\n");
        _self.setData({
          gym: model
        });
        //同步执行课程列表
        _self.goods_list();
        _self.setData({
          fullLoading: false
        });
      },
      fail(res) {
        common.requestFail('请求接口失败，未能获取门店信息');
      }
    })
  },

  /**
   * 后台接口[goods_list]获取openid
   * 参数：无
   * 返回:门店列表信息
   */
  goods_list() {
    wx.request({
      url: app.globalData.url + 'mini/storeapi/goods_list',
      data: {
        store_id: _self.data.id,
        dayn: _self.data.chooseDate
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("课程信息获取失败", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var model = res.data.data;
        model.forEach(function(item) {
          item.begin_time = item.begin_time.substr(11, 5);
          item.end_time = item.end_time.substr(11, 5);
          item.label = item.label.replace(/ /g, ' · ');
          item.volume = parseInt(item.volume);
          item.appoint_total = parseInt(item.appoint_total);
        })
        _self.setData({
          goodsList: model
        })
        _self.setHeight();
      },
      fail(res) {
        common.requestFail('请求接口失败，未能获取门店信息');
      }
    })
  },

  //界面组件部分
  //====================================================
  // 点击事件汇总
  actionBtn: function(e) {
    var type = e.currentTarget.dataset.action;
    var location = e.currentTarget.dataset.location;
    var id = e.currentTarget.dataset.id;
    var btn = e.currentTarget.dataset.btn;
    switch (type) {
      case 'reserver':
        if (btn == 1) {
          wx.navigateTo({
            url: '../course_show/course_show?id=' + id + '&location=' + JSON.stringify(location),
          });
        } else {
          common.showToast("结束或已满不可预约")
        }
        break;
      case 'reservered':
        if (id != 0) {
          wx.navigateTo({
            url: '../../order/appoint_show/appoint_show?id=' + _self.data.appointData.id,
          });
        } else {
          common.showToast("您暂无预约")
        }
        break;
      case 'openMap':
        console.log(location)
        wx.openLocation({
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
          name: location.address
        })
        break;
      default:
        break;
    }
  },
  // 获取日期
  getDate() {
    var date = new Date();
    var date2 = new Date((new Date).getTime() + 24 * 60 * 60 * 1000);
    var date3 = new Date((new Date).getTime() + 24 * 60 * 60 * 1000 * 2);
    var date4 = new Date((new Date).getTime() + 24 * 60 * 60 * 1000 * 3);
    var date5 = new Date((new Date).getTime() + 24 * 60 * 60 * 1000 * 4);
    var date6 = new Date((new Date).getTime() + 24 * 60 * 60 * 1000 * 5);
    var zhou = date.getDay();
    _self.setData({
      chooseDate: _self.formatDate(date),
      date1: _self.formatDate(date),
      date2: _self.formatDate(date2),
      date3: _self.formatDate(date3),
      date4: _self.formatDate(date4),
      date5: _self.formatDate(date5),
      date6: _self.formatDate(date6),
      day1: _self.formatDate2(date),
      day2: _self.formatDate2(date2),
      day3: _self.formatDate2(date3),
      day4: _self.formatDate2(date4),
      day5: _self.formatDate2(date5),
      day6: _self.formatDate2(date6),
      week: zhou
    })
  },
  // 格式化日期
  formatDate(date) {
    var years = date.getFullYear();
    var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var week = date.getDay();
    return years + '-' + month + '-' + day
  },
  formatDate2(date) {
    var years = date.getFullYear();
    var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var week = date.getDay();
    return month + '.' + day
  },

  //设置swiper高度
  setHeight() {
    var winHeight = 200 * _self.data.goodsList.length + 40;
    if (_self.data.goodsList.length == 0) {
      winHeight = 328
    }
    _self.setData({
      winHeight: winHeight
    })
  },
  // 滚动切换标签样式
  switchTab: function(e) {
    _self.setData({
      currentTab: e.detail.current,
    });
    switch (_self.data.currentTab) {
      case 0:
        _self.setData({
          chooseDate: _self.data.date1
        });
        break;
      case 1:
        _self.setData({
          chooseDate: _self.data.date2
        });
        break;
      case 2:
        _self.setData({
          chooseDate: _self.data.date3
        });
        break;
      case 3:
        _self.setData({
          chooseDate: _self.data.date4
        });
        break;
      case 4:
        _self.setData({
          chooseDate: _self.data.date5
        });
        break;
      case 5:
        _self.setData({
          chooseDate: _self.data.date6
        });
        break;
      default:
        break;
    };
    _self.checkCor();
    _self.goods_list();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    var cur = e.currentTarget.dataset.current;
    var date = e.currentTarget.dataset.date;
    _self.setData({
      chooseDate: date
    })
    if (_self.data.currentTaB == cur) {
      return false;
    } else {
      _self.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (_self.data.currentTab > 4) {
      _self.setData({
        scrollLeft: 300
      })
    } else {
      _self.setData({
        scrollLeft: 0
      })
    }
  },
  footerTap: app.footerTap,
  isEmptyObject: function(obj) {
    return JSON.stringify(obj) === '{}';
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