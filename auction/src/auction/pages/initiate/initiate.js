const app = getApp();
var upimage = require('../../static/js/wxupload.js');
var qiniu = require('../../static/js/qiniuUploader.js');
var common = require('../../static/js/common.js');
var util = require('../../utils/util.js')
var _self;
Page({
  //路由数据部分
  //============================================================================
  /**
   * 页面的初始数据
   */
  data: {
    showcj: false,
    hide1: false,
    hide2: false,
    warn: false,
    warn1: false,
    showdeal: false,
    showStart: false,
    setTimed: false,
    name: '',
    desc: '',
    start_price: '',
    range_price: '',
    bond_price: '',
    // start_time: util.formatTime(time),
    // end_time: util.formatTime(new Date(Date.parse(time) + 60000)),
    start_time: util.formatTime(new Date()),
    end_time: util.formatTime(new Date(Date.parse(new Date()) + 60000)),
    images: [],
    image: [],
    pickerindex: 0,
    dealindex: '0',
    deal: ['双方自行交易', '线上支付'],
    date: ['推荐设置', '2019'],
    delay_time: '',

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    upimage.getQiuniuToken();
  },
  //点击事件汇总
  actionBtn: function(e) {
    var action = e.currentTarget.dataset.action;
    var value = e.currentTarget.dataset.value;
    switch (action) {
      case 'removeImage':
        const idx = e.target.dataset.idx;
        _self.data.images.splice(idx, 1);
        var images = _self.data.images;
        _self.setData({
          images: images
        });
        break;
      case 'handleImagePreview':
        var idx = value;
        var images = _self.data.images;
        wx.previewImage({
          current: images[idx], //当前预览的图片
          urls: images //所有要预览的图片
        });
        break;
      case 'upimg':
        upimage.uploadImg(_self, 'src', 1);
        break;
      case 'clickcut':
        //点击裁剪框阅览图片
        wx.previewImage({
          current: e.detail.url, // 当前显示图片的http链接
          urls: [e.detail.url] // 需要预览的图片http链接列表
        });
        break;
      case 'setprice':
        wx.navigateTo({
          url: './setPrice/setPrice?bond_price=' + _self.data.bond_price + '&start_price=' + _self.data.start_price + '&range_price=' + _self.data.range_price
        });
        break;
      case 'desc':
        var dataList = JSON.stringify(_self.data.dataList)
        wx.navigateTo({
          url: './description/description?firstCon=' + _self.data.firstCon + '&dataList=' + dataList
        });
        break;
      case 'dealstyle':
        _self.setData({
          showdeal: true
        });
        break;
      case 'goods_add':
        _self.goods_add();
        break;
      case 'hideDeal':
        _self.setData({
          showdeal: false
        });
        break;
      case 'choosedeal':
        var index = e.currentTarget.dataset.index;
        _self.setData({
          dealindex: index,
          showdeal: false
        });
        break;
      default:
        break;
    };
  },

  //接口请求部分
  //============================================================================

  /**
   * 后台接口[goods_add]获取openid
   * 参数：name,desc,cover_imgs等商品信息
   * 返回：无
   */
  goods_add: function() {
    // 判断是否缺填参数
    if (_self.data.name == 0) {
      wx.showToast({
        icon: 'none',
        title: '请先输入拍品名称'
      });
      return;
    };
    if (_self.data.desc == "") {
      wx.showToast({
        icon: 'none',
        title: '请先输入拍品描述说明'
      });
      return;
    };
    if (_self.data.image.length == "") {
      wx.showToast({
        icon: 'none',
        title: '请先点击加号添加图片'
      });
      return;
    };
    if (_self.data.start_price == "") {
      wx.showToast({
        icon: 'none',
        title: '请先输入起始价格'
      });
      return;
    };
    if (_self.data.range_price == "") {
      wx.showToast({
        icon: 'none',
        title: '请先输入加价幅度'
      });
      return;
    };
    if (_self.data.range_price == "0") {
      wx.showToast({
        icon: 'none',
        title: '加价幅度不能为零'
      });
      return;
    };
    if (_self.data.bond_price == "") {
      wx.showToast({
        icon: 'none',
        title: '请先输入保证金额'
      });
      return;
    };
    if (_self.data.endMin == 0) {
      wx.showToast({
        icon: 'none',
        title: '结束时间不能填0'
      });
      return;
    };
    if (_self.data.delay_time == "") {
      wx.showToast({
        icon: 'none',
        title: '请先输入延迟时间'
      });
      return;
    };
    var time = new Date();
    _self.setData({
      time
    })
    // 判断是否修改过开始结束时间
    if (!_self.data.setTimed) {
      _self.setData({
        start_time: util.formatTime(new Date()),
        end_time: util.formatTime(new Date(Date.parse(new Date()) + 60000))
      })
    }
    _self.setStart(_self.data.startHour);
    _self.setEnd(_self.data.endMin);
    var model = {
      name: _self.data.name,
      desc: _self.data.desc,
      cover_imgs: _self.data.image,
      start_price: _self.data.start_price,
      range_price: _self.data.range_price,
      bond_price: _self.data.bond_price,
      start_time: _self.data.start_time,
      end_time: _self.data.end_time,
      delay: _self.data.delay_time,
      detail_imgs: _self.data.detail_imgs,
      detail_text: _self.data.detail_text,
      imgtxt: _self.data.imgtxt,
      acc_id: wx.getStorageSync("acc").id
    };
    wx.request({
      url: app.globalData.url + 'mini/goodsapi/goods_add',
      data: model,
      header: common.headerForm,
      method: 'post',
      success(res) {
        if (!res.data.res) {
          common.apiFalse("接口请求未完成", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        wx.showModal({
          title: '恭喜你，商品发布成功',
          content: '可到首页进行商品竞拍',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../index/index',
              });
            };
          }
        });
      },
      fail(res) {
        common.requestFail('发送错误');
        return;
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
  // 设置延迟时间
  setDelay(e) {
    _self.setData({
      delay_time: e.detail.value
    });
  },
  // 设置开始时间
  setStartHour(e) {
    _self.setData({
      startHour: e.detail.value
    });
  },
  // 设置结束时间
  setEndMin(e) {
    _self.setData({
      endMin: e.detail.value
    });
  },
  //图片上传成功的回调函数
  imgSuccess: function(imgsrc, type) {
    _self.data.images.push(app.globalData.qiniuUrl + imgsrc);
    _self.data.image.push(imgsrc);
    switch (type) {
      case "src":
        _self.setData({
          src: imgsrc,
          src_view: app.globalData.qiniuUrl + imgsrc,
          images: _self.data.images
        });
        common.hideLoading();
        break;
      default:
        break;
    };
  },
  //设置延迟时间
  delay(e) {
    _self.setData({
      delayIndex: e.detail.value
    });
    _self.setData({
      delay_time: _self.data.delayNum[_self.data.delayIndex]
    });
  },
  // 设置价格回调方法
  setPrice1: function(start_price, range_price, bond_price) {
    _self.setData({
      start_price,
      range_price,
      bond_price,
    });
  },
  //设置图文详情回调方法
  setdetail(detail_imgs, imgtxt, firstCon, dataList) {
    _self.setData({
      detail_imgs,
      imgtxt,
      firstCon,
      dataList
    });
  },

  //给商品名称赋值
  setName(e) {
    var value = e.detail.value;
    _self.setData({
      name: value
    });
  },
  //给商品说明赋值
  setDesc(e) {
    var value = e.detail.value;
    _self.setData({
      desc: value
    });
  },
  //设置开始时间
  setStart: function(hour) {
    var time = Date.parse(_self.data.time);
    var date = _self.data.time;
    // var time = Date.parse(new Date());
    // var date = new Date();
    date = util.formatTime(date);
    time = time + 3600000 * hour;
    date = util.formatTime(new Date(time));
    _self.setData({
      start_time: date
    });
  },
  //设置结束时间
  setEnd: function(min) {
    var time = Date.parse(new Date(Date.parse(_self.data.start_time.replace(/\-/g, "/"))));
    var date = _self.data.time;
    date = util.formatTime(date);
    time = time + 60000 * min;
    date = util.formatTime(new Date(time));
    _self.setData({
      end_time: date
    });
  }
})

// 判断时间顺序
// shijian: function() {
//   var endTime = _self.data.end_time;
//   var startTime = _self.data.start_time;
//   if (endTime < startTime) {
//     _self.setData({
//       warn: true
//     });
//     wx.showModal({
//       title: '警告',
//       content: '结束时间不得早于开始时间，请重新设置结束时间',
//     })
//     return;
//   } else {
//     _self.setData({
//       warn: false
//     });
//   };
// },

//预览按钮跳转
// preview: function() {
//   wx.navigateTo({
//     url: './preview/preview?data=' + _self.data,
//   })
// },

// upimg: function(e) {
// wx.chooseImage({
//   count: 1,
//   sizeType: ['original', 'compressed'],
//   sourceType: ['album', 'camera'],
//   success: res => {
//     _self.setData({
//       showcj: true
//     })
//     //获取到image-cropper对象
//     _self.cropper = _self.selectComponent("#image-cropper");
//     //开始裁剪
//     console.log(res.tempFilePaths);
//     _self.setData({
//       src: res.tempFilePaths,
//     });
//   }
// })
// },

// caijian() {
// _self.cropper.getImg((obj) => {
//   _self.data.cjurl = obj.url;
//   // app.globalData.imgSrc = obj.url;
//   console.log(_self.data.cjurl, "22")
//   _self.setData({
//     showcj: false
//   })
//   // setTimeout(function(){},100)
//   var images = _self.data.images.concat(_self.data.cjurl)
//   // var images = _self.data.images.concat(app.globalData.imgSrc)
//   console.log(images, '12312', _self.data.cjurl, app.globalData.imgSrc)
//   // 限制最多只能留下3张照片
//   // images = images.length <= 3 ? images : images.slice(0, 3)
//   _self.setData({
//     images
//   })
// });
// },

// //图片裁剪初始化
// cropperload(e) {
//   // console.log("cropper初始化完成");
// },
// //裁剪组件的加载图片
// loadimage(e) {
//   wx.hideLoading();
//   //重置图片角度、缩放、位置
//   _self.cropper.imgReset();
// },