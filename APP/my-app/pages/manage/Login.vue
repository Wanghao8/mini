<template>
	<div class="container flexc0c pagebackcol">
		<div class="header flexc0c">
			<div class="circle">
				<div class="text">
					云
				</div>
			</div>
			<div class="title">
				圆方物业云-保险申报系统
			</div>
		</div>
		<div class="footer flexc0c">
			<view class="phoneNum">
				<input class="inputSty" type="phone" value="" placeholder="  请输入项目经理手机号" />
			</view>

			<div class="verify">
				<input class="inputSty verInput" type="phone" value="" placeholder="  请输入短信验证码" />
				<button class="verBtn">获取验证码</button>
			</div>
			<button class="loginBtn">绑定微信进入保险系统</button>
		</div>
	</div>
</template>

<script>
	import '../../static/common.css'
	export default {
		data() {
			return {
				title: 'Hello',
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.container {height: 100vh;}

	.circle {width: 180rpx;height: 180rpx;border: 2rpx solid #808080;border-radius: 50%;background-color: #FFFFFF;}

	.header {height: 268rpx;margin-top: 160rpx;}

	.text {text-align: center;font-size: 64rpx;line-height: 180rpx;}

	.title {font-size: 32rpx; margin-top: 40rpx;}

	.footer {height: 360rpx;width: 100%;margin-top: 200rpx;}

	.phoneNum {width: 100%;margin-left: 100rpx;}

	.inputSty {width: 87%;height: 88rpx;line-height: 88rpx;font-size: 28rpx;border: 2rpx solid #cccccc;background-color: #FFFFFF;}

	.verify {margin-top: 36rpx;width: 87%;height: 90rpx;}

	.verInput {width: 100%;height: 88rpx;}

	.verBtn {font-size: 28rpx;width: 240rpx;height: 88rpx;line-height: 88rpx;border-radius: 50;float: right;top: -90rpx;right: -2rpx;}

	.loginBtn {height: 96rpx;width: 87%;font-size: 28rpx;line-height: 96rpx;background-color: #CCCCCC;border-radius: 50;margin-top: 50rpx;}
</style>
