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
    fullLoading: true
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
    _self.goods_show();
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
      path: '/page/store/course_show/course_show',
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
        console.log(res);
        if (res.data.msg == '预约成功') {
          console.log(165)
          wx.showModal({
            title: '提示',
            content: '预约成功，是否返回首页',
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../course_list/course_list?reserver=' + JSON.stringify(_self.data.course),
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
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
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
          name: location.address
        })
        break;
      case 'resever':
        wx.showModal({
          title: '提示',
          content: '确定约课' + _self.data.course.start_time1 + _self.data.course.course_name + '?',
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
  }
})