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
    manage_store_id:0,
    storeData:{
      name:'正在获取',
      address:'门店地址信息'
    },
    incomeData:{

    },
    introIndex: 1,
    currentTab: 0,
    weekday: ['日', '一', '二', '三', '四', '五', '六', '日', '一', '二', '三', '四', '五', '六'],
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
    _self.getDate();
    _self.setData({
      chooseDate: _self.data.date1,
      manage_store_id: options.manage_store_id
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    _self.store_show();
    _self.order_report();
    _self.setHeight();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    _self.goods_list();
  },

  //后台接口部分
  //=======================================================
  /**
   * 获取门店信息 [store_show]
   * 参数：id
   * 返回:门店信息
   */
  store_show: function(e) {
    wx.request({
      url: app.globalData.url + 'mini/storeapi/store_show',
      data: {
        id:_self.data.manage_store_id
      },
      method: 'get',
      header: common.headerForm,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("门店信息不存在", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var model = res.data.data;
        _self.setData({
          storeData: model
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 获取门店收入信息 [order_report]
   * 参数：store_id
   * 返回:门店信息
   */
  order_report: function(e) {
    wx.request({
      url: app.globalData.url + 'mini/orderapi/order_report',
      data: {
        store_id: _self.data.manage_store_id
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("报告信息错误", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        _self.setData({
          incomeData: res.data.data
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 获取课表 [goods_list]
   * 参数：page,limit,dayn,store_id
   * 返回:课表信息
   */
  goods_list: function(e) {
    wx.request({
      url: app.globalData.url + 'mini/storeapi/goods_list',
      data: {
        page: 0,
        limit: 0,
        store_id: _self.data.manage_store_id,
        dayn: _self.data.chooseDate
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("商品信息列表", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var goodsListData = res.data.data;
        goodsListData.forEach(function(item) {
          item.begin_time = item.begin_time.substr(11, 5);
          item.end_time = item.end_time.substr(11, 5);
          item.label = item.label.replace(/ /g, ' · ');
          item.volume = parseInt(item.volume);
          item.appoint_total = parseInt(item.appoint_total);
        })
        _self.setData({
          goodsList: goodsListData
        })
        _self.setHeight();
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 删除课程 [goods_delete]
   * 参数：id
   * 返回:无
   */
  goods_delete: function(id) {
    wx.request({
      url: app.globalData.url + 'mini/storeapi/goods_delete',
      data: {
        id: id
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("删除信息成功", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        _self.goods_list();
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  /**
   * 删除课程 [goods_done]
   * 参数：id
   * 返回:无
   */
  goods_done: function(id) {
    wx.request({
      url: app.globalData.url + 'mini/storeapi/goods_done',
      data: {
        id: id
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("删除信息成功", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        _self.goods_list();
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  //界面组件部分
  //====================================================
  // 点击事件汇总
  actionBtn: function(e) {
    var type = e.currentTarget.dataset.action;
    var id = e.currentTarget.dataset.id;
    var btn = e.currentTarget.dataset.btn;
    switch (type) {
      case 'switch':
        break;
      case 'setClass':
        wx.navigateTo({
          url: '../goods_add/goods_add?store_id=' + _self.data.manage_store_id,
        })
        break;
      case 'detail':
      if(btn==1){
        wx.navigateTo({
          url: '../appoint_acc_list/appoint_acc_list?id=' + id,
        })
      }else{
        common.showToast("已结束的课程无法查看")
      }
        
        break;
      default:
        break;
    }
  },
  done(e) {
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认完成该课程吗？',
      content: '确认后，课程将直接结束，不可再次预约，不可撤回，请谨慎操作？',
      success(res) {
        if (res.confirm) {
          _self.goods_done();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  deleteClass(e) {
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除课程？',
      content: '确认后，课程将消失，请谨慎操作？',
      success(res) {
        if (res.confirm) {
          _self.goods_delete(id);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 获取日期
  getDate() {
    var date = new Date();
    var date2 = new Date((new Date).getTime() + 24 * 60 * 60 * 1000);
    var date3 = new Date((new Date).getTime() + 24 * 60 * 60 * 1000 * 2);
    var date4 = new Date((new Date).getTime() + 24 * 60 * 60 * 1000 * 3);
    var date5 = new Date((new Date).getTime() + 24 * 60 * 60 * 1000 * 4);
    var date6 = new Date((new Date).getTime() + 24 * 60 * 60 * 1000 * 5);
    var zhou = date.getDay()
    _self.setData({
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
    var winHeight = 210 * _self.data.goodsList.length + 40;
    if (_self.data.goodsList.length == 0) {
      winHeight = 328
    }
    _self.setData({
      winHeight
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
      //_self.goods_list();
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
  footerTap: app.footerTap
})