<template>
	<view class="container">
		<view class="splitLine"></view>
		<view class="header">
			<view class="project flexrbc">
				<view class="pro-left">
					选择项目
				</view>
				<view class="pro-right">
					新华通讯社河南分社
				</view>
			</view>
			<view class="publishSty  flexrbc">
				<view class="pub-left">
					发布类型
				</view>
				<view class="pub-right">
					(日志(现场/工作/活动))
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="split"></view>
			<textarea class="content" value="" placeholder="今天我很开心,因为学到了好多有趣的东西" placeholder-style="margin:10rpx; font-size:30rpx" />
			<view class="upPhoto">		
					<div class="iconfont plus">
						&#xeaf3;
					</div>
			</view>
		</view>
		<navigator class="flexrsc pub-btn" url="../manage/Index" open-type="redirect" >
			<div class="close">
				X
			</div>
			<button class="confirm">发布日志</button>
		</navigator>
	</view>
</template>

<script>
	import '../../static/common.css'
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
	
		},
		methods: {
	
		}
	}
</script>

<style>
	uni-page-body{background-color: #E7E8ED;}
	.splitLine{height: 20rpx;background-color: #E7E8ED ;}
	.container{margin:auto 20rpx;background-color: #E7E8ED;}
	.header{height: 200rpx;width: 100%;margin-bottom: 20rpx;background-color: #FFFFFF;}
	.project,.publishSty{height: 100rpx;width: 100%;border-bottom: 2rpx solid #EDECEC;}
	.pro-left{color:#ff7777 ;font-size:28rpx ;line-height: 100rpx;margin-left:20rpx;}
	.pro-right{color:#868686 ;font-size:30rpx;line-height: 100rpx;margin-right: 20rpx;}
	.pub-left{color: #3D4145; font-size: 28rpx;margin-left:20rpx;}
	.pub-right{color: #868686;font-size: 30rpx;margin-right: 20rpx;}
	.footer{height: 580rpx;width: 100%; background-color: #FFFFFF;}
	.split{height: 24rpx;color:#FFFFFF ;}
	.content{margin-bottom: 24rpx;margin-left: 24rpx;border: 2rpx solid #F1F1F1;width: 660rpx;height: 300rpx; hefont-size: 30rpx;}
	.upPhoto{width: 200rpx;height: 200rpx;border: 2rpx solid #D6D6D6;margin-left: 24rpx;border-radius: 20rpx;}
	.plus{font-size: 160rpx;line-height: 200rpx;text-align: center;color: #D6D6D6;}
	.pub-btn{margin-top: 20rpx;}
	.close {width: 80rpx;height: 80rpx;background-color: #EA8F05;color: #FDF7EC;font-size: 40rpx;text-align: center;line-height: 80rpx;margin: 0;}
	.confirm {width: 630rpx;height: 80rpx;background-color: #DD524D;color: #FFFFFF;font-size: 28rpx;text-align: center;line-height: 80rpx;border-radius: 0;}
	button:after {border: none;}
</style>
