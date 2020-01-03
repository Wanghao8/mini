/**
 * name:健身预约页面
 * info:获取定位日期时间选择健身房
 * auth:王豪
 */
var _self;
var common = require("../../../static/js/common.js");
var app = getApp();
var pages, prevPage;

Page({
  //路由数据部分
  //============================================================================
  data: {
    storeindex: 0,
    dateindex: 0,
    timeindex: 0,
    storearray: [],
    datearray: [],
    timeshow: false,
    listshow: true,
    dateshow: false,
    btndisabled: true,
    appoarray: [],
    sectionid: 0,
    aa: 0
  },
  onLoad: function (options) {
    _self = this;
    pages = getCurrentPages();
    prevPage = pages[pages.length - 2];
  },
  onShow: function () {
    _self = this;
    _self.getLoc();
    _self.setData({
      uid: 0,
      storeindex: 0,
      dateindex: 0,
      timeindex: 0,
      storearray: [],
      datearray: [],
      timearrays: [],
      timeshow: false,
      dateshow: false,
      listshow: false,
      btndisabled: true,
    });
    _self.getstorage();
    _self.getvaliddate(new Date());
    _self.getvalidtime(new Date());
  },
  onReady: function () {

  },

  //接口请求部分
  //============================================================================
  /**
	 * 后台接口[getstorelist]获取健身房列表
	 * 参数：userlatitude: 用户所在纬度, userlongitude: 用户所在经度
	 * 返回健身房列表
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

        try {
          var last_store_id = wx.getStorageSync('user').last_store_id;
          _self.data.storearray.forEach(function (item, index) {
            if (item.id == last_store_id) {
              _self.setData({ storeindex: index });
            }
          })
        }
        catch (error) {
          common.requestfail();
        }
        _self.getappomsg();
      },
      fail() {
        common.requestfail();
        return;
      }
    })
  },

  /**
	 * 后台接口[addappoint]预约健身
	 * 参数：date: 当前日期, hour: 当前小时, store_id: 缓存中的健身房id, uid: 用户id, section: sectionid
	 * 向服务器提交预约信息成功后把用户id，状态码，当前选择健身房id缓存到本地
	 */
  addappoint: function () {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/appoint/add',
      data: {
        date: _self.data.datearray[_self.data.dateindex],
        hour: _self.data.timearrays[_self.data.timeindex].id,
        store_id: _self.data.storearray[_self.data.storeindex].id,
        uid: _self.data.uid,
        section: _self.data.sectionid
      },
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        //记录最后一次缓存
        var uid = wx.getStorageSync('user').uid;
        var status = wx.getStorageSync('user').status;
        var last_store_id = _self.data.storearray[_self.data.storeindex].id;

        wx.setStorageSync('user', {
          uid: uid,
          status: status,
          last_store_id: last_store_id
        });

        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('获取openid为空');
          return;
        }
        if (prevPage) {
          prevPage.onReady();
        }
        wx.showModal({
          title: '预约成功',
          content: '请按预约时间到达。',
          confirmText: '我的预约',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../../product/opendoor/opendoor'
              })
            } else if (res.cancel) {
              return;
            }
          }
        })

      },
      fail(res) {
        common.requestfail();
        return;
      }
    })
  },
  /**
  * 后台接口[getappomsg]获取预约信息
  * 参数：date: 当前日期, hour: 当前小时,store_id:缓存中的健身房id
  * 向服务器发送查询请求，成功后获取预约时间信息
  */
  getappomsg: function () {
    wx.showLoading({
      mask: true,
      title: '查询中...'
    })
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/appoint/status',
      data: {
        date: _self.data.datearray[_self.data.dateindex],
        hour: _self.data.timearrays[_self.data.timeindex].id,
        store_id: _self.data.storearray[_self.data.storeindex].id,
      },
      success(res) {
        wx.hideLoading();
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('获取预约为空');
          return;
        }
        var hour = _self.data.timearrays[_self.data.timeindex].id - 1;
        var hours = _self.data.timearrays[_self.data.timeindex].id;
        hour = common.padstart(hour)
        hours = common.padstart(hours)
        var appoarray = [{
          time: hour + ':00-' + hour + ':10',
          color: '#17C7BC',
          id: 1,
          disabled: false,
          checked: false
        }, {
          time: hour + ':10-' + hour + ':20',
          color: '#17C7BC',
          id: 2,
          disabled: false,
          checked: false
        },
        {
          time: hour + ':20-' + hour + ':30',
          color: '#17C7BC',
          id: 3,
          disabled: false,
          checked: false
        }, {
          time: hour + ':30-' + hour + ':40',
          color: '#17C7BC',
          id: 4,
          disabled: false,
          checked: false
        },
        {
          time: hour + ':40-' + hour + ':50',
          color: '#17C7BC',
          id: 5,
          disabled: false,
          checked: false
        }, {
          time: hour + ':50-' + hours + ':00',
          color: '#17C7BC',
          id: 6,
          disabled: false,
          checked: false
        }
        ]
        for (var i = 1; i <= 6; i++) {
          if (model[i] < 2) {
            appoarray[i - 1].color = '#26CD91';
            appoarray[i - 1].disabled = false
          } else if (1 < model[i] && model[i] < 9) {
            appoarray[i - 1].color = '#ffe700';
            appoarray[i - 1].disabled = false
          } else if (model[i] > 8) {
            appoarray[i - 1].color = '#b84e55';
            appoarray[i - 1].disabled = true
          }
        }
        if (_self.data.dateindex == 0 && _self.data.timeindex == 0) {
          var date = new Date();
          var minute = date.getMinutes();
          if (minute > 9 && minute < 19) {
            appoarray[0].disabled = true;
          } else if (minute > 19 && minute < 29) {
            appoarray[0].disabled = true;
            appoarray[1].disabled = true;
          } else if (minute > 29 && minute < 39) {
            appoarray[0].disabled = true;
            appoarray[1].disabled = true;
            appoarray[2].disabled = true;
          } else if (minute > 39 && minute < 49) {
            appoarray[0].disabled = true;
            appoarray[1].disabled = true;
            appoarray[2].disabled = true;
            appoarray[3].disabled = true;
          } else if (minute > 49 && minute < 59) {
            appoarray[0].disabled = true;
            appoarray[1].disabled = true;
            appoarray[2].disabled = true;
            appoarray[3].disabled = true;
            appoarray[4].disabled = true;
          }
        }
        _self.setData({
          appoarray: appoarray,
          btndisabled: true
        });
      },
      fail(res) {
        common.requestfail();
        return;
      }
    })
  },

  //界面组件部分
  //============================================================================
  // 获取经纬度
  getLoc: function () {
    _self.getstorelist(0, 0);
    return
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res)
        _self.getstorelist(res.latitude, res.longitude);
      },
      fail(res) {
        console.log(res)
        // _self.getsetting();
      }
    })
  },
  // 获取经纬度授权
  getsetting: function () {
    wx.showModal({
      content: '获取您的位置将获得更好体验！',
      showCancel: false,
      success(res) {
        console.log(res)
        if (res.confirm) {
          wx.openSetting({
            success(res) {
              if (res.authSetting["scope.userLocation"] == true) {
                _self.onShow();
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
      },
      fail() {
        wx.reLaunch({
          url: '../../order/index/index'
        })
      }
    })
  },
  // 获取有效日期
  getvaliddate: function (date) {
    var todayyear = date.getFullYear();
    var todaymonth = common.padstart(date.getMonth() + 1)
    var todayday = common.padstart(date.getDate())
    var tomorrow = new Date();
    tomorrow.setTime(tomorrow.getTime() + 24 * 60 * 60 * 1000);
    var tomorrowyear = tomorrow.getFullYear();
    var tomorrowmonth = common.padstart(tomorrow.getMonth() + 1)
    var tomorrowday = common.padstart(tomorrow.getDate())
    _self.setData({
      datearray: [todayyear + '-' + todaymonth + '-' + todayday, tomorrowyear + '-' + tomorrowmonth + '-' + tomorrowday]
    });
  },
  // 获取有效时间
  getvalidtime: function (date) {
    var hour = date.getHours();
    var timearrays = [];
    timearray.forEach(function (item) {
      if (item.id > hour) {
        timearrays = timearrays.concat(item)
      }
    });
    _self.setData({
      timearrays: timearrays
    });
  },
  // 选择健身房
  storepickchange: function (e) {
    _self.setData({
      storeindex: e.detail.value,
      dateshow: false
    });
    _self.getappomsg();
  },
  // 选择日期
  datepickchange: function (e) {
    var model = e.detail.value;
    _self.setData({
      dateindex: model,
      timeshow: false
    });
    if (model == 0) {
      _self.getvalidtime(new Date());
    } else if (model == 1) {
      _self.setData({
        timearrays: timearray
      });
    }
    _self.getappomsg();
  },
  // 选择时间
  timepickchange: function (e) {
    _self.setData({
      timeindex: e.detail.value,
      listshow: true,
    });
    _self.getappomsg();
  },
  //单选改变
  radioChange(e) {
    _self.setData({
      btndisabled: false,
      sectionid: e.detail.value,
      aa: e.detail.value
    });
  },
  //单选点击事件
  checkedfalse: function () {
    var items = _self.data.appoarray;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id == _self.data.aa) {
        for (var j = 0; j < items.length; j++) {
          if (items[j].checked && j != i) {
            items[j].checked = false;
          }
        }
        items[i].checked = !(items[i].checked);
        _self.btndisabled = !items[i].checked
        _self.setData({
          btndisabled: _self.btndisabled
        })
      }
    }
    _self.setData({
      appoarray: items,
    })
  },
})
var timearray = [{
  time: '00:00-01:00',
  id: 1
}, {
  time: '01:00-02:00',
  id: 2
}, {
  time: '02:00-03:00',
  id: 3
}, {
  time: '03:00-04:00',
  id: 4
},
{
  time: '04:00-05:00',
  id: 5
}, {
  time: '05:00-06:00',
  id: 6
}, {
  time: '06:00-07:00',
  id: 7
}, {
  time: '07:00-08:00',
  id: 8
},
{
  time: '08:00-09:00',
  id: 9
}, {
  time: '09:00-10:00',
  id: 10
}, {
  time: '10:00-11:00',
  id: 11
}, {
  time: '11:00-12:00',
  id: 12
},
{
  time: '12:00-13:00',
  id: 13
}, {
  time: '13:00-14:00',
  id: 14
}, {
  time: '14:00-15:00',
  id: 15
}, {
  time: '15:00-16:00',
  id: 16
},
{
  time: '16:00-17:00',
  id: 17
}, {
  time: '17:00-18:00',
  id: 18
}, {
  time: '18:00-19:00',
  id: 19
}, {
  time: '19:00-20:00',
  id: 20
},
{
  time: '20:00-21:00',
  id: 21
}, {
  time: '21:00-22:00',
  id: 22
}, {
  time: '22:00-23:00',
  id: 23
}, {
  time: '23:00-00:00',
  id: 24
},
];