const app = getApp();
var common = require('../../../static/js/common.js');
var util = require('../../../utils/util.js');
var _self;
Page({
  //路由数据部分
  //============================================================================
  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    date: util.formatTime3(new Date()),
    start_time: '08:00',
    end_time: '08:42',
    classes: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
    _self.setData({
      store_id: options.store_id
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onReady: function() {
    _self.course_list();
  },

  //后台接口部分
  //=======================================================
  /**
   * 获取排课内容 [course_list]
   * 参数：page,limit
   * 返回:排课内容
   */
  course_list: function(e) {
    wx.request({
      url: app.globalData.url + 'mini/storeapi/course_list',
      data: {
        page: 0,
        limit: 0
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("获取课程信息失败", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var model = res.data.data;
        var model1 = [];
        model.forEach(function(item) {
          model1.push(item.name + " （" + item.duration +"分钟）");
        })
        _self.setData({
          classes: model1,
          classInfo: model
        })
      },
      fail(res) {
        common.apiFalse("请求接口失败，未能获取排课信息")
      }
    })
  },
  /**
   * 确认排课内容 [goods_edit]
   * 参数：id,store_id,course_id等
   * 返回:无
   */
  goods_edit: function(e) {
    var end_time = _self.data.date + ' ' + _self.data.start_time;
    end_time = Date.parse(end_time);
    end_time = end_time + _self.data.classInfo[_self.data.index].duration * 60000;
    end_time = new Date(end_time);
    end_time = util.formatTime2(end_time);
    if (!_self.data.setNumed) {
      _self.setData({
        classNum: _self.data.classInfo[_self.data.index].volume
      })
    }
    wx.request({
      url: app.globalData.url + 'mini/storeapi/goods_edit',
      data: {
        id: 0,
        store_id: _self.data.store_id,
        course_id: _self.data.classInfo[_self.data.index].id,
        dayn: _self.data.date,
        begin_time: _self.data.date + ' ' + _self.data.start_time,
        end_time: end_time,
        volume: _self.data.classNum
      },
      method: 'post',
      header: common.headerForm,
      success(res) {
        if (!res.data.res) {
          common.apiFalse("课程添加失败", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        wx.navigateBack({
          delta: 1
        });
      },
      fail(res) {
        common.apiFalse("请求接口失败，未能成功排课")
      }
    })
  },


  //界面组件部分
  //====================================================
  // 点击事件汇总
  actionBtn: function(e) {
    var type = e.currentTarget.dataset.action;
    switch (type) {
      case 'comfirm':
        wx.showModal({
          title: '确认在 ' + _self.data.date + _self.data.start_time + '添加' + _self.data.classes[_self.data.index],
          content: '添加后将按照对应时间自动开课，不可重复',
          success(res) {
            if (res.confirm) {
              _self.goods_edit();
              return;
            }
            common.showToast('用户点击取消');
          }
        })
        break;
      default:
        break;
    }
  },
  setClass(e) {
    _self.setData({
      index: e.detail.value
    })
  },
  bindDateChange(e) {
    _self.setData({
      date: e.detail.value
    })
  },
  bindTimeChange1(e) {
    _self.setData({
      start_time: e.detail.value
    })
    var end_time = _self.data.date + ' ' + _self.data.start_time;
    end_time = Date.parse(end_time);
    end_time = end_time + _self.data.classInfo[_self.data.index].duration * 60000;
    end_time = new Date(end_time);
    end_time = util.formatTime2(end_time);
    end_time = end_time.substr(11, 5);
    _self.setData({
      end_time
    })
  },
  bindTimeChange2(e) {
    _self.setData({
      end_time: e.detail.value
    })
  },
  name(e) {
    _self.setData({
      index: e.detail.value
    })
  },
  num(e) {
    _self.setData({
      classNum: e.detail.value,
      setNumed: true
    })
  },

})