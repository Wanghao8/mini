/**
 * name:附近健身房信息页面
 * info:获取定位日期时间选择健身房
 * auth:王豪
 */
var _self;
var common = require("../../../static/js/common.js");
var app = getApp();
Page({
  //路由数据部分
	//============================================================================

  data: {
    graceFullLoading: false,
    loadingType: 0,
    isEnd: false,
    page: 0,
    limit: 10,
    // 健身房信息
    storelist: [],
  },
  onLoad: function (options) {
    _self = this;
  },
  onReady: function () {
    _self.getLoc();
  },
 
  //接口请求部分
	//============================================================================

  /**
	 * 后台接口[getstorelist]获取健身房列表
	 * 参数：lat：用户所在纬度，lon:用户所在经度，page:,limit:
	 * 修改data中loadingType和page的值，请求获取健身房列表，成功后遍历格式化距离，将获取到的健身房列表存到data中
	 */
  getstorelist: function (userlatitude, userlongitude) {
    _self.setData({
      loadingType: 1,
      page: _self.data.page + 1
    });
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/store/lists',
      data: {
        lat: userlatitude,
        lon: userlongitude,
        page: _self.data.page,
        limit: _self.data.limit
      },
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg);
          return;
        }
        var model = res.data.result;
        console.log(model)
        if (model == '' && _self.data.page == 1) {
          common.apimodelerror('获取健身房列表为空');
          return;
        }
        model.forEach(function (item) {
          if (item.distance < 1000) {
            item.distance = item.distance + "m";
          } else {
            item.distance = Math.round(item.distance / 100) / 10 + "km"
          }
        });
        _self.setData({
          storelist: model,
          loadingType: 0
        });
        if (model.length < _self.data.limit) {
          _self.setData({
            isEnd: true,
            loadingType: 2,
            graceFullLoading: false
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
  
  // 获取经纬度
  getLoc: function () {
    _self.getstorelist(0, 0);
    return
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        _self.getstorelist(res.latitude, res.longitude);
      },
      fail(res) {
        _self.getsetting();
      }
    })
  },
  // 获取经纬度授权
  getsetting: function () {
    wx.showModal({
      content: '获取您的位置将获得更好体验！',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          wx.openSetting({
            success(res) {
              if (res.authSetting["scope.userLocation"] == true) {
                _self.onReady();
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
  // 查看地图
  OpenMap: function (e) {
    var model = e.currentTarget.dataset.latlon;
    wx.openLocation({
      latitude: model.lat,
      longitude: model.lon,
      name: model.name,  // 位置名
      address: '如需导航请点击右侧选择地图导航',  // 要去的地址详情说明
      scale: 18
    })
  },
  // 上拉加载
  onReachBottom: function () {
    if (_self.data.loadingType != 0 || _self.data.isEnd) {
      return;
    }
    _self.getLoc();
  },

})