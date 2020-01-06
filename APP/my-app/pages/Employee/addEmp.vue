<template>
	<div class="container">
		<form @submit="formSubmit">
			<uni-notice-bar scrollable="true" text="你正在添加新员工，上传证件自动获取基本信息 添加后默认为无保状态，可进行新入保/更换他人操作"></uni-notice-bar>
			<div class="upPhoto flexrsc">
				<div class="textBox fz14 thirdcol">
					传身份证
					正面照片
				</div>
				<div class="upBox" @tap="upImage">
					<div class="iconfont plus">
						&#xeaf3;
					</div>
				</div>
			</div>
			<div id="myPanel" class="idNumber flexccs" >
				<label v-if="showId" :class="focusId ? 'actived' : 'blurColor'" @tap="changeId">身份证号</label>
				<input :class="showId == false ? 'inputBegin fz16' : 'fz16 longInput'" type="text" v-model="formData.idNumber"
				 placeholder="身份证号" :placeholder-class="showId == false ? 'sleep' : 'noDisplay'" @tap="changeId" @blur="resetId" />
			</div>
			<div class="nameSex flexrsc">
				<view class="flexccs shortLeft">
					<label v-if="showName" :class="focusName ? 'actived' : 'blurColor'" @tap="changeName">真实姓名</label>
					<input :class="showName == false ? 'inputBegin fz16' : 'fz16 shortInput'" type="text" v-model="formData.name"
					 placeholder="真实姓名" :placeholder-class="showName == false ? 'sleep' : 'noDisplay'"  @tap="changeName" @blur="resetName" />
				</view>
				<view class="flexrbc">
					<label class="littleLabel fz16 thirdcol">性别</label>
					<!-- <input class="shortInput fz16" type="text" v-model="formData.sex" /> -->
					<picker class="shortInput fz16" mode="selector" :range="formData.sex" @change="changeSex">
						<view>{{formData.sex[sexIndex]}}</view>
					</picker>
				</view>
			</div>
			<div class="nameSex flexrsc">
				<view class="flexccs shortLeft" >
					<label v-if="showCensus" :class="focusCensus ? 'actived' : 'blurColor'"@tap="changeCensus">户籍地址</label>
					<input :class="showCensus == false ? 'inputBegin fz16' : 'fz16 shortInput'" type="text" v-model="formData.census"
					 placeholder="户籍地址" :placeholder-class="showCensus == false ? 'sleep' : 'noDisplay'" @tap="changeCensus" @blur="resetCensus" />
				</view>
				<view class="flexrbc">
					<label class="littleLabel fz16 thirdcol">生日</label>
					<!-- <input class="shortInput fz16" type="text" v-model="formData.birth" /> -->
					<picker class="shortInput fz16" mode="date" @change="changeData" v-model="formData.birth">
						<view>{{formData.birth}}</view>
					</picker>
				</view>
			</div>
			<div class="nameSex flexrsc">
				<view class="flexccs shortLeft">
					<label v-if="showPhoneNum" :class="focusPhoneNum ? 'actived' : 'blurColor'" @tap="changePhoneNum">手机号码</label>
					<input :class="showPhoneNum == false ? 'inputBegin fz16' : 'fz16 shortInput'" type="text" v-model="formData.phoneNum"
					 placeholder="手机号码" :placeholder-class="showPhoneNum == false ? 'sleep' : 'noDisplay'" @tap="changePhoneNum"
					 @blur="resetPhoneNumber" />
				</view>
				<view class="flexccs shortLeft">
					<label v-if="showDuty" :class="focusDuty ? 'actived' : 'blurColor'" @tap="changeDuty">职责</label>
					<input :class="showDuty == false ? 'inputBegin fz16' : 'fz16 shortInput'" type="text" v-model="formData.duty"
					 placeholder="职责" :placeholder-class="showDuty == false ? 'sleep' : 'noDisplay'" @tap="changeDuty" @blur="resetDuty" />
				</view>
			</div>
			<div class="idNumber flexrsc">
				<label class="littleLabel fz16 thirdcol">所在项目</label>
				<!-- <input class="longInput fz16" type="text" v-model="formData.project" /> -->
				<picker class="longInput fz16" mode="selector" :range="formData.project" @change="changePro">
					<view>{{formData.project[proIndex]}}</view>
				</picker>
			</div>
			<div id="myPanel" class="idNumber flexccs">
				<label v-if="showIntro" :class="focusIntro == true ? 'actived' : 'blurColor'" @tap="changeIntro">简要介绍</label>
				<input :class="showIntro == false ? 'inputBegin fz16' : 'fz16 longInput'" type="text" v-model="formData.intro"
				 placeholder="简要介绍" :placeholder-class="showIntro == false ? 'sleep' : 'noDisplay'" @tap="changeIntro" @blur="resetIntro" />
			</div>
			<div class="footer">
				<navigator class="flexrsc" url="Emplist" open-type="redirect">
					<div class="close">
						X
					</div>
					<button class="confirm" form-type="submit">确认添加新入职员工</button>
				</navigator>
			</div>

		</form>
	</div>
</template>

<script>
	import '../../static/common.css'
	import uniNoticeBar from "../../components/uni-notice-bar/uni-notice-bar.vue"
	export default {
		data() {
			return {
				showId: false,
				showName: false,
				showCensus: false,
				showPhoneNum: false,
				showDuty: false,
				showIntro: false,
				focusId:true,
				focusName:true,
				focusCensus:true,
				focusPhoneNum:true,
				focusDuty:true,
				focusIntro:true,
				proIndex: 0,
				sexIndex: 0,
				formData: {
					idNumber: '',
					name: '',
					sex: ['男', '女'],
					census: '',
					birth: '2000-01-01',
					phoneNum: '',
					duty: '',
					project: ['新华通讯社河南分社', '党的生活杂志社'],
					intro: ''
				}
			}
		},
		onLoad() {

		},
		methods: {
			formSubmit: function(e) {
				console.log(e, this.formData, 'form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
			},
			changeData: function(e) {
				this.formData.birth = e.target.value
			},
			changePro: function(e) {
				this.proIndex = e.target.value
			},
			changeSex: function(e) {
				this.sexIndex = e.target.value
			},
			changeId: function(e) {
				this.showId = true
				this.focusId = true
			},
			changeName: function(e) {
				this.showName = true
				this.focusName = true
			},
			changeCensus: function(e) {
				this.showCensus = true
				this.focusCensus = true
			},
			changePhoneNum: function(e) {
				this.showPhoneNum = true
				this.focusPhoneNum = true
			},
			changeDuty: function(e) {
				this.showDuty = true
				this.focusDuty = true
			},
			changeIntro: function(e) {
				this.showIntro = true
				this.focusIntro = true
			},
			resetId: function(e) {
				this.focusId = false
				if (!this.formData.idNumber) this.showId = false
			},
			resetName: function(e) {
				this.focusName = false
				if (!this.formData.name) this.showName = false
			},
			resetCensus: function(e) {
				this.focusCensus = false
				if (!this.formData.census) this.showCensus = false
			},
			resetPhoneNumber: function(e) {
				this.focusPhoneNum = false
				if (!this.formData.phoneNum) this.showPhoneNum = false
			},
			resetDuty: function(e) {
				this.focusDuty = false
				if (!this.formData.duty) this.showDuty = false
			},
			resetIntro: function(e) {
				this.focusIntro = false
				if (!this.formData.intro) this.showIntro = false
			},
			upImage: function(e) {
				uni.chooseImage({
					success: function(res) {
						console.log(JSON.stringify(res.tempFilePaths));
					}
				})
			}
		},
		components: {
			uniNoticeBar
		}
	}
</script>

<style>
	.container {background-color: #FFFFFF;margin: auto 22rpx;margin-bottom: 100rpx;}

	.msgBox {border: 2rpx solid #ffd599;height: 110rpx;width: 702rpx;background-color: #FDF4E7;margin-top: 20rpx;}

	.msgBox p {color: #ea8f05;font-size: 28rpx;text-align: left;line-height: 55rpx;margin-left: 16rpx;}

	.upPhoto {position: relative;height: 156rpx;}

	.upPhoto::after {position: absolute;content: '';-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);bottom: 0;left: 0;width: 100%;border-bottom: 1px solid #F2F2F2;z-index: 10;border-radius: 0;}

	.textBox {height: 68rpx;width: 120rpx;margin: 0 24rpx;}

	.upBox {height: 112rpx;width: 184rpx;border: 2rpx solid #E4E4E4;}

	.plus {font-size: 44rpx;line-height: 112rpx;text-align: center;color: #CCCCCC;}

	.idNumber,
	.nameSex {height: 120rpx;position: relative;}

	.idNumber::after,
	.nameSex::after {position: absolute;content: '';-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);bottom: 0;left: 0;width: 100%;border-bottom: 1px solid #F2F2F2;z-index: 10;border-radius: 0;}

	label {margin: 0 24rpx;}

	.shortLeft {width: 353rpx;}

	.inputBegin {height: 120rpx;line-height: 120rpx;margin-left: 30rpx;}

	.sleep {font-size: 40rpx;;line-height: 120rpx;}

	.actived {font-size: 22rpx;margin-top: -40rpx;color: #007AFF;}
	.blurColor{font-size: 22rpx;margin-top: -40rpx;color: #B6B8B9;}

	.noDisplay {color: transparent;display: none;}

	.littleLabel {margin-left: 30rpx;margin-right: 0;}

	.longInput {width: 500rpx;height: 80rpx;margin-left: 30rpx;line-height: 80rpx;}

	.shortInput {width: 200rpx;height: 80rpx;margin-left: 30rpx;line-height: 80rpx;}

	.footer {position: fixed;bottom: 0; height: 100rpx;width: 706rpx;}
	
	.close {width: 100rpx;height: 100rpx;background-color: #EA8F05;color: #FDF7EC;font-size: 40rpx;text-align: center;line-height: 100rpx;margin: 0;}
	
	.confirm {width: 626rpx;height: 100rpx;background-color: #009900;color: #FFFFFF;font-size: 34rpx;text-align: center;line-height: 100rpx;border-radius: 0;}
	
	button:after {border: none;}
</style>
