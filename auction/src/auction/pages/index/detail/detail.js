const app = getApp();
var common = require("../../../static/js/common.js");
var _self;
Page({
  //路由数据部分
  //============================================================================
  data: {
    isScroll: true,
    hideauction: true,
    reminded: false,
    checked1: true,
    checked2: true,
    showremind: false,
    fullLoading: true,
    endAuc: false,
    startAuc: false,
    offer: 0,
    tagStyle: {
      img: 'width: 710rpx;margin-left: 20rpx;',
      div: 'background-color: #fff;margin: 40rpx'
    },
    nodes: ''
  },
  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
    _self.setData({
      openId: options.goods_id,
      acc_id: wx.getStorageSync('acc').id,
      type: options.status,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    _self.getDetail();
    _self.get_user_status();
    var lunxun = setInterval(_self.getDetail, 60000);
    _self.setData({
      lunxun
    })

    // 建立长连接
    wx.connectSocket({
      url: 'wss://zguoqiang.com/wss',
    });
    wx.onSocketOpen(function(res) {
      console.log('连接成功', _self.data.openId);
      wx.sendSocketMessage({
        data: JSON.stringify({
          goods_id: _self.data.openId,
          acc_id: _self.data.acc_id
        })
      });
      console.log('给服务端发送一个字符串:test');
    });
    wx.onSocketMessage(function(res) {
      // console.log(JSON.parse(res.data));
      if (JSON.parse(res.data).type === 'init') {
        var client_id = JSON.parse(res.data).client_id;
        var model = {
          client_id: client_id,
          acc_id: wx.getStorageSync('acc').id,
          goods_id: _self.data.openId
        };
        wx.request({
          url: app.globalData.url + 'mini/goodsapi/bind_user',
          method: "post",
          header: common.headerForm,
          data: model,
          success(res) {
            console.log(res);
          },
          fail(res) {
            console.log(res);
          }
        })
      }
      if (JSON.parse(res.data).type === 'data') {
        if (JSON.parse(res.data).data.offer_list.length !== 0) {
          var hignest = JSON.parse(res.data).data.offer_list[0];
          hignest.avatarUrl = app.globalData.qiniuUrl + hignest.avatarUrl;
          var list = JSON.parse(res.data).data.offer_list.slice(1);
          if (list) {
            for (var i = 0; i < list.length; i++) {
              list[i].avatarUrl = app.globalData.qiniuUrl + list[i].avatarUrl;
            };
          }
          _self.setData({
            hignest: hignest,
            list: list
          });
        };

        var goodsInfo1 = JSON.parse(res.data).data.goods;
        //开始价格跟最新价格转换为数字
        goodsInfo1.start_price = parseInt(goodsInfo1.start_price);
        goodsInfo1.last_price = parseInt(goodsInfo1.last_price);
        //商品开始结束时间处理
        goodsInfo1.start_time1 = goodsInfo1.start_time.slice(0, -3);
        goodsInfo1.end_time1 = goodsInfo1.end_time.slice(0, -3);
        goodsInfo1.start_time1 = goodsInfo1.start_time1.split("-");
        goodsInfo1.end_time1 = goodsInfo1.end_time1.split("-");
        goodsInfo1.start_time1 = goodsInfo1.start_time1[0] + '年' + goodsInfo1.start_time1[1] + '月' + goodsInfo1.start_time1[2];
        goodsInfo1.end_time1 = goodsInfo1.end_time1[0] + '年' + goodsInfo1.end_time1[1] + '月' + goodsInfo1.end_time1[2];
        goodsInfo1.start_time1 = goodsInfo1.start_time1.split(" ");
        goodsInfo1.end_time1 = goodsInfo1.end_time1.split(" ");
        goodsInfo1.start_time1 = goodsInfo1.start_time1[0] + '日' + goodsInfo1.start_time1[1];
        goodsInfo1.end_time1 = goodsInfo1.end_time1[0] + '日' + goodsInfo1.end_time1[1];
        //发起人头像处理
        goodsInfo1.avatarUrl = app.globalData.qiniuUrl + goodsInfo1.avatarUrl;
        goodsInfo1.cover_imgs = goodsInfo1.cover_imgs.split(',');
        for (var i = 0; i < goodsInfo1.cover_imgs.length; i++) {
          goodsInfo1.cover_imgs[i] = app.globalData.qiniuUrl + goodsInfo1.cover_imgs[i];
        };

        _self.setData({
          goodsInfo1,
          fullLoading: false
        });
        clearInterval(_self.data.timer);
        _self.format()

        if (_self.data.btn_status == 1) {
          _self.setData({
            money: goodsInfo1.last_price,
            goodsInfo2: goodsInfo1
          });
        };
      };
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //关闭长连接
    wx.closeSocket();
    clearInterval(_self.data.lunxun);
    clearInterval(_self.data.timer);
  },

  onHide:function(){
    clearInterval(_self.data.timer);
  },

  //接口请求部分
  //============================================================================
  /**
   * 后台接口[get_user_status]
   * 参数：acc_id,goods_id
   * 返回保证金状态和是否出价状态
   */
  get_user_status:function(){
    wx.request({
      url: app.globalData.url + 'mini/goodsapi/get_user_status?goods_id=' + _self.data.openId +'&acc_id=' + _self.data.acc_id,
      header: common.headerForm,
      success(res){
        console.log(res);
        _self.setData({
          userStatus:res.data.data
        })
      },
      fail(res){
        console.log(res);
        common.requestFail('获取提交保证金状态信息失败');
        return;
      }
    })
  },
  /**
   * 后台接口[getDetail]
   * 参数：无
   * 返回商品详情信息
   */
  getDetail: function() {
    wx.request({
      url: app.globalData.url + 'mini/goodsapi/goods_show?id=' + _self.data.openId + '&acc_id=' + _self.data.acc_id,
      header: common.headerForm,
      success(res) {
        if (!res.data) {
          common.apiFalse("接口请求未完成", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var goodsInfo1 = res.data.data.goods;
        var offerList = res.data.data.offer_list;
        //发起人头像处理
        goodsInfo1.avatarUrl = app.globalData.qiniuUrl + goodsInfo1.avatarUrl;
        //出价列表
        if (offerList.length !== 0) {
          var hignest = offerList[0];
          hignest.avatarUrl = app.globalData.qiniuUrl + hignest.avatarUrl;
          var list = offerList.slice(1);
          for (var i = 0; i < list.length; i++) {
            list[i].avatarUrl = app.globalData.qiniuUrl + list[i].avatarUrl;
          };
          _self.setData({
            hignest: hignest,
            list: list
          });
        }
        //开始价格跟最新价格转换为数字
        goodsInfo1.start_price = parseInt(goodsInfo1.start_price);
        goodsInfo1.last_price = parseInt(goodsInfo1.last_price);
        //商品封面图片处理
        goodsInfo1.cover_imgs = goodsInfo1.cover_imgs.split(',');
        for (var i = 0; i < goodsInfo1.cover_imgs.length; i++) {
          goodsInfo1.cover_imgs[i] = app.globalData.qiniuUrl + goodsInfo1.cover_imgs[i];
        };
        //商品开始结束时间处理
        goodsInfo1.start_time1 = goodsInfo1.start_time.slice(0, -3);
        goodsInfo1.end_time1 = goodsInfo1.end_time.slice(0, -3);
        goodsInfo1.start_time1 = goodsInfo1.start_time1.split("-");
        goodsInfo1.end_time1 = goodsInfo1.end_time1.split("-");
        goodsInfo1.start_time1 = goodsInfo1.start_time1[0] + '年' + goodsInfo1.start_time1[1] + '月' + goodsInfo1.start_time1[2];
        goodsInfo1.end_time1 = goodsInfo1.end_time1[0] + '年' + goodsInfo1.end_time1[1] + '月' + goodsInfo1.end_time1[2];
        goodsInfo1.start_time1 = goodsInfo1.start_time1.split(" ");
        goodsInfo1.end_time1 = goodsInfo1.end_time1.split(" ");
        goodsInfo1.start_time1 = goodsInfo1.start_time1[0] + '日' + goodsInfo1.start_time1[1];
        goodsInfo1.end_time1 = goodsInfo1.end_time1[0] + '日' + goodsInfo1.end_time1[1];
        //富文本解析
        var imgtxt = goodsInfo1.imgtxt;
        //返回数据存入data
        _self.setData({
          goodsInfo1: goodsInfo1,
          offerList: offerList,
          nodes: imgtxt,
          fullLoading: false,
          endTime: goodsInfo1.delay_time
        });
        if (_self.data.timer) {
          clearInterval(_self.data.timer);
          _self.format();
        } else {
          _self.format();
        }
      },
      fail(res) {
        common.requestFail('获取商品详情信息失败');
        return;
      },
    });
  },

  //出价按钮点击事件
  /**
   * 后台接口[goods_offer_add]
   * 参数：acc_id,goods_id,money
   * 返回值：无
   */
  goods_offer_add: function() {

    if (_self.data.money <= parseInt(_self.data.goodsInfo1.last_price) || !_self.data.money) {
      wx.showModal({
        title: '温馨提示',
        content: '出价必须大于上次价格,请加价',
      });
      return;
    };
    wx.showModal({
      title: '温馨提示',
      content: '本次出价' + _self.data.money + '元，不可撤回，请谨慎出价',
      success(res) {
        if (res.confirm) {
          var model = {
            acc_id: _self.data.acc_id,
            goods_id: _self.data.openId,
            money: _self.data.money
          };
          wx.request({
            url: app.globalData.url + 'mini/goodsapi/goods_offer_add',
            data: model,
            header: common.headerForm,
            method: 'post',
            success(res) {
              if (!res.data) {
                common.apiFalse("接口请求未完成", '错误代码' + res.data.code + res.data.msg);
                return;
              };
              if (res.data.data) {
                wx.showToast({
                  title: '出价bu成功1',
                });
              } else {
                _self.setData({
                  btn_status: 1,
                  hideauction: false
                });
                wx.showToast({
                  title: res.data.msg,
                });
                _self.get_user_status();
              };

            },
            fail(res) {
              common.requestFail('出价接口请求失败');
              return;
            },
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        };
      }
    });
  },

  //界面组件部分
  //============================================================================
  /**
   * 下拉刷新组件
   */
  onPullDownRefresh: function() {
    var page = _self.data.page;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    // 隐藏导航栏加载框
    setTimeout(function() {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1000);
  },
  changeMoney: function() {
    _self.setData({
      btn_status: 1
    });
  },
  //出价的加减按钮
  changbtn(e) {
    var value = e.detail[0];
    _self.setData({
      btn_status: 0,
      money: value
    });
    // 点击后是否出价,
    // if(_self.data.offer==0){
    //   var lunxun = setInterval(_self.changeMoney, 5000);
    //   _self.setData({
    //     lunxun
    //   });
    // }
  },
  //所有的点击事件
  actionBtn: function(e) {
    var action = e.currentTarget.dataset.action;
    var value = e.currentTarget.dataset.value;
    switch (action) {
      //跳转支付保证金页面
      case 'pay':
        wx.navigateTo({
          url: './paybzj/paybzj?bond_price=' + _self.data.goodsInfo1.bond_price + '&goods_id=' + _self.data.goodsInfo1.id,
        });
        break;
        //跳转回首页,回首页参与更多
      case 'home':
        // wx.navigateBack({
        //   delta: 1
        // });
        wx.switchTab({
          url: '../index',
        })
        break;
        //点击预览头部图片
      case 'pre':
        wx.previewImage({
          current: value,
          urls: _self.data.goodsInfo1.cover_imgs
        });
        break;
        //点击预览详情图片
        // case 'preDetail':
        //   wx.previewImage({
        //     current: value,
        //     urls: _self.data.goodsInfo.detail_imgs
        //   });
        //   break;
        //点击提醒我按钮
      case 'remind':
        _self.setData({
          reminded: true,
          isScroll: false,
          showremind: true
        });
        break;
        //点击查看提醒按钮
      case 'lookremind':
        _self.setData({
          reminded: false,
          isScroll: false,
          showremind: true,
        });
        break;
        //点击隐藏出价者列表按钮
      case 'hideList':
        _self.setData({
          hideauction: true
        });
        break;
        //点击显示出价者列表按钮
      case 'showauc':
        _self.setData({
          hideauction: true
        });
        break;
        //点击显示出价者列表按钮
      case 'hideauc':
        _self.setData({
          hideauction: false,
          isScroll: false,
        });
        break;
        //点击执行确认出价操作
      case 'paymoney':
        _self.goods_offer_add();
        break;
        //点击改变提醒页面的第一个单选按钮
      case 'changechecked1':
        _self.setData({
          checked1: !_self.data.checked1
        });
        break;
        //点击改变提醒页面的第二个单选按钮
      case 'changechecked2':
        _self.setData({
          checked2: !_self.data.checked2
        });
        break;
        //点击改变提醒页面的第三个单选按钮
      case 'changechecked4':
        _self.setData({
          checked4: !_self.data.checked4
        });
        break;
        //提醒弹出页面的完成按钮
      case 'remindme':
        _self.setData({
          showremind: false,
          reminded: true,
        });
        break;
      default:
        break;
    };
  },
  //时间处理
  format() {
    // var currentTime = new Date();
    // // var endTimes = new Date(_self.data.endTime);
    // var endTimes = new Date(_self.data.endTime.replace(/\-/g, "/"));
    // var leftTimeStamp = endTimes.getTime() - currentTime.getTime();
    var leftTimeStamp = _self.data.goodsInfo1.countdown_time;
    if (leftTimeStamp > 0) {
      // leftTimeStamp = leftTimeStamp / 1000;
      var leftHour = Math.floor(leftTimeStamp / 3600),
        leftMinutes = Math.floor(leftTimeStamp % 3600 / 60),
        leftSeconds = Math.floor(leftTimeStamp % 3600 % 60);
      _self.setData({
        leftHour: leftHour < 10 ? '0' + leftHour : leftHour,
        leftMinutes: leftMinutes < 10 ? '0' + leftMinutes : leftMinutes,
        leftSeconds: leftSeconds < 10 ? '0' + leftSeconds : leftSeconds
      });
    } else {
      _self.setData({
        leftHour: '00',
        leftMinutes: '00',
        leftSeconds: '00'
      });
      return;
    };
    _self.countDown();
  },
  //倒计时功能
  countDown() {
    var that = _self;
    var leftSeconds = that.data.leftSeconds;
    if (parseInt(that.data.leftHour) >= 0 && parseInt(that.data.leftMinutes) >= 0 && parseInt(that.data.leftSeconds) >= 0) {
      that.setData({
        timer: setInterval(function() {
          leftSeconds--;
          console.log(leftSeconds)
          if (leftSeconds >= 0) {
            that.setData({
              leftSeconds: leftSeconds < 10 ? '0' + leftSeconds : leftSeconds
            });
            if (that.data.leftMinutes <= 0 && that.data.leftSeconds <= 0) {
              var leftHour = that.data.leftHour;
              if (leftHour > 0) {
                leftHour--;
              } else {
                if (_self.data.leftSeconds == '00' && _self.data.leftHour == '00' && _self.data.leftMinutes == '00') {
                  clearInterval(that.data.timer);
                  _self.format();
                  if (_self.data.goodsInfo1.status == 1) {
                    _self.setData({
                      startAuc: false,
                      endAuc: true,
                      'goodsInfo1.status': 3
                    })
                  } else if (_self.data.goodsInfo1.status == 2) {
                    _self.setData({
                      startAuc: true,
                      'goodsInfo1.status': 1
                    });
                  }
                  _self.getDetail();
                };
                return;
              };
              that.setData({
                leftHour: leftHour < 10 ? '0' + leftHour : leftHour,
                leftMinutes: 60
              });
              clearInterval(that.data.timer);
              that.countDown();
            };
          };
          if (leftSeconds < 0) {
            var leftMinutes = that.data.leftMinutes;
            if (leftMinutes > 0) {
              leftMinutes--;
            } else {
              clearInterval(that.data.timer);
              return;
            };
            that.setData({
              leftSeconds: 59,
              leftMinutes: leftMinutes < 10 ? '0' + leftMinutes : leftMinutes
            });
            clearInterval(that.data.timer);
            that.countDown();
          };
        }, 1000)
      });
    };
  }
})



// niname: function() {
//   if (_self.data.hignest) {
//     var niname = _self.data.hignest[0].name.substr(0, 1)
//     _self.setData({
//       firstniname: niname
//     })
//   };
//   _self.data.list.forEach((index) => {
//     var niname = index.name.substr(0, 1);
//     var nilist = _self.data.niname;
//     nilist.push(niname);
//     _self.setData({
//       niname: nilist
//     });
//   }, _self)
// },