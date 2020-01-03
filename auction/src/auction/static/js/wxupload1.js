const qiniuUploader = require("qiniuUploader.js");
var imgSuccessArray=[];
var qiniuToken = '';
module.exports = {
	//调用微信选择图片
	uploadImg: function(page,type,num) {
    console.log(page+';'+type+';'+num)

		let _self=this;
		if (!(0 < num < 8)){
			return;
		}
		imgSuccessArray=[];
		wx.chooseImage({
			count: num,
			sizeType: ['compressed'],
			success: function(res) {
				var imageArray = res.tempFilePaths;
        
				for (var i = 0; i < imageArray.length; i++) {
					var filePath = imageArray[i];
					if(i==imageArray.length-1){
						_self.uploadQiniu(page,type,filePath,true);
					}else{
						_self.uploadQiniu(page,type,filePath,false);
					}
				} 
        
			}
		})
	},

  
	//调用七牛上传图片
	uploadQiniu: function(page,type,filePath,isLast) {


		let _self=this; 
		var key=_self.getKey();
    wx.showLoading({
      title: '正在上传'
    })
		qiniuUploader.upload(filePath, (res) => {
      imgSuccessArray.push(key);
				if(isLast){
					page.imgSuccess(imgSuccessArray,type);
				}
			},
			(error) => {
        wx.hideLoading();
        wx.showToast({
          title: '上传照片失败' + error
        })
			}, {
        domain: 'https://paimais.yuanfangyun.com/',
				uptoken: qiniuToken,
        uploadURL: 'https://up-z1.qiniup.com/',
				key:key
		});
	},
	//定义图片路径及名称
	getKey: function() {
		var myDate = new Date(); //获取系统当前时间
		var filename = myDate.getFullYear() + '' + parseInt(myDate.getMonth() + 1) + '' + myDate.getDate() + '' + myDate.getHours() +
			'' + myDate.getMinutes() + '' + myDate.getSeconds();
		filename += Math.random().toString().substr(2, 3) + '.jpg';
		return filename;
	},
	getQiuniuToken:function(){
		wx.request({
      url: 'https://paimai.yuanfangyun.com/mini/commonapi/qiniu_uptoken',
			success(res) {
				qiniuToken = res.data;
			}
		})
	}
}
