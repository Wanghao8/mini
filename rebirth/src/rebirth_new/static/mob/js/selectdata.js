//*黄栾 整理
//*时间：2018年09月03日
//任务进度转换
var fileTypeData = [{
	"id": "",
	"name": "",
	"color": "",
	"bcolor": "",
	"badge":"",
	"info": "",
	"icon":""
}, {
	"id": "yuesao",
	"name": "月嫂",
	"color": "pink",
	"bcolor": "bpink",
	"badge":"mui-badge-warning",
	"info": "月嫂服务",
	"icon":"icon-yuesao"
}, {
	"id": "yuer",
	"name": "育婴",
	"color": "green",
	"bcolor": "bgreen",
	"badge":"mui-badge-success",
	"info": "育婴师",
	"icon":"icon-yuer"
}, {
	"id": "baomu",
	"name": "育儿",
	"color": "blue",
	"bcolor": "bblue",
	"badge":"mui-badge-primary",
	"info": "育儿嫂",
	"icon":"icon-baomu"
}, {
	"id": "yanglao",
	"name": "陪护",
	"color": "dark",
	"bcolor": "bdark",
	"badge":"mui-badge-purple",
	"info": "养老护理",
	"icon":"icon-yanglao"
}];
var fileStatusData = [{
	"id":0,
	"name": "关闭",
	"badge": "",
	"info":"暂停服务"
}, {
	"id":1,
	"name": "正常",
	"badge": "",
	"info":""
}, {
	"id":2,
	"name": "上户",
	"badge": "mui-badge-warning",
	"info":"正在上户"
}, {
	"id":3,
	"name": "待岗",
	"badge": "mui-badge-danger",
	"info":"今日推荐"
}];
var fileGradeData = [{
	"id":1,
	"name": "正常",
	"badge": "",
	"info":""
}, {
	"id":2,
	"name": "会员制",
	"badge": "mui-badge-purple",
	"info":"优中选优，用户放心"
}, {
	"id":3,
	"name": "签约制",
	"badge": "mui-badge-success",
	"info":"与公司签约，确保安全"
}];
var fileQualityData = [{
	"id":0,
	"name": "黑名单",
	"badge": "mui-badge-black",
	"info":""
}, {
	"id":1,
	"name": "正常",
	"badge": "",
	"info":""
}, {
	"id":2,
	"name": "优秀",
	"badge": "mui-badge-warning",
	"info":"获得多项荣誉，放心使用"
}];
var fileEvalData = [{
	"id":1,
	"name": "差评",
	"xing": "☆☆☆☆☆"
}, {
	"id": 2,
	"name": "中评",
	"xing": "★★★☆☆"
}, {
	"id":3,
	"name": "好评",
	"xing": "★★★★★"
}];
var fileHobbyData=new Array("学历高","会开车","经验足","形象好","气质佳","做饭强","沟通好","技术硬","懂护理","能唱歌","会跳舞","有医术");
var fileLevelData=new Array("不限等级","初级服务","中级服务","高级服务","特级服务");
var fileEduData=new Array("","初中","高中","大专","本科");
var fileScheData=new Array("","内单","外单","休息");
var fileScheStatusData=new Array("评价已结束","完成待评价","正在服务中","预定准备中");

var clueStatusData = [{
	"id": 3,
	"name": "待查看",
	"color": "red",
	"badge": "mui-badge-danger",
	"info": "等待我来受理"
}, {
	"id": 2,
	"name": "跟进中",
	"color": "green",
	"badge": "mui-badge-success",
	"info": "正在整改中"
}, {
	"id": 1,
	"name": "已成交",
	"color": "dark",
	"badge": "",
	"info": "等待客户评价"
}, {
	"id": 0,
	"name": "已失败",
	"badge": "",
	"color": "dark",
	"info": "不再跟进"
}];
var clueChannelData = [{
	"id": "article",
	"name": "文章分享"
}, {
	"id":"file",
	"name": "档案分享"
}, {
	"id":"family",
	"name": "海报分享"
}, {
	"id":"app",
	"name": "app端"
}];
var familyStatusData = [{
	"id": 5,
	"name": "待生效",
	"color": "red",
	"badge": "mui-badge-danger",
	"btn":"订单生效",
	"info": "下单未生效"
}, {
	"id": 4,
	"name": "待上户",
	"color": "yellow",
	"btn":"现在上户",
	"badge": "mui-badge-warning",
	"info": "准备去上户"
}, {
	"id": 3,
	"name": "服务中",
	"color": "green",
	"btn":"立即下户",
	"badge": "mui-badge-success",
	"info": "正在服务中"
}, {
	"id":2,
	"name": "待结算",
	"color": "blue",
	"badge": "mui-badge-primary",
	"btn":"申请费用结算",
	"info": "下户待结算"
}, {
	"id":1,
	"name": "已结束",
	"color": "dark",
	"badge": "",
	"btn":"订单结束",
	"info": "订单已结束"
}, {
	"id":0,
	"name": "已作废",
	"color": "dark",
	"badge": "",
	"btn":"作废订单",
	"info": "订单已作废"
}];
var courseStatusData = [{
	"id": 5,
	"name": "等待付款",
	"color": "red",
	"badge": "mui-badge-danger",
	"btn":"立即付款",
	"info": "下单未付款"
}, {
	"id": 4,
	"name": "即将上课",
	"color": "yellow",
	"btn":"现在开课",
	"badge": "mui-badge-warning",
	"info": "准备去上课"
}, {
	"id": 3,
	"name": "正在学习",
	"color": "green",
	"btn":"培训完成",
	"badge": "mui-badge-success",
	"info": "正在服务中"
}, {
	"id":2,
	"name": "培训完成",
	"color": "blue",
	"badge": "mui-badge-primary",
	"btn":"结束离校",
	"info": "培训已完成"
}, {
	"id":1,
	"name": "结束离校",
	"color": "dark",
	"badge": "",
	"btn":"课程结束",
	"info": "订单已结束"
}, {
	"id":0,
	"name": "订单作废",
	"color": "dark",
	"badge": "",
	"btn":"作废订单",
	"info": "订单已作废"
}];
var teamStatusData = [{
	"id": 3,
	"name": "等待付款",
	"color": "red",
	"badge": "mui-badge-danger",
	"btn":"立即付款",
	"info": "下单未付款"
}, {
	"id": 2,
	"name": "正在返还",
	"color": "yellow",
	"btn":"正在返还",
	"badge": "mui-badge-success",
	"info": "师傅带课中"
}, {
	"id": 1,
	"name": "返还结束",
	"color": "green",
	"btn":"学成毕业",
	"badge": "",
	"info": "订单已完成"
}, {
	"id":0,
	"name": "订单作废",
	"color": "dark",
	"badge": "",
	"btn":"作废订单",
	"info": "订单已作废"
}];

var wagesStatusData = [{
	"id": 1,
	"name": "工资已发放",
	"color": "dark",
	"badge": "mui-badge",
	"info":"工资已发放"
}, {
	"id": 2,
	"name": "正在营业中",
	"color": "green",
	"badge": "mui-badge-success",
	"info":"本月继续创收中"
}, {
	"id": 3,
	"name": "财务出账中",
	"color": "yellow",
	"badge": "mui-badge-warning",
	"info":"等待财务人员审核"
}];
var finOrderTypeData = [{
	"id": "t_order_family",
	"name": "家政订单",
	"code": 100000,
	"onewords":"为你提供签约制家政服务"
}, {
	"id": "t_order_course",
	"name": "招生订单",
	"code": 200000,
	"onewords":"母婴从业者的家政大学"
}, {
	"id": "t_order_team",
	"name": "团队订单",
	"code": 300000,
	"onewords":"和我一起携手 共赢新家政"
}, {
	"id": "t_order_other",
	"name": "其他订单",
	"code": 0
}];
var finChannelData = [{
	"id": "wechat",
	"name": "微信支付"
}, {
	"id": "alipay",
	"name": "支付宝支付"
}, {
	"id": "union",
	"name": "银联卡支付"
}, {
	"id": "offline ",
	"name": "代收代付"
}, {
	"id": "wages",
	"name": "入账工资单"
}, {
	"id": "bill",
	"name": "入账对账单"
}];
var finTypeData = [{
	"id": "income_family_pay",
	"name": "家政单付款"
}, {
	"id": "income_course_pay",
	"name": "招生单付款"
}, {
	"id": "income_team_pay",
	"name": "合伙人付款"
}, {
	"id": "expend_family_add",
	"name": "家政下单提成"
}, {
	"id": "expend_family_man",
	"name": "家政派单提成"
}, {
	"id": "expend_family_profit",
	"name": "家政公司营收"
}, {
	"id": "expend_return_money",
	"name": "订单退款费用"
}, {
	"id": "expend_course_add",
	"name": "招生下单提成"
}, {
	"id": "expend_course_profit ",
	"name": "培训学校营收"
}, {
	"id": "expend_team_add",
	"name": "合伙人课时费"
}, {
	"id": "expend_team_profit",
	"name": "合伙人公司营收"
}, {
	"id": "expend_other_add",
	"name": "其他收入"
}];
//通过值获取显示对象
function getSelectObj(ifData, valueDe) {
	var obj;
	mui.each(ifData, function(index, item) {
		if(item.id == valueDe) {
			obj = item;
		}
	}, false)
	return obj;
}
//初始化选择框
function initSelect(ifdata, value, obj) {
	obj.innerHTML = "";
	mui.each(ifdata, function(index, item) {
		var option = document.createElement("option");
		option.value = item.id;
		option.innerText = item.name;
		if(item.id == value) {
			option.selected = true;
		}
		obj.appendChild(option);
	}, false)
}
//初始化选择框by数组
function initSelectArr(ifdata, obj) {
	obj.innerHTML = "";
	mui.each(ifdata, function(index, item) {
		var option = document.createElement("option");
		option.value = index;
		option.innerText =item;
		obj.appendChild(option);
	}, false)
}
//初始化技能标签框by数组
function initCheckBoxArr(ifdata, obj) {
	mui.each(ifdata, function(index, item) {
		var span = document.createElement("span");
		span.setAttribute("data-value",item);
		span.innerText =item;
		obj.appendChild(span);
	}, false)
}