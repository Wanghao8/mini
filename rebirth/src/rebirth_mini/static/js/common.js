module.exports = {
	//各种消息提示
	showToast: function(title, icon,time) {
		wx.showToast({
			title: title,
			icon: icon,
			duration: time
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
		wx.hideLoading()
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
		});
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
	//通过出生年月日获取年龄
	getAges: function(str) {
		str = str.substr(0, 10);
		var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
		if (r == null) return false;
		var d = new Date(r[1], r[3] - 1, r[4]);
		if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
			var Y = new Date().getFullYear();
			return (Y - r[1]);
		}
		return "";
	},
	// 转换生成时间
	converttime:function(residue_time){
		var now = residue_time;
		var minute = 60;
		var hour = minute*60;
		var day = hour*24;
		var month = day*30;
		var minutev = residue_time / minute;
		var hourv = residue_time / hour; 
		var dayv = residue_time / day;
		var monthv = residue_time / month;
		var result = '';
		if(now == 0){
			result = "余额不足"
		}
		else if(0 < now && now < 60){
			result = "一分钟后到期";
		}else if(hourv < 1){
			result = parseInt(minutev) + "分钟";
		} else if (dayv < 1){
			result  =parseInt(hourv) + "小时";
		} else if(monthv < 1){
			result  =parseInt(dayv) + "天" + parseInt(now % day / hour)  +"小时";
		}else{
			result =parseInt(monthv) + "月" + parseInt( now % month / day) + "天" + parseInt(now % day / hour)  +"小时"
		}
		return result;
	},
	//转换添加时间
	getDateDiff: function(datee) {
		var minute = 1000 * 60;
		var hour = minute * 60;
		var day = hour * 24;
		var halfamonth = day * 15;
		var month = day * 30;
		var now = new Date().getTime();
		var date2 = new Date(datee.replace(/-/g, '/')).getTime();
		var diffValue = now - date2;
		var monthC = diffValue / month;
		var weekC = diffValue / (7 * day);
		var dayC = diffValue / day;
		var hourC = diffValue / hour;
		var minC = diffValue / minute;
		if (monthC >= 1) {
			result = parseInt(monthC) + "月前";
		} else if (weekC >= 1) {
			result = parseInt(weekC) + "周前";
		} else if (dayC >= 1) {
			result = parseInt(dayC) + "天前";
		} else if (hourC >= 1) {
			result = parseInt(hourC) + "小时前";
		} else if (minC >= 1) {
			result = parseInt(minC) + "分钟前";
		} else
			result = "刚刚";
		return result;
	},
	//计算时间相差天数
	getDayDiff: function(dateEnd) {
		if (dateEnd == null) {
			return 0;
		}
		var dateNow = new Date(); //结束时间  
		var datetime = new Date(dateEnd).getTime() - dateNow.getTime(); //时间差的毫秒数
		var days = Math.floor(datetime / (24 * 3600 * 1000))
		return days;
	},
	//获取当前月份
	getMonth: function(type) {
		var date = new Date;
		var year = date.getFullYear();
		var month = type == "last" ? date.getMonth() : date.getMonth() + 1;
		if (month == "00") {
			month = 12;
			year = parseInt(year) - 1;
		}
		month = (month < 10 ? "0" + month : month);
		var mydate = (year.toString() + "年" + month.toString() + "月");
		return mydate;
	},
	//不为空验证
	checkNull: function(name,content,icon,time) {
		if (!(name.length >1)) {
			this.showToast(content,icon,time);
			return false;
		}
		return true;
	},
	//手机号验证
	checkPhone: function(phone) {
		if (!(/^1[3456789]\d{9}$/.test(phone))) {
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
			this.showToast(tip,'none',2000)
		}
		return pass;
	},
	// 网络请求失败报错
		requestfail:function(){
			wx.showToast({
				title:'网络异常！',
				icon:'none',
				duration:1000
			});
		},
		// 接口请求报错
	apirequestfail:function(msg){
		wx.showModal({
			title:msg,
			content: '请联系管理员15036095772',
			showCancel: false,
			success(res) {
			}
		});
	},
	// 接口出错报错
	apimodelerror:function(title){
		wx.showModal({
			title:title,
			content: '请联系管理员15036095772',
			showCancel: false,
			success(res) {
			}
		})
	},
	// 函数节流
	throttle:function(fn, gapTime) {
	    if (gapTime == null || gapTime == undefined) {
	        gapTime = 1500
	    }
	 
	    let _lastTime = null
	    return function () {
	        let _nowTime =  new Date()
	        if (_nowTime - _lastTime > gapTime || !_lastTime) {
	            fn()
	            _lastTime = _nowTime
	        }
	    }
	},
	//单字段修改
// 	editByField: function(page, table, id, field, val) {
// 		var loading = layer.load(2);
// 		$.ajax({
// 			type: "POST",
// 			url: "/api/Mobile/CommonApi/EditByField",
// 			data: {
// 				table: table,
// 				id: id,
// 				field: field,
// 				val: val
// 			},
// 			dataType: "json",
// 			success: function(result) {
// 				if (!result.Res) {
// 					layui.alert(result.Message, "接口获取异常");
// 					return;
// 				}
// 				page.EditFieldSuccess(field, val);
// 			},
// 			complete: function() {
// 				layer.close(loading);
// 			}
// 		});
// 	},

//日期时间前面补零
padstart:function(num){
  return num < 10 ? '0' + num : num 
}
};
