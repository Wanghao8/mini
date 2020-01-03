/**
 * name:项目通用js
 * info:包含弹出框、错误提示、常用工具等
 * auth:黄军跃
 */
module.exports = {
	//页面接口地址
	serverUrl:"https://gongzuo.yuanfangyun.com/mini/",
	qiniuUrl:"https://gongzuos.yuanfangyun.com/",
  // serverUrl:"http://192.168.0.91:81/index.php/mini/",
	// qiniuUrl:"https://gongzuos.yuanfangyun.com/",
  
	headerForm:{
		'content-type': 'application/x-www-form-urlencoded'
	},
	//各种消息提示_表单类
	showToast: function(title) {
		wx.showToast({
			title: title,
			icon: "none",
			duration: 2000
		});
	}, 

  showToasti: function (title,icon) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: 2000
    });
  }, 
	//加载动画
	showLoading: function(title) {
		wx.showLoading({
			title: title,
		});
	},
	//关闭动画
	hideLoading: function() {
		wx.hideLoading();
	},
	btnLoading: function(page, btn, status) {
		page.setData({
			[btn]: status
		});
	},
	//不带取消弹出框
	showmodalconfirm: function(content) {
		wx.showModal({
			content: content,
			showCancel: false
		});
	},
	//带取消弹出框
	showmodalcancel: function(content) {
		wx.showModal({
			content: content,
			success(res) {
				if (res.confirm) {
					console.log('用户点击确定');
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	},
	//打开新页面
	gotoUrl: function(url) {
		wx.navigateTo({
			url: url,
		})
	},

  // 跳转首页（判断页面未登录时）
  gotoIndex:function(){
    wx.reLaunch({
      url: '../../manage/index/index',
    })
  },
	//替换服务端空数值
	isNull: function(olddata, newdata) {
		var data = "";
		if (olddata != null && olddata != "") {
			data = olddata;
		} else {
			data = newdata;
		}
		return data;
	},
	//时间差
	difference: function(sDate1, sDate2) {
		var dateSpan,
			tempDate,
			iDays;
		sDate1 = Date.parse(sDate1);
		sDate2 = Date.parse(sDate2);
		dateSpan = sDate2 - sDate1;
		console.log(dateSpan)
		if (dateSpan < 0) {
			return
		}
		dateSpan = Math.abs(dateSpan);
		console.log(dateSpan)
		if (Math.floor(dateSpan / (24 * 3600 * 1000)) == 0) {
			iDays = dateSpan / 3600000 + '小时'
		} else {
			iDays = Math.floor(dateSpan / (24 * 3600 * 1000)) + '天';
		}

		return iDays;
	},

  //时间比较==结束减开始
  compareTime:function(begin,end){
    var res=true;
    begin = Date.parse(begin.replace(/-/g, '/'));
    end = Date.parse(end.replace(/-/g, '/'));
    var gap = end - begin;
    if (!(gap>0)){res=false}
    return res;
  },

	//转换月日日期09-25
	getMonthday: function(date) {
		var resDate = '';
		if (date == null || date == '') {
      return '';
		}
		resDate = date.substr(5, 5);
		return resDate;
	},
  //转换月日日期09月25日
  getTextMonthday: function (date) {
    var resDate = '';
    if (date == null || date == '') {
      return '';
    }
    resDate = date.substr(5, 2) + '月' + date.substr(8, 2) + '日';
    return resDate;
  },
	//转换月日时分秒汉字版
	getTextMonthMinute: function(date) {
		var resDate = '';
		if (date == null || date == '') {
      return '';
		}
		resDate = date.substr(5, 2) + '月' + date.substr(8, 2) + '日' + date.substr(11, 5) + '分';
		return resDate;
	},
	//转换月日时分横线版
	getLineMonthMinute: function(date) {
		var resDate = '';
		if (date == null || date == '') {
      return '';
		}
		resDate = date.substr(5, 2) + '-' + date.substr(8, 2) + '  ' + date.substr(11, 5) + '分';
		return resDate;
	},
  //转换月日时分秒横线版 10-09 08:38:34
  getLineMdMs: function (date) {
    var resDate = '';
    if (date == null || date == '') {
      return '';
    }
    resDate = date.substr(5, 2) + '-' + date.substr(8, 2) + '  ' + date.substr(11, 8);
    return resDate;
  },
  //转换输出10月09日 08:38分
  getTxtMdhm: function (date) {
    var resDate = '';
    if (date == null || date == '') {
      return '';
    }
    resDate = date.substr(5, 2) + '月' + date.substr(8, 2) + '日  ' + date.substr(11, 5)+'分';
    return resDate;
  },

  //转换类型==2019-09-10
  getLineYmd: function (date) {
    var resDate = '';
    if (date == null || date == '') {
      return '';
    }
    resDate = date.substr(0, 10);
    return resDate;
  },

	//转换类型==2019年09月10日 11:35
	getTextYminute: function(date) {
		var resDate = '';
		if (date == null || date == '') {
      resDate = ''; return '';
		}
		resDate = date.substr(0, 4) + '年' + date.substr(5, 2) + '月' + date.substr(8, 2) + '日' + date.substr(11, 5) + '分';
		return resDate;
	},

  //转换类型==2019-09-10 11:35
  getLineYminute: function (date) {
    var resDate = '';
    if (date == null || date == '') {
      return '';
    }
    resDate = date.substr(0, 4) + '-' + date.substr(5, 2) + '-' + date.substr(8, 2) + '  ' + date.substr(11, 5) + ' 分';
    return resDate;
  },
  //转换类型==11:35
  getHourminute: function (date) {
    var resDate = '';
    if (date == null || date == '') {
      return '';
    }
    resDate = date.substr(11, 5) + ' 分';
    return resDate;
  },



  //获取当前月份


	//不为空验证
	checkNull: function(name, content) {
		if (name == null || name.length <= 0) {
			this.showToast(content);
			return false
		}
	},
	//手机号验证
	checkPhone: function(phone, content) {
		if (!(/^1[3456789]\d{9}$/.test(phone))) {
			this.showToast(content)
			return false;
		}
		return true;
	},
	//身份证号合法性验证
	checkIdcard: function(code) {
		var city = {
			11: "北京",
			12: "天津",
			13: "河北",
			14: "山西",
			15: "内蒙古",
			21: "辽宁",
			22: "吉林",
			23: "黑龙江 ",
			31: "上海",
			32: "江苏",
			33: "浙江",
			34: "安徽",
			35: "福建",
			36: "江西",
			37: "山东",
			41: "河南",
			42: "湖北 ",
			43: "湖南",
			44: "广东",
			45: "广西",
			46: "海南",
			50: "重庆",
			51: "四川",
			52: "贵州",
			53: "云南",
			54: "西藏 ",
			61: "陕西",
			62: "甘肃",
			63: "青海",
			64: "宁夏",
			65: "新疆",
			71: "台湾",
			81: "香港",
			82: "澳门",
			91: "国外 "
		};
		var tip = "";
		var pass = true;
		//验证身份证格式（6个地区编码，8位出生日期，3位顺序号，1位校验位）
		if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
			tip = "身份证号格式错误";
			pass = false;
		} else if (!city[code.substr(0, 2)]) {
			tip = "地址编码错误";
			pass = false;
		} else {
			//18位身份证需要验证最后一位校验位
			if (code.length == 18) {
				code = code.split('');
				//加权因子
				var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
				//校验位
				var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
				var sum = 0;
				var ai = 0;
				var wi = 0;
				for (var i = 0; i < 17; i++) {
					ai = code[i];
					wi = factor[i];
					sum += ai * wi;
				}
				var last = parity[sum % 11];
				if (parity[sum % 11] != code[17]) {
					tip = "校验位错误";
					pass = false;
				}
			}
		}
		if (!pass) {
			this.showToast(tip, 'none', 2000)
		}
		return pass;
	},
	// 接口出错报错
	requestFail: function(title) {
		wx.showModal({
			title: title,
			content: '请检查网络或联系管理员400-800-9033',
			showCancel: false,
			success(res) {}
		})
	},
	// 接口请求报错
	apiFalse: function(msg, content) {
		wx.showModal({
			title: msg,
			content: content,
			showCancel: false,
			success(res) {}
		});
	},
	// 函数节流
	throttle: function(fn, gapTime) {
		if (gapTime == null || gapTime == undefined) {
			gapTime = 1500
		}
		let _lastTime = null
		return function() {
			let _nowTime = +new Date()
			if (_nowTime - _lastTime > gapTime || !_lastTime) {
				fn()
				_lastTime = _nowTime
			}
		}
	},
	//当前日期格式20191112
	nowDate(type) {
		var timestamp = Date.parse(new Date());
		var date = new Date(timestamp);
		var year = date.getFullYear();
		var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
		var day = result = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
		var result = "";
		switch (type) {
			case 'year':
				result = year;
				break;
			case 'month':
				result = year +''+ month;
				break;
			case 'day':
				result = year +''+ month +''+ day;
				break;
		}
		return result;
	},

  //返回2019-10-01类型日期
  getCurrentLineDate: function (type){
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = result = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var result = "";
    switch (type) {
      case 'year':
        result = year;
        break;
      case 'month':
        result = year +'-'+ month;
        break;
      case 'day':
        result = year + '-' + month + '-'+ day;
        break;
    }
    return result;
  },
  //返回2019年10月01日类型日期
  getCurrentTextDate: function (type) {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = result = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var result = "";
    switch (type) {
      case 'year':
        result = year;
        break;
      case 'month':
        result = year + '-' + month;
        break;
      case 'day':
        result = year + '年' + month + '月' + day+'日';
        break;
    }
    return result;
  },

  //返回20191001类型
  getNumDate:function(date){
    var res = '';
    if(date==''||date==null){
      res = '';
    }
    res = date.substr(0,4)+date.substr(5,2)+date.substr(8,2);
    return res;
  },

  //当前日期时间
  getNowTime: function () {
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth() + 1;//得到月份
    var date = now.getDate();//得到日期
    var hour = now.getHours();//得到小时
    var minu = now.getMinutes();//得到分钟
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;

    let nowTime = year + '-' + month + '-' + date + '  ' + hour + ":" + minu;
    return nowTime;
  },


	//获取近六个月的月份

	sixMonths: function() {
		//创建现在的时间
		var data = new Date();
		//获取年
		var year = data.getFullYear();
		//获取月
		var mon = data.getMonth() + 1;
		var arry = new Array();
		for (var i = 0; i < 5; i++) {
			mon = mon - 1;
			if (mon <= 0) {
				year = year - 1;
				mon = mon + 12;
			}
			if (mon < 10) {
				mon = mon;
			}
			arry[i] = String(mon + 1);
		}
		return arry;
	},

	//获取近六个月的月份--格式为2019-09
	laterSixMonths: function() {
		var monthArry = [];
		var data = new Date();
		var year = data.getFullYear();
		data.setMonth(data.getMonth() + 1, 1) //获取到当前月份,设置月份
		for (var i = 0; i < 6; i++) {
			data.setMonth(data.getMonth() - 1); //每次循环一次 月份值减1
			var m = data.getMonth() + 1;
			m = m < 10 ? "0" + m : m;
			monthArry.push(data.getFullYear() + "-" + (m));
		}
		return monthArry;
	},


  //获取近两个月的月份--格式为2019-09
  laterTwoMonths: function () {
    var monthArry = [];
    var data = new Date();
    var year = data.getFullYear();
    data.setMonth(data.getMonth() + 1, 1) //获取到当前月份,设置月份
    for (var i = 0; i < 2; i++) {
      data.setMonth(data.getMonth() - 1); //每次循环一次 月份值减1
      var m = data.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      monthArry.push(data.getFullYear() + "" + (m));
    }
    return monthArry;
  },



  //分钟转换时分
  getTextHm:function(time){
    var chour = 0;
    var cmint = 0;
    var res = ''
    if (time < 60) {
      time = time;
      res = time + '分钟'
    } else {
      chour = parseInt(time / 60);
      cmint = time % 60;
      res = chour + '小时' + cmint + '分钟';
    };
    return res;
  },


  /**
 * 后台接口[department_list]=部门列表获取
 * 参数page页码、limit页数、where条件
 * 返回成员列表数据
 */
  department_list(page,getDepSucess) {
    let _self = this;
    var dataParam = {
      pro_id: wx.getStorageSync('user').pro_id,
      acc_id: wx.getStorageSync('user').acc_id,
      role: wx.getStorageSync('user').role,
      acc_token: wx.getStorageSync('user').acc_token
    }
    wx.request({
      url: _self.serverUrl+'/projectapimini/department_list',
      data: dataParam,
      success: function (res) {
        if (!res.data.res) {
          if (res.data.code == "noAcc") {
            return;
          }
          this.apiFalse("接口请求未完成", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var model = res.data.data;
        var tmpArry = [{ id: 0, name: '全部部门' }];
        model.forEach(function (item) {
          tmpArry.push({ id: item.id, name: item.name });
        })
        page.getDepSucess(tmpArry);
      },
      fail: function (res) {
        this.requestFail('获取部门列表失败');
        return;
      }
    })
  },

  //获取规则列表
  rule_list(page, getRuleSucess) {
    let _self = this
    var dataParam = {
      page:1,
      limit:20,
      acc_token: wx.getStorageSync('user').acc_token,
      where: 'pro_id='+ wx.getStorageSync('user').pro_id
    }
    wx.request({
      url: _self.serverUrl +'projectapimini/rule_list',
      data: dataParam,
      header:{'content-type': 'application/x-www-form-urlencoded'},
      method: 'post',
      success: function (res) {
        if (!res.data.res) {
          if (res.data.code == "noAcc") {
            return;
          }
          this.apiFalse("接口请求未完成", '错误代码' + res.data.code + res.data.msg);
          return;
        };
        var model = res.data.data;
        // var tmpArry = [{ id: 0, name: '请选择考勤规则' }];
        var tmpArry = [];
        model.forEach(function (item) {
          tmpArry.push({ id: item.id, name: item.name });
        })
        page.getRuleSucess(tmpArry);
      },
      fail: function (res) {
        this.requestFail('获取部门列表失败');
        return;
      }
    })
  },




};
