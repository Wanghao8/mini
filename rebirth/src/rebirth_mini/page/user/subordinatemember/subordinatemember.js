/**
 * name:我的运动伙伴页面
 * info:读取缓存、获取运动伙伴、上拉加载
 * auth:王豪
 */
var _self;
var common = require("../../../static/js/common.js");
var app = getApp();
Page({
  //路由数据部分
	//============================================================================

  data: {
    graceFullLoading: true,
    loadingType: 0,
    isEnd: false,
    page: 0,
    limit: 40,
    memberlist: [],
    havelist: false,
    imgwidth: 56
  },
  onLoad: function(options) {
    _self = this;
    let mobile = wx.getSystemInfoSync();
    let ratio = mobile.windowWidth / 375;
    _self.setData({
      imgwidth: 56 * ratio,
    });
  },
  onReady() {
    _self.getstorage();
  },
  //接口请求部分
	//============================================================================

  /**
	 * 后台接口[getmemberlist]获取下级列表
	 * 参数：uid:用户唯一标识id,page,limit
	 * 向服务器请求数据成功后遍历返回值，status为1的设置status为已激活，0设置为未激活、将memberlist存入data修改data值
   */
  getmemberlist: function() {
    _self.setData({
      loadingType: 1,
      page: _self.data.page + 1
    });
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/user/inivte_member',
      data: {
        uid: _self.data.uid,
        page: _self.data.page,
        limit: _self.data.limit
      },
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        if (model == '' && _self.data.page == 1) {
          _self.setData({
            graceFullLoading: false,
            havelist: false,
            loadingType: 0
          })
          return;
        }
        model.forEach(function(item) {
          if (item.status == 1) {
            item.status = '已激活'
          } else if (item.status == 0) {
            item.status = '未激活'
          }
        })
        _self.setData({
          memberlist: _self.data.memberlist.concat(model),
          graceFullLoading: false,
          havelist: true,
          loadingType: 0
        });
        if (model.length < _self.data.limit) {
          _self.setData({
            isEnd: true,
            loadingType: 2,
            graceFullLoading: false,
            havelist: true
          });
        }

      },
      fail() {
        common.requestfail();
        return;
      }
    })
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
        _self.getmemberlist();
      },
      fail() {
        wx.reLaunch({
          url: '../../order/index/index'
        })
      }
    })
  },
  // 上拉加载
  onReachBottom: function() {
    if (_self.data.loadingType != 0 || _self.data.isEnd) {
      return;
    }
    _self.getmemberlist();
  }
})