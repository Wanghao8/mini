<template>
	<view class="container">
		<view class="header">
			<view class="top flexrac">
				<view class="flexccc topItem">
					<view class="iconfont icont">
						&#xe666;
					</view>
					<view class="title">
						项目3个
					</view>
				</view>
				<view class="flexccc topItem">
					<view class="iconfont icont">
						&#xe601;
					</view>
					<view class="title">
						员工
					</view>
				</view>
				<view class="flexccc topItem">
					<view class="iconfont icont">
						&#xe61e;
					</view>
					<view class="title">
						打卡
					</view>
				</view>
				<view class="flexccc topItem">
					<view class="iconfont icont">
						&#xe670;
					</view>
					<view class="title">
						个人
					</view>
				</view>
			</view>
			<view class="bottom flexrac">
				<view class="bar-wrapper">
					<view class="flexccc barItem">
						<view class="flexr sub">
							<view class="iconfont botIcon">
								&#xe61d;
							</view>
							<view class="circle2" v-if="">
								<view class="num">
									1
								</view>
							</view>
						</view>
						<view class="bomTxt">
							督导反馈
						</view>
					</view>
				</view>
				<view class="bar-wrapper">
					<view class="flexccc barItem">
						<view class="iconfont botIcon">
							&#xe666;
						</view>
						<view class="bomTxt">
							保险申报
						</view>
					</view>
				</view>
				<view class="bar-wrapper">
					<view class="flexccc barItem">
						<view class="flexr sub">
							<view class="iconfont botIcon">
								&#xe604;
							</view>
							<view class="circle2">
								<view class="num">
									1
								</view>
							</view>
						</view>
						<view class="bomTxt">
							请假外派
						</view>
					</view>
				</view>
				<view class="bar-wrapper">
					<view class="flexccc barItem">
						<view class="iconfont botIcon">
							&#xe78d;
						</view>
						<view class="bomTxt">
							工资考勤
						</view>
					</view>
				</view>
			</view>
			</view>
		</view>

		<navigator class="edit flexrbc" url="../edit/AddLog">
			<view class="flexrac input-wrapper">
				<!-- <view class="avatar-wrapper">
					<image class="avatar" src="../../static/logo.jpg" mode=""></image>
				</view> -->
				<input class="record fz15" type="text" value="" placeholder="记录下我的工作" />
			</view>
			<view class="circle1">
				<view class="iconfont camera">
					&#xe68a;
				</view>
			</view>
		</navigator>

		<view class="dayLog flexrss" v-for="item in logList">
			<view class="sub_circle">
				<text class="avatarTxt fz16">日志</text>
			</view>
			<view class="logRight flexc">
				<view class="logTitle">
					{{item.title}}
				</view>
				<view class="flexr image-wrapper">
					<view class="image" v-for="img in item.image" :key="img.index">
						<image :src="img.url" mode="" @tap="readImg(img.url)"></image>
					</view>
				</view>

				<view class="logTimeAdd flexrbc">
					<view class="timeLeft flexrsc">
						<view class="logTime">
							{{item.time}}
						</view>
						<view class="logAdd">
							{{item.add}}
						</view>
					</view>
					<view class="iconfont commentIcon">
						&#xe60c;
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import '../../static/common.css'
	export default {
		data() {
			return {
				logList: [{
						title: '6点开始干活',
						image: [{
							url: '../../static/img/0001.jpg'
						}, ],
						time: '10月前 ·',
						add: '河南省人民政府综合办公楼管理处'
					},
					{
						title: '河南省应急管理厅挂牌仪式！！！',
						image: [{
								url: '../../static/img/0002.jpg'
							},
							{
								url: '../../static/img/0003.jpg'
							},
							{
								url: '../../static/img/0004.jpg'
							},
							{
								url: '../../static/img/0005.jpg'
							},
							{
								url: '../../static/img/0006.jpg'
							},
							{
								url: '../../static/img/0007.jpg'
							},
						],
						time: '11月前 ·',
						add: '河南省人民政府综合办公楼管理处'
					}
				]
			}
		},
		methods: {
			readImg: function(url) {
				console.log(url)
				uni.previewImage({
					urls: [url],
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			}
		}
	}
</script>

<style>
	.container {height: 100vh;}

	.icont {font-size: 60rpx;color: #E4E4E4;}

	.top {background-color: #cc0000;height: 180rpx;}

	.topItem {width: 25%;}

	.title {font-size: 30rpx;color: #F2F2F2;}

	.bottom {background-color: #FFFFFF;height: 120rpx;}

	.bar-wrapper {height: 120rpx;width: 25%;border-right: 1rpx solid #F2F2F2;}

	.barItem {height: 120rpx;}

	.botIcon {font-size: 48rpx;}

	.bomTxt {font-size: 26rpx;}

	.sub {margin-left: 34rpx;}

	.circle2 {height: 32rpx;width: 32rpx;border-radius: 16rpx;background-color: #DD524D;color: #FFFFFF;margin-left: 4rpx;margin-top: -6rpx;}

	.num {text-align: center;line-height: 32rpx;font-size: 20rpx;}

	.edit {margin: 20rpx 0;height: 100rpx;width: 100%;background-color: #FFFFFF;}

	.avatar-wrapper {height: 60rpx;width: 80rpx;margin-left: 26rpx;margin-right: 20rpx;}

	.avatar {height: 60rpx;width: 78rpx;}

	.input-wrapper {width: 100%;}

	.record {width: 80%;}

	.circle1 {width: 60rpx;height: 60rpx;border-radius: 30rpx;background-color: #F5F5F5;margin-right: 20rpx;}

	.camera {line-height: 60rpx;text-align: center;font-size: 40rpx;}

	.dayLog {width: 100%;background-color: #FFFFFF;margin: 20rpx auto;}

	.avatarTxt {line-height: 92rpx;}

	.image-wrapper {flex-wrap: wrap;}

	.logRight {width: 600rpx;}

	.logTitle {font-size: 30rpx;margin-top: 20rpx;color: #333333;}

	.image image {width: 100rpx;height: 120rpx;margin: 10rpx 10rpx 0 0;}

	.logTimeAdd {margin: 28rpx 0;}

	.logTime {font-size: 24rpx;color: #9E9E9E;}

	.logAdd {font-size: 24rpx;color: #0077AA;}

	.commentIcon {color: #4C84AC;font-size: 28rpx;}
</style>
