//通用配置服务器URL
var serverurl = "http://192.168.0.91:82/index.php/mob/";
//var serverurl = "http://xueyuan.yuanfangyun.com/mob/";
var qiniuurl = "http://jianlis.yuanfangyun.com/";
//UI界面常用字符处理
//==============================================================================
//获取url当前传递参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
//两端去空格函数
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
//显示换行字符
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}
//常用正则汇总
function CheckFormat(value, type) {
    var err = "";
    var reg;
    switch (type) {
        case 'phone':
            reg = /^1[3-5-7-8]\d{9}$/;
            err = "手机号码格式填写错误";
            break;
    }
    if (!reg.test(value)) {
        return true;
    }
    return false;
}
//当数据为空时，页面方法处理
function nullList(obj, noteh, noted) {
    //判断当前页面是否已存在为空数据
    var xx = document.body.querySelector(".nullnote");
    if (xx) {
        xx.parentNode.removeChild(xx);
    }
    var nullnote = document.createElement("div");
    nullnote.className = "nullnote";
    var strVar = "";
    strVar += noteh;
    strVar += "	<br/><span>" + noted + "<\/span>";
    nullnote.innerHTML = strVar;
    obj.appendChild(nullnote);
}
//图片加载失败时，显示照片
function imgloaderror() {
    this.src = "../../../images/onerror.png";
}
//获取指定div对象
function getDom(id) {
    var obj = document.getElementById(id);
    return obj;
}
//获取缓存中用户信息
function getUser(subType) {
    var obj = JSON.parse(localStorage.getItem(subType));
    if (obj == null || obj == undefined || obj == "") {
        return false;
    }
    return obj;
}
//获取当前图片列表路径(去除添加项)
function getPics(imgArray) {
    var pics = "";
    imgArray.each(function (index, item) {
        var is = "";
        var src = item.getAttribute("data-src");
        if (index != 0) {
            is = ",";
        }
        pics += is + src;
    }, false)
    return pics;
}
//初始化页面所有图片位置
function initImgList(obj, height) {
    var imgArrays = obj.getElementsByTagName('img');
    //console.log(imgArrays);
    mui.each(imgArrays, function (index, item) {
        item.onload = function () {
            scale = Number(item.width / item.height);
            if (scale >= 1) {
                var xx = Number((height - height * scale) / 2);
                item.style.height = height + "px";
                item.style.left = xx + "px";
            }
            if (scale < 1) {
                var xx = Number((height - height / scale) / 2);
                item.style.width = height + "px";
                item.style.top = xx + "px";
            }
        }
    })
}
//根据实际出生日期计算年龄
function getAges(datee) {
    var thisyear = new Date().getFullYear();
    var birthyear = new Date(datee).getFullYear();
    var age = (thisyear - birthyear);
    return age;
}
//数据为空时替换值
function isNull(olddata, newdata) {
    if (olddata == null || olddata == "") {
        olddata = newdata;
    }
    return olddata;
}
//多项选择框点击效果
mui(".checkBox").on("tap", "span", function () {
    foucsRemove();
    this.className = this.classList.contains("active") ? "" : "active";
}, false)
mui(".radioBox").on("tap", "span", function () {
    foucsRemove();
    var spanArrays = [].slice.call(this.parentNode.querySelectorAll('span'));
    spanArrays.forEach(function (item) {
        item.className = "";
    });
    this.className = "active";
}, false)
//格式化日期：yyyy-MM-dd
var now = new Date();
function formatDate(datee) {
    if (!datee) {
        return datee;
    }
    var date = new Date(datee);
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var myweekday = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (myyear + "-" + mymonth + "-" + myweekday);
}
//发布时间距离当前显示
function getDateDiff(datee) {
    if (!datee) {
        return "";
    }
    var now = new Date();
    var date2 = new Date(datee);
    Y = date2.getFullYear();
    M = (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1);
    D = date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate();
    h = date2.getHours() < 10 ? '0' + date2.getHours() : date2.getHours();
    m = date2.getMinutes() < 10 ? '0' + date2.getMinutes() : date2.getMinutes();
    var result = M + "-" + D;
    if (formatDate(date2) == formatDate(now)) {
        result = h + ":" + m;
    }
    return result;
}
//发布时间距离当前显示
function daysDiff(date1, date2) {
    var date1 = new Date(date1.replace(/-/g, "/"));
    var date2 = new Date(date2.replace(/-/g, "/"));
    var diffValue = date2.getTime() - date1.getTime();
    var days = parseInt(diffValue / (1000 * 60 * 60 * 24));
    return days;
}
//发布时间距离当前显示
function daysAdd(date, n) {
    var timeadd = new Date(date);
    timeadd.setDate(timeadd.getDate() + n);
    var enddate = formatDate(timeadd);
    return enddate;
}
//移除当前页面文本框焦点
function foucsRemove() {
    mui("body input").each(function (index, item) {
        item.blur();
    }, false)
}
//加载动画显示
function showLoading() {
    var loading = document.getElementById("weui_loading");
    var backdrop=document.getElementById("backdrop");
    if (loading) {
        loading.style.display = "block";
        backdrop.style.display = "block";
    } else {
        var newloading = document.createElement('div');
        var newbackdrop = document.createElement('div');
        newloading.className = "weui_toast";
        newloading.id = "weui_loading";
        newloading.innerHTML = "<div class=\"spinner\"><div class=\"rect1\"><\/div><div class=\"rect2\"><\/div><div class=\"rect3\"><\/div><div class=\"rect4\"><\/div><div class=\"rect5\"><\/div><\/div><p class=\"weui_toast_content\">请稍后…<\/p>";
        newbackdrop.className = "mui-backdrop";
        newbackdrop.id = "backdrop";
        document.body.appendChild(newloading);
        document.body.appendChild(newbackdrop);
    }
}
//加载动画隐藏
function hideLoading() {
    var loading = document.getElementById("weui_loading");
    var backdrop=document.getElementById("backdrop");
    if (loading) {
        loading.style.display = "none";
        backdrop.style.display = "none";
    }
}

//页面通用逻辑判断
//=======================================================================
//跳转其他页面
function gotoUrl(url) {
    window.location.href =url.indexOf("tel")>-1?url:serverurl + url;
}
//数据获取异常通用代码分析
function ajaxError(code, error, role) {
    if (code == "apiFailure") {
        mui.toast("账号登陆过期");
        gotoUrl("account/login?from=" + role);
        return;
    }
    mui.alert('错误代码' + code + "," + error, '操作执行失败');
}
//获取短信验证码
function getPhoneCode(phone, obj) {
    if (CheckFormat(phone, "phone")) {
        mui.toast("手机号码格式错误");
        return;
    }
    //本地测试使用
    setDowmTime(obj);
    obj.setAttribute("data-value", phone + "1234");
    return;
    mui.ajax({
        url: serverurl + "accountapi/send_code_sms",
        type: "post",
        dataType: "json",
        data: { phone: phone },
        beforeSend: function () {
            Setdisabled(obj, true, '正在发送');
        },
        success: function (data) {
            if (!data.res) {
                mui.alert("错误代码" + data.code + "，" + JSON.stringify(data.msg), "验证码发送失败");
                return;
            }
            obj.setAttribute("data-value", phone + data.data);
            setDowmTime(obj);
            mui.toast("验证码发送成功");
            return;
        },
        error: function () {
            Setdisabled(obj, false, '重新发送');
            mui.toast('你的手机好像没有联网哦');
            return;
        }
    });
}
//表单提交时统一禁用按钮
function Setdisabled(obj, status, text, type) {
    obj.disabled = status;
    obj.innerText = text;
    if (type) {
        obj.setAttribute("data-type", type);
    }
}
//倒计时页面体验
var countdown = 10;

function setDowmTime(obj) {
    if (countdown == 0) {
        obj.disabled = false;
        obj.innerText = "获取验证码";
        countdown = 60;
        clearTimeout();
        return;
    }
    obj.disabled = true;
    obj.innerText = "重新发送(" + countdown + ")";
    countdown--;
    setTimeout(function () {
        setDowmTime(obj)
    }, 1000);
}
//通用修改单个字段值接口方法
function updateTableValue(table, id, filed, value, info) {
    mui.ajax({
        type: "post",
        dataType: "json",
        url: serverurl + "accountapi/single_field_update",
        data: {
            acc_id:getUser("acc").acc_id,
            table: table,
            id: id,
            filed: filed,
            value: value,
            info: info
        },
        success: function (data) {
            if (!data.res) {
                ajaxError(data.code, data.msg,"");
                return;
            }
            UpdateTableValueSucess(id, filed);
        },
        error: function () {
            mui.alert('服务器接口异常', "接口执行失败");
        }
    });
}
//获取所有日志信息
function log_list(id, table, obj) {
    mui.ajax({
        url: serverurl + "manageapi/log_list",
        type: "post",
        data: {
            acc_id: getUser("acc").acc_id,
            acc_token: getUser("acc").acc_token,
            where: " sub_id=" + id + " and sub_type='" + table + "' order by id desc",
            page: 1,
            limit: 20
        },
        success: function (data) {
            if (!data.res) {
                mui.alert('错误代码' + data.code + "，" + data.msg, '信息获取失败');
                return;
            }
            var list = data.data,
                logWarning = 0;
            obj.innerHTML = list.length == 0 ? "<div class='null'>暂无任何跟踪记录</div>" : "";
            list.forEach(function (item) {
                var p = document.createElement('p');
                p.innerHTML = "<span class=\"c-title\">" + item.add_time + " " + item.name + "</span><br />" + item.info;
                obj.appendChild(p);
                logWarning = daysDiff(formatDate(item.add_time), formatDate(now));
            })
            if (getDom("logWarning")) {
                getDom("logWarning").innerText = logWarning > 1 ? logWarning + "天未跟踪" : "";
            }
        },
        error: function () {
            mui.alert('请检查网络或联系管理员', "接口服务异常");
            return;
        }
    });
}
//页面弹出层部分 自动执行
var menuWrapper = getDom("menu-wrapper"),
    menu = getDom("menu");
if (menuWrapper && menu) {
    var mask = mui.createMask(hideItem);
}
mui("#menu").on("tap", ".closeItem", function () {
    mask.close();
    hideItem();
}, false)

function showItem(btnType) {
    mui(".actionItem").each(function (index, item) {
        if (item.classList.contains('show')) {
            item.className = "actionItem";
        }
    });
    getDom(btnType).className = "actionItem show";
    menuWrapper.className = 'menu-wrapper fade-in-down animated mui-active';
    menu.className = 'menu bounce-in-down animated';
    mask.show();
}

function hideItem() {
    menuWrapper.className = 'menu-wrapper fade-out-up animated hidden';
    menu.className = 'menu bounce-out-up animated';
}