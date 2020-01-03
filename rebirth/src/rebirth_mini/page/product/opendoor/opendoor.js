/**
 * name:我的预约页面
 * info:获取预约，取消预约，倒计时更新二维码
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
    qrimgurl: '',
    qrname: '更新',
    disabled: false,
    uid: 0,
    num: 59,
    timer: '',
    appointtitle: '请将二维码对准黑色门锁！',
    qrcodeshow: false,
    appointinfo: [],
    showqrcode: true
  },
  onLoad: function () {
    _self = this;
    pages = getCurrentPages();
    prevPage = pages[pages.length - 2];
  },
  onReady: function () {
    _self.setData({
      qrimgurl: '',
      qrname: '更新',
      disabled: false
    });
    _self.getstorage();
  },
  onUnload() {
    clearTimeout(_self.data.timer);
  },
  toindex: function () {
    wx.reLaunch({
      url: '../../order/index/index'
    })
  },
  
  //接口请求部分
	//============================================================================

  /**
	 * 后台接口[getmyappoint]获取预约信息
	 * 参数：uid:用户唯一标识id
	 * 函数节流2秒触发一次，向服务器发送请求成功后如在预约时间内调用getqrcode，然后调用countdown
	 */
  getmyappoint: common.throttle(function () {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/appoint/myappoint?uid=' + _self.data.uid,
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('获取预约信息为空');
          return;
        }
        if (model.is_now == 1) {
          _self.setData({
            appointtitle: '请将二维码对准黑色门锁！',
            qrcodeshow: false,
            appointinfo: model,
            showqrcode: false
          });
          _self.getqrcode();
          console.log('预约时间内')
        }
        if (model.is_now == 2) { //预约时间外
          _self.setData({
            appointtitle: '我的预约信息',
            qrcodeshow: true,
            appointinfo: model,
            showqrchde: true
          });
          console.log('预约时间没到和超过外')
        }
        _self.countdown();
      },
      fail(res) {
        common.requestfail();
        return;
      }
    })
  }, 2000),

  /**
	 * 后台接口[getqrcode]获取开门码
	 * 参数：uid:用户唯一标识id
	 * 向服务器发送请求成功后将获得的url赋值给二维码url并存到data中
	 */ 
  getqrcode: function () {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/ercode/opencode',
      data: {
        uid: _self.data.uid,
      },
      success(res) {
        // if (res.data.code == 100) {
        //     wx.showModal({
        //       content: '余额不足！',
        //       showCancel: false,
        //       success(res) {
        //         if (res.confirm) {
        //           wx.wx.redirectTo({
        //             url:'../../order/recharge/recharge'
        //           });
        //         } 
        //       }
        //     });
        //     return;
        // }
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('获取开门码为空');
          return;
        }
        _self.setData({
          qrimgurl: model.url,
        });
      },
      fail() {
        common.requestfail();
        return;
      }
    });

  },

  /**
	 * 后台接口[cancelappo]取消预约
	 * 参数：uid:用户唯一标识id，appoint_id
	 * 判断预约时间距离当前差，根据不同的终端格式化日期格式，向服务器请求取消预约成功后定时器跳转回首页
	 */
  cancelappo: function () {
    var time1 = _self.data.appointinfo.section.slice(0, 6)
    var time2 = time1.match(/(\S*):/)[1];
    var time3 = time1.match(/:(\S*)-/)[1];
    dateInfo = _self.data.appointinfo
    a = dateInfo.year + '-' + common.padstart(dateInfo.month) + '-' + common.padstart(dateInfo.day) + ' ' + common.padstart(time2) + ':' + common.padstart(time3) + ':00'
    // if (_self.data.appointinfo.month < 10) {
    //   if (_self.data.appointinfo.day < 10) {
    //     if (time2 < 10) {
    //       var a = _self.data.appointinfo.year + '-0' + _self.data.appointinfo.month + '-0' + _self.data.appointinfo.day +
    //         ' 0' + time2 + ':' + time3 + ':00';
    //     } else {
    //       var a = _self.data.appointinfo.year + '-0' + _self.data.appointinfo.month + '-0' + _self.data.appointinfo.day +
    //         ' ' + time2 + ':' + time3 + ':00';
    //     }
    //   } else {
    //     if (time2 < 10) {
    //       var a = _self.data.appointinfo.year + '-0' + _self.data.appointinfo.month + '-' + _self.data.appointinfo.day +
    //         ' 0' + time2 + ':' + time3 + ':00';
    //     } else {
    //       var a = _self.data.appointinfo.year + '-0' + _self.data.appointinfo.month + '-' + _self.data.appointinfo.day +
    //         ' ' + time2 + ':' + time3 + ':00';
    //     }
    //   }
    // } else {
    //   if (_self.data.appointinfo.day < 10) {
    //     if (time2 < 10) {
    //       var a = _self.data.appointinfo.year + '-' + _self.data.appointinfo.month + '-0' + _self.data.appointinfo.day +
    //         ' 0' + time2 + ':' + time3 + ':00';
    //     } else {
    //       var a = _self.data.appointinfo.year + '-' + _self.data.appointinfo.month + '-0' + _self.data.appointinfo.day +
    //         ' ' + time2 + ':' + time3 + ':00';
    //     }
    //   } else {
    //     if (time2 < 10) {
    //       var a = _self.data.appointinfo.year + '-' + _self.data.appointinfo.month + '-' + _self.data.appointinfo.day +
    //         ' 0' + time2 + ':' + time3 + ':00';
    //     } else {
    //       var a = _self.data.appointinfo.year + '-' + _self.data.appointinfo.month + '-' + _self.data.appointinfo.day +
    //         ' ' + time2 + ':' + time3 + ':00';
    //     }
    //   }
    // }
    var b;
    wx.getSystemInfo({
      success(res) {
        if (res.platform == "devtools") {
          b = new Date(a);
        } else if (res.platform == "ios") {
          b = new Date(Date.parse(a.replace(/-/g, '/')));
        } else if (res.platform == "android") {
          b = new Date(a);
        }
      }
    });
    var c = b.getTime();
    var d = (new Date()).getTime();
    if (c < d) {
      wx.showModal({
        content: '离预约时间2小时以内取消和超时，会扣减8小时会员时间!',
        confirmColor: '#b84e55',
        success(res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.miniserverUrl + 'rebirth/appoint/cancle',
              data: {
                uid: _self.data.uid,
                appoint_id: _self.data.appointinfo.appoint_id
              },
              success(res) {
                if (res.data.code !== 200) {
                  common.apirequestfail(res.data.msg);
                  return;
                }
                var model = res.data.result;
                if (model == '') {
                  common.apimodelerror('获取取消预约为空');
                  return;
                }
                if (prevPage) {
                  prevPage.onReady();
                }
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 1500
                });
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../../order/index/index'
                  })
                }, 1500)
              },
              fail(res) {
                common.requestfail();
                return;
              }
            })
          } else if (res.cancel) {
            return;
          }
        }
      })
    } else {
      if ((c - d) > 7200000) {
        wx.request({
          url: app.globalData.miniserverUrl + 'rebirth/appoint/cancle',
          data: {
            uid: _self.data.uid,
            appoint_id: _self.data.appointinfo.appoint_id
          },
          success(res) {
            if (res.data.code !== 200) {
              common.apirequestfail(res.data.msg);
              return;
            }
            var model = res.data.result;
            if (model == '') {
              common.apimodelerror('获取取消预约为空');
              return;
            }
            if (prevPage) {
              prevPage.onReady();
            }
            wx.showToast({
              title: '取消成功',
              icon: 'success',
              duration: 1500
            });
            setTimeout(function () {
              wx.reLaunch({
                url: '../../order/index/index'
              })
            }, 1500)
          },
          fail(res) {
            common.requestfail();
            return;
          }
        })
      } else {
        wx.showModal({
          content: '离预约时间2小时以内取消和超时，会扣减8小时会员时间!',
          confirmColor: '#b84e55',
          success(res) {
            if (res.confirm) {
              wx.request({
                url: app.globalData.miniserverUrl + 'rebirth/appoint/cancle',
                data: {
                  uid: _self.data.uid,
                  appoint_id: _self.data.appointinfo.appoint_id
                },
                success(res) {
                  if (res.data.code !== 200) {
                    common.apirequestfail(res.data.msg);
                    return;
                  }
                  var model = res.data.result;
                  if (model == '') {
                    common.apimodelerror('获取取消预约为空');
                    return;
                  }
                  if (prevPage) {
                    prevPage.onReady();
                  }
                  wx.showToast({
                    title: '取消成功',
                    icon: 'success',
                    duration: 1500
                  });
                  setTimeout(function () {
                    wx.reLaunch({
                      url: '../../order/index/index'
                    })
                  }, 1500)
                },
                fail(res) {
                  common.requestfail();
                  return;
                }
              })
            } else if (res.cancel) {
              return;
            }
          }
        });
      }
    }
  },
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
        _self.getmyappoint(res.data.uid);
      },
      fail() {
        wx.reLaunch({
          url: '../../order/index/index'
        })
      }
    });
  },
  // 倒计时
  countdown: function () {
    _self.setData({
      timer: setTimeout(function () {
        if (_self.data.num <= 0) {
          // clearInterval(timer);
          _self.setData({
            qrname: '更新',
            num: 59,
            disabled: false
          });
        } else {
          _self.setData({
            qrname: _self.data.num + "s",
            num: _self.data.num - 1,
            disabled: true
          });
          _self.countdown();
        }
      }, 1000)
    });

  },
  
})


