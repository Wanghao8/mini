/** layui-v2.2.45 MIT License By http://www.layui.com */
layui.define(function(exports) {
	window.selectdata = {
		sendStatusData: [{
			"id": 6,
			"name": "未查看",
			"color": "orange",
			"btn": "查看",
			"badge": "layui-bg-orange",
			"info": "简历等待查看"
		}, {
			"id": 5,
			"name": "待审核",
			"color": "green",
			"btn": "审核完成",
			"badge": "layui-bg-green",
			"info": "等待审核中"
		}, {
			"id": 4,
			"name": "待邀约",
			"color": "green",
			"btn": "邀约完成",
			"badge": "layui-bg-green",
			"info": "等待邀约中"
		}, {
			"id": 3,
			"name": "待面试",
			"color": "green",
			"btn": "面试完成",
			"badge": "layui-bg-green",
			"info": "等待面试中"
		}, {
			"id": 2,
			"name": "待入职",
			"color": "green",
			"btn": "入职完成",
			"badge": "layui-bg-green",
			"info": "等待入职中"
		}, {
			"id": 1,
			"name": "已完成",
			"color": "black",
			"badge": "",
			"btn": "投递结束",
			"info": "已成功入职"
		}, {
			"id": 0,
			"name": "不合格",
			"color": "black",
			"badge": "",
			"btn": "删除简历",
			"info": "简历不合格"
		}],
		educationData: ['不限','大专及以下','大专','本科','硕士','博士'],
		experienceData: ['不限','在校生','1年以内','1-3年','3-5年','5-10年','10年以上'],
		salaryData: ['面议','2k-4k','4k-6k','6k-9k','9k-15k','15k-20k','20k以上'],
		positionStatusData: ['关闭','开启'],
		//转化意向价格
		getIntypes:function(intypes){
			var result="";
			if(!intypes||intypes==""){
				return "暂无服务意向";
			}
			intypes.split(",").forEach(function(item){
				var typeObj=selectdata.getSelectObj(selectdata.fileTypeData,item.split("|")[0]);
				result+=typeObj.name+parseInt(item.split("|")[1])/1000+"k"+" ";
			})
			return result;
		},
		//通用获取处理方法
		getSelectObj: function(ifData, valueDe) {
			var obj;
			for(var i = 0; i < ifData.length; i++) {
				if(ifData[i].id == valueDe) {
					obj = ifData[i];
				}
			}
			return obj;
		},
		initSelect: function(ifData, value, obj) {
			obj.innerHTML = "<option value='0'>全部</option>";
			for(var i = 0; i < ifData.length; i++) {
				var option = document.createElement("option");
				option.value = ifData[i].id;
				option.innerHTML = ifData[i].name.substr(0, 4);
				if(ifData[i].id == value) {
					option.selected = true;
				}
				obj.appendChild(option);
			}
		}
	};
	exports('selectdata', selectdata);
});