/**
 * name:我的邀请海报页面
 * info:获取邀请码邀请海报，制作邀请海报并保存图片，倒计时更新二维码
 * auth:王豪
 */
var _self;
var common = require("../../../static/js/common.js");
var app = getApp();
Page({
  data: {
    imgurl: ['https://renlis.yuanfangyun.com/inva.png', 'https://renlis.yuanfangyun.com/poster2.jpg', 'https://renlis.yuanfangyun.com/poster1.jpg',
      'https://renlis.yuanfangyun.com/honor1.jpg'
    ],
    imgwidth: 286,
    imgheight: 514.8,
    imgid: 0,
    // 用户信息
    qecodeurl: 0,
    nickName: 0,
    avatarUrl: 0,
    visit_num: 0,
    per: 0,
    keepurl: ''
  },
  onLoad: function (options) {
    _self = this;
  },
  onReady: function () {
    _self.getstorage();
  },
  // 获取缓存
  getstorage: function () {
    wx.getStorage({
      key: 'user',
      success(res) {
        _self.getsharecode(res.data.uid);
        // _self.getUserById(res.data.uid)
      },
      fail() {
        wx.reLaunch({
          url: '../../order/index/index'
        })
      }
    })
  },
  //获取邀请码
  getsharecode: function (uid) {
    wx.request({
      url: app.globalData.miniserverUrl + 'rebirth/ercode/share?uid=' + uid,
      success(res) {
        if (res.data.code !== 200) {
          common.apirequestfail(res.data.msg)
        }
        var model = res.data.result;
        if (model == '') {
          common.apimodelerror('获取邀请码为空');
          return;
        }
        wx.getImageInfo({
          src: model.ercode,
          success(res) {
            _self.setData({
              qecodeurl: res.path
            });
            if (_self.data.imgid == 0) {
              _self.drawinviimage(0);
            }
          }
        });
      },
      fail() {
        common.requestfail(_self);
        return;
      }
    });

  },
  // 制作邀请海报
  drawinviimage: function (index) {
    wx.showToast({
      title: '图片生成中',
      icon: 'loading'
    });
    let mobile = wx.getSystemInfoSync();
    let ratio = mobile.windowWidth / 375;
    _self.setData({
      imgwidth: 286 * ratio,
      imgheight: 514.8 * ratio,
    });
    wx.getImageInfo({
      src: _self.data.imgurl[index],
      success(res) {
        var ctx = wx.createCanvasContext("myCanvas");
        ctx.drawImage(res.path, 0, 0, _self.data.imgwidth, _self.data.imgheight);
        ctx.save();
        ctx.beginPath();
        ctx.arc(95 * ratio + (96 * ratio / 2), 385 * ratio + (100 * ratio / 2), 100 * ratio / 2, 0, 2 * Math.PI); //绘制圆圈
        ctx.clip(); //裁剪
        ctx.drawImage(_self.data.qecodeurl, 95 * ratio, 385 * ratio, 100 * ratio, 100 * ratio);
        ctx.restore();
        ctx.save();
        ctx.draw(true, function () {
          _self.getdrawimage(ratio)
        });
      },
      fail(res) {
        console.log(res);
      }
    });
  },
  getdrawimage: function (ratio) {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 286 * ratio,
      height: 514.8 * ratio,
      destWidth: 572 * ratio,
      destHeight: 1029.6 * ratio,
      canvasId: 'myCanvas',
      success(res) {
        var temp = res.tempFilePath
        _self.setData({
          keepurl: res.tempFilePath
        });
        wx.hideToast();
      },
      fail(res) {
        wx.showToast({
          title: '生成失败',
          duration: 1000
        })
      }
    })
  },
  // 保存图片
  saveimg: function () {
    wx.saveImageToPhotosAlbum({
      filePath: _self.data.keepurl,
      success(res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500
        });
      },
      fail(res) {
        _self.getsetting();
      }
    });
  },
  // 获取授权
  getsetting: function () {
    wx.showModal({
      content: '获取相册授权即可轻松保存图片！',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          wx.openSetting({
            success(res) {
              if (res.authSetting["scope.writePhotosAlbum"] == true) {
                wx.showToast({
                  title: '授权成功！',
                  icon: 'none',
                  duration: 1500
                });
              } else if (res.authSetting["scope.writePhotosAlbum"] == false) {
                wx.showToast({
                  title: '授权失败！',
                  icon: 'none',
                  duration: 1000
                });
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
  //全屏预览海报
  keepimg: function () {
    wx.previewImage({
      current: _self.data.keepurl, // 当前显示图片的http链接
      urls: [_self.data.keepurl] // 需要预览的图片http链接列表
    })
  },
})
