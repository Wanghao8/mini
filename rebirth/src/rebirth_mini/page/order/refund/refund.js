/**
 * name:退款页面
 * info:选择类型和时长进行退款操作
 * auth:王豪
 */
var _self;
var common = require("../../../static/js/common.js");
var app = getApp();
var id;
Page({
  //路由数据部分
  //============================================================================
  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    model: '',
    residue_time: '',
    month_num: 0,   //可以退款的值  /月
    num: 0,  //要退的月数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _self = this;
    _self.getstorage()
  },

  //接口请求部分
  //============================================================================
  /**
	 * 后台接口[getUserById]获取用户信息
	 * 参数：uid
	 * 调用接口获取用户信息，计算好剩余会员时间，存入data中
	 */
  getUserById: function (uid) {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/user/getinfo?uid=' + uid,
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('获取用户为空');
          return;
        }
        model.residue_time = common.converttime(model.residue_time + model.prepare_time);
        // console.log(model.residue_time)   当前剩余时间+刚充值没有用的时间

        // var tmp = Date.parse(new Date()).toString();
        // tmp = tmp.substr(0, 10);
        // var end_time = common.converttime(model.end_time - tmp)
        if (model.residue_time.substring(1, 2) == '月') {
          var month_num = model.residue_time.substring(0, 1)
          _self.setData({
            month_num: month_num
          })
        }
        if (model.residue_time.substring(2, 3) == '月') {
          var month_num = model.residue_time.substring(0, 2)
          _self.setData({
            month_num: model.residue_time.substring(0, 2)
          })
        }

        if (_self.data.month_num > 0) {
          // console.log('可以退款')
        } else {
          // console.log('不可以退款')
          common.showToast('您的剩余时间不足以退款', 'none', 2000)
        }
        _self.setData({
          model: model
        });
      },
      fail() {
        common.requestfail();
        return;
      }
    })
  },
  /**
	 * 后台接口[registerFormSubmit]执行退款操作
	 * 参数：uid,type,num,formid
	 * 向服务器发送退款请求，成功后调用getUserById，再次计算剩余会员时间
	 */
  //退款操作
  registerFormSubmit: function (e) {
    //    打印formId
    // console.log(e.detail.formId);
    if (_self.data.month_num == 0) {
      common.showToast('您暂时还不能退款', 'none', 2000)
      return
    }
    if (_self.data.num == 0) {
      common.showToast('请选择要退款的月数', 'none', 2000)
      return
    }
    wx.showModal({
      content: '您确定要退款吗？',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定');
          common.showLoading('退款中～')
          wx.request({
            url: app.globalData.miniserverUrl + 'rebirth/refund/refund',
            data: {
              uid: _self.data.uid,
              type: 'month',
              num: _self.data.num,
              formid: e.detail.formId
            },
            success(res) {
              // console.log(res)
              if (res.data.code == 200) {
                // common.apimodelerror('操作成功')
                wx.showModal({
                  title: '操作成功',
                  content: '请联系店内服务人员',
                  showCancel: false,
                  success(res) {
                  }
                })
                _self.getUserById(_self.data.uid);
                // setTimeout(function () {
                //   wx.navigateBack({
                //     delta: 1,
                //   })
                // }, 1000)
                common.hideLoading()
              } else {
                common.hideLoading()
                common.apirequestfail(res.data.msg);
                return
              }
            },
            fail() {
              common.requestfail();
              return;
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消');
        }
      }
    });

    return

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
        _self.getUserById(res.data.uid);
      },
      fail() {
        wx.reLaunch({
          url: '../../order/index/index'
        })
      }
    })
  },
  //返回首页
  go_index() {  
    wx.reLaunch({
      url: '../../order/index/index'
    })
  },
  //当前选择的卡种
  ChoseMemcard(e) {
    var type;
    if (e.currentTarget.dataset.type == '年卡') {
      type = 'year';
    } else if (e.currentTarget.dataset.type == '月卡') {
      type = 'month';
    } else if (e.currentTarget.dataset.type == '季卡') {
      type = 'season';
    } else if (e.currentTarget.dataset.type == '100次卡') {
      type = 'hundred';
    } else if (e.currentTarget.dataset.type == '1次卡') {
      type = 'time';
    } else if (e.currentTarget.dataset.type == '10次卡') {
      type = 'xun';
    }
    console.log(type)
    _self.setData({
      id: e.currentTarget.dataset.id,
      price: e.currentTarget.dataset.price,
      type: type,
      customnumber: 1,
    })
    if (e.currentTarget.dataset.type == 'day') {
      _self.setData({
        price: 66,
        customprice: 66
      });
    }
  },
  //添加
  add() {
    var num = _self.data.num;
    var month_num = _self.data.month_num
    // console.log(month_num)
    // 如果大于1时，才可以减  
    if (num < month_num) {
      num++;
      // 将数值与状态写回  
      _self.setData({
        num: num,
      });
    } else {

      return
    }
  },
  //减少
  remove() {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
      // 将数值与状态写回  
      this.setData({
        num: num,
      });
    } else {
      // common.showToast('不能小于0', 'none', 2000)
      return
    }
  },

})