const app = getApp();
var Utils = require('../../../utils/util.js');
var upimage = require('../../../static/js/wxupload.js');
var qiniu = require('../../../static/js/qiniuUploader.js');
var common = require('../../../static/js/common.js');
var _self;
Page({
  //路由数据部分
  //============================================================================
  data: {
    content: '',
    height: 500,
    width: 320,
    imgIndex: 0,
    imageLength: 0,
    firstCon: '',
    detail_imgs: [],
    detail_text: [],
    txt: '',
    dataList: [],
    focusList: [{
      focus: false
    }],
    isEdit: true,
    addImgView: {},
    insertIndex: 0,
    width: 375
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _self = this;
    if (options.dataList != 'undefined') {
      var dataList = JSON.parse(options.dataList);
      _self.setData({
        firstCon: options.firstCon,
        dataList: dataList
      });
    };
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(e) {
    upimage.getQiuniuToken();
    var that = _self;
    //动态获取屏幕尺寸
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight,
          width: res.windowWidth
        });
      },
      fail: function(res) {},
      complete: function(res) {}
    });
    that._initRichText();
  },
  //接口请求部分
  //============================================================================


  //界面组件部分
  //============================================================================
  comfirm: function() {
    _self.makeimgtxt();
    var prevPage = getCurrentPages()[getCurrentPages().length - 2]; //获取上一个页面栈
    prevPage.setdetail(_self.data.detail_imgs, _self.data.imgtxt, _self.data.firstCon, _self.data.dataList);
    wx.navigateBack({
      delta: 1
    });
  },
  //组装wxml发送后台
  makeimgtxt: function() {
    var imgtxt = "";
    imgtxt = "<div class='txt'>" + _self.data.firstCon + "</div>";
    _self.data.dataList.forEach(function(item) {
      imgtxt += "<img class='img' src='" + item.src + "'/>";
      if (item.info) {
        imgtxt += "<div class='txt'>" + item.info + "</div>";
      };
    });
    _self.setData({
      imgtxt: imgtxt
    });
  },

  /**
   * 内部方法
   * 初始化富文本方法
   */
  _initRichText() {
    var that = this;
    if (that.data.initlist && that.data.initlist.length > 0) { // 初始化数据不为空
      for (var i = 0; i < that.data.initlist.length; i++) {
        if (i === 0) {
          if (that.data.initlist[i].type === 0) {
            that.data.firstCon = that.data.initlist[0].info;
          } else {
            that.data.dataList.push({
              img: that.data.initlist[i].info,
              info: ''
            });
            that.data.focusList.push({
              focus: false
            });
          };
        } else {
          if (that.data.initlist[i].type === 0) { // 文字
            that.data.dataList[that.data.dataList.length - 1].info = that.data.initlist[i].info;
          } else {
            that.data.dataList.push({
              img: that.data.initlist[i].info,
              info: ''
            });
            that.data.focusList.push({
              focus: false
            });
          };
        };
      };
      that.setData({
        firstCon: that.data.firstCon,
        focusList: that.data.focusList,
        dataList: that.data.dataList,
        insertIndex: that.data.dataList.length
      });
    };
  },
  /**
   * 富文本文字输入监听
   */
  _inputCon(e) {
    var that = this;
    var index = +e.currentTarget.dataset.index;
    if (index === 0) {
      that.data.firstCon = e.detail.value;
    } else {
      that.data.dataList[index - 1].info = e.detail.value;
    };
  },
  /**
   * 文本框获取焦点监听
   */
  _focusView(e) {
    var that = this;
    var index = +e.currentTarget.dataset.index;
    that.data.focusList = that.data.focusList.map(item => {
      item.focus = false;
      return item;
    });
    // that.data.focusList[index].focus = true;
    that.setData({
      focusList: that.data.focusList,
      isEdit: true
    });
  },
  /**
   * 内部方法
   * 文本框失去焦点的监听事件
   * 存储失去焦点的文本框位置，为插入图片作准备
   */
  _outBlur(e) {
    var that = this;
    that.data.insertIndex = +e.currentTarget.dataset.index;
    that.setData({
      firstCon: that.data.firstCon,
      dataList: that.data.dataList,
      isEdit: false
    });
  },
  /**
   * 内部方法
   * 调用添加图片事件监听
   * 此处没有做太多处理，下次添加一个上传图片的组件
   * demo存贮的是本地的临时链接，自己要自己处理哦
   */
  _addImg() {
    var that = this;
    //添加图片
    upimage.uploadImg(_self, 'src', 1);
    console.log("tianjiatu");
    console.log(that.data.dataList);
  },
  /**
   * 内部方法
   * 图片回调
   */
  imgSuccess: function(imgsrc, type) {
    var detail_imgs = imgsrc;
    var src = app.globalData.qiniuUrl + imgsrc;
    console.log("huidiao");
    switch (type) {
      case "src":
        _self.setData({
          src: imgsrc,
          src_view: app.globalData.qiniuUrl + imgsrc
        });
        _self.data.dataList.splice(_self.data.insertIndex + 1, 0, {
          src: _self.data.src_view,
          info: ''
        });
        common.hideLoading();
        _self.setData({
          dataList: _self.data.dataList
        });
        break;
      default:
        break;
    };
  },
  /**
   * 内部方法
   * 删除图片
   */
  _deletedImg(e) {
    var that = this;
    var index = +e.detail;
    if (that.data.dataList[index].info) {
      if (index === 0) { // 最后一个
        that.data.firstCon = that.data.firstCon + that.data.dataList[index].info;
      } else {
        that.data.dataList[index - 1].info = that.data.dataList[index - 1].info + that.data.dataList[index].info;
      };
    };
    that.data.dataList.splice(index, 1);
    that.setData({
      firstCon: that.data.firstCon,
      dataList: that.data.dataList
    });
  },
  /**
   * 暴露出来的方法
   * 返回 富文本数据list
   */
  _saveRichText() {
    var that = this;
    var list = [];
    if (that.data.firstCon) {
      list.push({
        info: that.data.firstCon,
        type: 0
      });
    };
    that.data.dataList.forEach(item => {
      if (item.img) {
        list.push({
          info: item.img,
          type: 1
        });
      };
      if (item.info) {
        list.push({
          info: item.info,
          type: 0
        });
      };
    });
    that.triggerEvent('getDataList', list);
  }
})

// addImg: function(e) {
//   var imgtxt = {
//     info: '',
//     src: ''
//   }
//   _self.data.dataList.push(imgtxt);
//   _self.setData({
//     firstCon: _self.data.firstCon
//   });
//   var that = _self;
//   //添加图片
//   upimage.uploadImg(_self, 'src', 1);
//   return;}