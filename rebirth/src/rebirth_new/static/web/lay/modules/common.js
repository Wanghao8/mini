/**
 @ Name：layui.common 公共自写模块
 @ Author：黄栾 2017-12-27
 @ License：MIT 
 */
layui.define(["layer", "jquery"], function(exports) {
	var $ = layui.$,
		layer = layui.layer,
		countdown = 30;
	window.common = {
		serverurl:"http://192.168.0.91:82/index.php/",
		//serverurl:"http://xrh6.yuanfangyun.com/",
		qiniuurl:"http://.yuanfangyun.com/",
		getQueryString: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if(r != null) return unescape(r[2]);
			return null;
		},
		getDD: function(addtime) {
			return "DD" + addtime.replaceAll("-", "").substr(0, 8);
		},
		gotoUrl: function(url) {
			location.href =common.serverurl+url;
		},
		isNull: function(olddata, newdata) {
			var data = "";
			if(olddata != null && olddata != "") {
				data = olddata;
			} else {
				data = newdata;
			}
			return data;
		},
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
			if(monthC >= 1) {
				result = parseInt(monthC) + "月前";
			} else if(weekC >= 1) {
				result = parseInt(weekC) + "周前";
			} else if(dayC >= 1) {
				result = parseInt(dayC) + "天前";
			} else if(hourC >= 1) {
				result = parseInt(hourC) + "小时前";
			} else if(minC >= 1) {
				result = parseInt(minC) + "分钟前";
			} else
				result = "刚刚";
			return result;
		},
		CheckFormat: function(value, type) {
			var reg;
			switch(type) {
				case 'phone':
					reg = /^1[3-5-7-8-9]\d{9}$/;
					break;
			}
			if(!reg.test(value)) {
				return true;
			}
			return false;
		},
		initImgList: function(obj, height) {
			var imgArrays = obj.getElementsByTagName('img');
			$.each(imgArrays, function(index, item) {
				item.onload = function() {
					scale = Number(item.width / item.height);
					if(scale >= 1) {
						var xx = Number((height - height * scale) / 2);
						item.style.height = height + "px";
						item.style.left = xx + "px";
					}
					if(scale < 1) {
						var xx = Number((height - height / scale) / 2);
						item.style.width = height + "px";
						item.style.top = xx + "px";
					}
				}
			})
		},
		getAges: function(datee) {
			if(!datee||datee==""){
				return 0;
			}
			var thisyear = new Date().getFullYear();
			var birthyear = new Date(datee).getFullYear();
			var age = (thisyear - birthyear);
			return age;
		},
		formatDate: function(datee) {
			if(!datee) {
				return datee;
			}
			var date = new Date(datee);
			var myyear = date.getFullYear();
			var mymonth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
			var myweekday = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
			return(myyear + "-" + mymonth + "-" + myweekday);
		},
		daysDiff: function(date1,date2) {
			if(date1==null||date2==null){
				return 0;
			}
			var date1 =date1==""?new Date():new Date(date1.replace(/-/g, "/"));
			var date2 =date2==""?new Date():new Date(date2.replace(/-/g, "/"));
			var diffValue = date2.getTime() - date1.getTime();
			var days = parseInt(diffValue / (1000 * 60 * 60 * 24));
			return days;
		},
		daysAdd: function(date, n) {
			var timeadd = new Date(date);
			timeadd.setDate(timeadd.getDate() + n);
			var enddate = common.formatDate(timeadd);
			return enddate;
		},
		monthAdd: function(date, n) {
			var timeadd = new Date(date);
			timeadd.setMonth(timeadd.getMonth()+ n);
			var enddate = common.formatDate(timeadd);
			return enddate;
		},
		updateTableValue:function(model,callback) {
			var loading = common.loading("正在执行数据修改，请稍后……");
			$.ajax({
				type: "post",
				url: common.serverurl + "web/manageapiw/single_field_update",
				data: model,
				success: function(data) {
					if(!data.res) {
						common.alert('错误代码' + data.code + "，" + data.msg,"数据修改失败",0);
						return;
					}
					if (typeof callback === "function"){
						callback(model);
					}
				},
				complete: function() {
					layer.close(loading);
				}
			});
		},
		media_add:function(model,callback) {
			var loading = common.loading("正在同步系统，请稍后……");
			$.ajax({
				type: "post",
				url: common.serverurl+'web/servicerapiw/media_add',
				data:model,
				success: function (data) {
					if(!data.res) {
						common.alert('错误代码' + data.code + "，" + data.msg,"同步照片信息失败",0);
						return;
					}
					if (typeof callback === "function"){
						callback(model);
					}
				},
				complete: function() {
					layer.close(loading);
				}
			});
		},
		getPhoneCode: function(phone, obj) {
			if(common.CheckFormat(phone, "phone")) {
				layer.msg("手机号码格式错误");
				return;
			}
			//本地测试使用
			// common.setDowmTime(obj);
			// obj.attr("data-value", phone + "1234");
			// return;
			$.ajax({
				url: common.serverurl + "indexapi/get_phone_code/"+phone,
				type: "get",
				dataType: "json",
				beforeSend: function() {
					common.Setdisabled(obj, true, '正在发送');
				},
				success: function(data) {
					if(!data.res) {
						common.setDowmTime(obj);
						common.alert("错误代码" + data.code + "，" + JSON.stringify(data.msg),"验证码发送失败",2);
						return;
					}
					obj.attr("data-value", phone +""+ data.data);
					common.setDowmTime(obj);
					layer.msg("验证码发送成功");
					return;
				},
				error: function() {
					common.Setdisabled(obj, false, '重新发送');
					common.alert("请检查网络或联系雪绒花技术人员电话 13298125901","系统接口异常",2);
					return;
				}
			});
		},
		Setdisabled: function(obj, status, text, type) {
			obj.attr('disabled', status);
			obj.text(text);
			if(status) {
				obj.addClass("layui-btn-disabled");
			} else {
				obj.removeClass("layui-btn-disabled");
			}
			if(type) {
				obj.attr("data-type", type);
			}
		},
		setDowmTime: function(obj) {
			if(countdown == 0) {
				obj.attr('disabled', false);
				obj.text('重新获取验证码');
				obj.removeClass("layui-btn-disabled");
				countdown = 30;
				clearTimeout();
				return;
			}
			obj.addClass("layui-btn-disabled");
			obj.attr('disabled', true);
			obj.text("重新发送 " + countdown + "s");
			countdown--;
			setTimeout(function() {
				common.setDowmTime(obj)
			}, 1000);
		},
		msg:function(info,icon,time){
			var style={};
			if(icon!=""){
				style.icon=icon;
			}
			if(time!=""){
				style.time=time;
			}
			layer.msg(info,style);
		},
		alert:function(info,title,icon){
			layer.alert(info, {icon:icon,title:title}); 
		},
		loading: function(text) {
			var index = layer.msg(text, {
				icon: 16,
				time: 0,
				shade: 0.1
			});
			return index;
		},
		photosBig: function() {
			$("body").on("click", "img", function() {
				var model = {
					"id": "photos",
					"start": 0,
					"data": []
				}
				var imgobj = $(this);
				var photos = imgobj.parent().parent().find("img");
				photos.each(function(index, item) {
					model.data.push({
						"src": $(item).attr("src")
					});
					if($(item).attr("src") == imgobj.attr("src")) {
						model.start = index;
					}
				})
				layer.photos({
					photos: model,
					anim: 5
				});
			})
		},
		layer_open_url: function(id, title, area, url) {
			layer.open({
				id: id,
				title: title,
				area: area,
				type: 2,
				content: url
			});
		}
	};
	exports('common', common);
});