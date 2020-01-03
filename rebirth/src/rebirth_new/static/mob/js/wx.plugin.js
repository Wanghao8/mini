//微信登录插件方法汇总
//==============================================================
var appid = 'wxa727b4ef2d7cfe72';
//获取微信端的用户实体
function authLogin() {
	//本地测试模拟-正式环境需删除
	// var obj = {
	// 	"openid": "oqiYgwPsMRRKiTbmn1RIxJg5A2ZE",
	// 	"nickname": "unfoolish",
	// 	"sex": 1,
	// 	"language": "zh_CN",
	// 	"city": ",",
	// 	"province": "河南",
	// 	"country": "中国",
	// 	"headimgurl": "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIuqOuvZLWMJ2lfETGso4WBtVykMCABFjyycacEk7jRGFSMTjccOc8loZnAT3Y04vJle1ZpibfltRA/132",
	// 	"privilege": [],
	// 	"unionid": "oSgNRwqPVx8gQybJKPWttGPgWbfU"
	// };
	// mui.toast("正在模拟登陆 3秒中");
	// setTimeout(function () {
	// 	authUserInfoSuccess(obj);
	// }, 2000, false)
	// return;
	var lochref = window.location.href;
	var oa2href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + lochref + "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
	var code = getQueryString("code");
	if (code && code != "") {
		mui.ajax({
			url: serverurl + "accountapi/acc_get_wechat",
			type: "post",
			data: {
				code: code,
			},
			dataType: "json",
			success: function (data) {
				if (!data.res) {
					mui.alert('错误代码' + data.code + "，" + data.msg, '信息获取失败');
					return;
				}
				var model = data.data;
				authUserInfoSuccess(model);
			},
			error: function () {
				mui.toast('传输异常，未返回任何数据');
			}
		});
	} else {
		window.location.href = oa2href;
	}
}

//分享服务插件方法汇总
//==============================================================
// 初始化分享服务
function shareMessage(title,desc,link,avatar) {
	wx.onMenuShareAppMessage({
		title: title,
		desc: desc,
		link: link,
		imgUrl: avatar,
		success: function (res) {
			mui.toast("成功分享到朋友圈");
		},
		cancel: function (res) {
			mui.toast("你取消了朋友圈的分享");
		}
	});
	//分享至朋友圈
	wx.onMenuShareTimeline({
		title: title + "," + desc, // 分享标题
		link: link, // 分享链接
		imgUrl: avatar, // 分享图标
		success: function (res) {
			mui.toast("成功分享到朋友圈");
		},
		cancel: function () {
			mui.toast("你取消了朋友圈的分享");
		}
	});
}

//微信上传至七牛方法汇总
//==============================================================
//选择照片
var serverIds = "";
function chooseImage(obj) {
	serverIds = "";
	var count = obj.id == "idcard_img" ? 1 : 6;
	wx.chooseImage({
		count: count, // 默认9
		sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
		sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
		success: function (res) {
			if (res.localIds.length == 0) {
				mui.alert('请先使用 微信选择图片');
				return;
			}
			uploadImage(res.localIds, obj);
		},
		complete: function () {
			
		}
	});
}
//上传照片
function uploadImage(localIds, obj) {
	var localId = localIds.pop();
	wx.uploadImage({
		localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
		isShowProgressTips: 1, // 默认为1，显示进度提示
		success: function (res) {
			var dou = ",";
			if (serverIds == "") {
				dou = "";
			}
			var serverId = res.serverId; // 返回图片的服务器端ID
			serverIds += dou + serverId;
			if (localIds.length > 0) {
				uploadImage(localIds, obj);
			} else {
				downImage(serverIds, obj);
			}
		}
	});
}
//下载照片并上传至服务器上 返回服务器路径
function downImage(serverIds, obj) {
	mui.ajax({
		url: serverurl + "accountapi/wx_upload",
		type: "post",
		dataType: "json",
		data: { medias: serverIds },
		beforeSend: function () {
			showLoading();
		},
		success: function (data) {
			if (!data.res) {
				mui.alert("错误代码" + data.code + "，" + data.msg, "上传信息失败");
				return;
			}
			uploaderSuccess(obj, data.data);
			serverIds = "";
		},
		complete: function () {
			hideLoading();
		},
		error: function () {
			mui.toast('系统温馨提醒，请检查网络！');
			return;
		}
	});
}
//预览照片
function previewImage() {
	mui("body").on("tap", "img", function () {
		var obj = this.parentNode.parentNode;
		var imgArrays = this.parentNode.parentNode.getElementsByTagName('img');
		var imgurls = [];
		var imgcurrent = this.src;
		for (var i = 0; i < imgArrays.length; i++) {
			imgurls[i] = imgArrays[i].src;
		}
		//排除添加图片功能
		if (this.classList.contains("addPhoto")) {
			obj = this.id == "idcard_img" ? this : obj;
			chooseImage(obj);
			return;
		}
		if(this.id == "avatar"){
			return;
		}
		if(this.getAttribute("data-type")== "cert"){
			mui.alert("涉及用户真实隐私，请联系雪绒花公司获取","不可放大查看");
			return;
		}
		wx.previewImage({
			current: imgcurrent, // 当前显示图片的http链接
			urls: imgurls // 需要预览的图片http链接列表
		});
	})
}
//执行服务器同步
function media_add(befrom, type, status, src) {
	var acc_id = getUser("acc") ? getUser("acc").acc_id : 0;
	var file_id = getUser("servicer") ? getUser("servicer").id : 0;
	mui.post(serverurl + "accountapi/media_add", {
		acc_id: acc_id,
		file_id: file_id,
		befrom: befrom,
		nature: "image",
		type: type,
		src: src,
		status: status
	}, function (data) {
		if (befrom == "cert" || befrom == "life") {
			media_add_success(befrom);
		}
	}, 'json');
}
