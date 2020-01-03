module.exports = {

  getUserInfo() {
    wx.login({
      success(res) {
        console.log(res.code, "2")
        _self.getOpenId(res.code)
      },
      fail(res) {
        console.log("login", res)
      }
    });
  },
  getOpenId(code) {
    wx.request({
      url: app.globalData.url + 'mini/manageapi/code2Session?code=' + code,
      success(res) {
        console.log(res.data.data, '123123123')
        _self.setData({
          openid: res.data.data.openid,
          session_key: res.data.data.session_key
        })
        _self.getAccId(res.data.data.openid)
      },
      fail(res) {
        console.log('openid', res)
      }
    })
  },
  getAccId(openid) {
    wx.request({
      url: app.globalData.url + 'mini/manageapi/acc_login_openid?openid=' + openid,
      success(res) {
        console.log('succ', res)
        wx.setStorage({
          key: "user",
          data: {
            acc_id: res.data.data.acc_id,
            rule_id: 0
          }
        })
      },
      fail(res) {
        console.log("acc", res)
      }
    })
  },
  //获取用户信息保存到data里
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
    _self.setData({
      userInfo: e.detail.userInfo,
      loginStaus: 1,
    })
    wx.setStorage({
      key: "userInfo",
      data: e.detail.userInfo
    })


  },
  getPhoneNumber: function(e) {
    if (e.detail.errMsg != "getPhoneNumber:ok") {
      common.showToast('获取手机号失败');
      return;
    };
    var dataParam = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      sessionKey: _self.data.session_key
    }
    _self.decrypt_phone(dataParam);
  },
  decrypt_phone(dataParam) {
    common.btnLoading(_self, "btnLoading", true);
    wx.request({
      url: app.globalData.url + 'mini/manageapi/decrypt_phone',
      data: dataParam,
      success: function(res) {
        console.log(res, '123')
        if (!res.data.res) {
          common.apiFalse("接口请求未完成", '错误代码' + res.data.code + res.data.msg);
          console.log('解密失败');
          return;
        };
        var model = JSON.parse(res.data.data);
        _self.setData({
          phoneNumber: model.phoneNumber
        })
        wx.setStorageSync('phone', model.phoneNumber);
        var dataParam = _self.data.userInfo;
        dataParam.openid = _self.data.openid;
        dataParam.phone = model.phoneNumber;
        _self.login_wechat(dataParam);
      },
      fail: function(res) {
        common.requestFail('解密手机号错误');
        return;
      },
      complete: function(res) {
        common.btnLoading(_self, "btnLoading", false);
      }
    })
  },
  login_wechat(dataParam) {
    common.btnLoading(_self, "btnLoading", true);
    wx.request({
      url: app.globalData.url + 'mini/manageapi/acc_login_wechat',
      data: dataParam,
      header: _self.data.headerForm,
      method: 'post',
      success: function(res) {
        console.log(res)
        if (!res.data.res) {
          common.apiFalse("接口请求未完成", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var model = res.data.data;
        _self.setData({
          loginStaus: 2
        })
        wx.setStorageSync('acc_id', model.acc_id);
        wx.setStorageSync('openid', _self.data.openid);
        wx.reLaunch({
          url: '../../manage/index/index'
        });

      },
      fail: function(res) {
        common.requestFail('登录信息错误');
        return;
      },
      complete: function(res) {
        common.btnLoading(_self, "btnLoading", false);
      }
    })
  }
}