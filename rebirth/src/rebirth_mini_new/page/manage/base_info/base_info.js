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
    date: '1993-06-19',
    times: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    index: 2,
    gender: ['未设置', '男', '女'],
    height: [],
    weight: [],
    cmIndex: 35,
    kgIndex: 40,
    genderIndex: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
    _self.setHeight();
    _self.setWeight();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    _self.acc_show();
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

  //后台接口部分
  //=======================================================
  /**
   * 微信请求用户实体信息 [acc_show]
   * 参数：acc_id
   * 返回用户实体信息
   */

  acc_show: function() {
    wx.request({
      url: app.globalData.url + 'mini/manageapi/acc_show?acc_id=' + wx.getStorageSync('acc').id,
      method: 'post',
      success(res) {
        //wx.setStorageSync('acc', res.data.data);
        var model = res.data.data;
        model.avatarUrl = app.globalData.imgUrl + model.avatarUrl;
        _self.setData({
          info: model,
          // date: model.birthday,
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  /**
   * 执行用户信息修改 [acc_edit_info]
   * 参数 acc_id
   * 返回实体信息
   */
  acc_edit_info: function(model) {
    wx.request({
      url: app.globalData.url + 'mini/manageapi/acc_edit_info',
      data: model,
      method: 'post',
      header: common.headerForm,
      success(res) {
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

  //界面组件部分
  //====================================================
  // 修改日期
  bindDateChange(e) {
    _self.setData({
      date: e.detail.value
    })
    var model = {
      acc_id: wx.getStorageSync('acc').id
    };
    model.birthday = _self.data.date;
    _self.acc_edit_info(model);
  },
  // 修改目标次数
  bindPickerChange(e) {
    _self.setData({
      index: e.detail.value
    });
    var model = {
      acc_id: wx.getStorageSync('acc').id
    };
    model.moving_target = _self.data.times[_self.data.index];
    _self.acc_edit_info(model);
  },
  // 修改身高
  bindCmChange(e) {
    _self.setData({
      cmIndex: e.detail.value,
    })
    var model = {
      acc_id: wx.getStorageSync('acc').id
    };
    model.height = _self.data.height[_self.data.cmIndex];
    _self.acc_edit_info(model);
  },
  // 修改体重
  bindKgChange(e) {
    _self.setData({
      kgIndex: e.detail.value
    })
    var model = {
      acc_id: wx.getStorageSync('acc').id
    };
    model.weight = _self.data.weight[_self.data.kgIndex];
    _self.acc_edit_info(model);
  },
  // 修改性别
  bindGenderChange: function(e) {
    _self.setData({
      genderIndex: e.detail.value
    });
    var model = {
      acc_id: wx.getStorageSync('acc').id
    };
    model.gender = parseInt(_self.data.genderIndex);
    _self.acc_edit_info(model);
  },
  // 为身高range填充数据
  setHeight() {
    for (var i = 140; i < 220; i++) {
      _self.data.height.push(i)
    }
    _self.setData({
      height: _self.data.height
    })
  },
  // 为体重range填充数据
  setWeight() {
    console.log(12223)
    for (var i = 30; i < 200; i++) {
      _self.data.weight.push(i)
    }
    _self.setData({
      weight: _self.data.weight
    })
  },
  //确认修改昵称
  comfirmEdit: function(e) {
    _self.setData({
      nickName:e.detail.value
    });
    var model = {
      acc_id: wx.getStorageSync('acc').id
    };
    model.nickName = _self.data.nickName;
    _self.acc_edit_info(model);
  },
  // 点击事件汇总
  actionBtn: function(e) {
    var type = e.currentTarget.dataset.action;
    switch (type) {
      case 'comfirm':
        wx.showModal({
          title: '确认修改信息',
          content: '修改信息成功，并返回我的页面',
          success(res){
            if (res.confirm) {
              wx.switchTab({
                url: '../index/index',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;

      default:
        break;
    }
  },
})

// resetCm(e) {
//   _self.setData({
//     cm: e.detail.value
//   });
//   if (_self.data.cm < 50 || _self.data.cm > 250 || !_self.data.cm) {
//     wx.showModal({
//       title: '警告',
//       content: '请输入真实的身高值',
//     })
//   } else {
//     var model = {
//       acc_id: wx.getStorageSync('acc').id
//     };
//     model.height = _self.data.cm;
//     _self.acc_edit_info(model);
//   }
// },
// resetKg(e) {
//   _self.setData({
//     kg: e.detail.value
//   });
//   if (_self.data.kg < 30 || _self.data.kg > 250 || !_self.data.kg) {
//     wx.showModal({
//       title: '警告',
//       content: '请输入真实的体重值',
//     })
//   } else {
//     var model = {
//       acc_id: wx.getStorageSync('acc').id
//     };
//     model.weight = _self.data.kg;
//     _self.acc_edit_info(model);
//   }
// },